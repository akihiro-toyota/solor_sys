/**
 * Solar Subsidy AI Navigator - Calculator Engine
 * Realistic simulation formulas for Solar & Battery systems in Japan
 */

const GRID_ELECTRIC_PRICE = 31; // 円/kWh (日本の平均的な電気受給単価)
const FIT_PRICE = 16;           // 円/kWh (FIT売電単価)
const CO2_FACTOR = 0.45;        // kg-CO2/kWh (太陽光発電によるCO2削減係数)
const CO2_CEDAR_ABSORPTION = 14; // kg-CO2/年 (杉の木1本あたりの年間CO2吸収量)

/**
 * Perform all financial and energy savings calculations.
 * 
 * @param {Object} params
 * @param {string} params.regionId - 'tokyo', 'yokohama', 'saitama', 'nagoya', 'osaka', 'custom'
 * @param {string} params.solarProductId - Selected solar panel ID or "none"
 * @param {number} params.solarPanelCount - Number of solar panels
 * @param {string} params.batteryProductId - Selected battery ID or "none"
 * @param {number} params.monthlyElectricBill - Monthly electricity bill in JPY
 * @param {Object} [params.customRates] - Custom subsidy settings (only if regionId is 'custom')
 * @param {number} params.customRates.solarRate
 * @param {number} params.customRates.solarMax
 * @param {number} params.customRates.batteryRate
 * @param {number} params.customRates.batteryMax
 * @returns {Object} Full simulation results
 */
function calculateSimulation({
  regionId,
  solarProductId,
  solarPanelCount,
  batteryProductId,
  monthlyElectricBill,
  customRates = null
}) {
  // 1. Find product specifications
  const solarProduct = SOLAR_PRODUCTS.find(p => p.id === solarProductId);
  const batteryProduct = BATTERY_PRODUCTS.find(p => p.id === batteryProductId);
  const region = SUBSIDY_DATABASE[regionId];

  const hasSolar = !!solarProduct && solarPanelCount > 0;
  const hasBattery = !!batteryProduct;

  // 2. System Specifications
  const solarCapacity = hasSolar ? (solarPanelCount * solarProduct.output) : 0; // kW
  const batteryCapacity = hasBattery ? batteryProduct.capacity : 0; // kWh

  // 3. Estimate Initial Cost
  let solarCost = 0;
  if (hasSolar) {
    // Panel cost + Baseline cost (inverters, mounting rack, construction standard fee: 350,000 JPY)
    solarCost = (solarPanelCount * solarProduct.estPricePerUnit) + 350000;
  }
  const batteryCost = hasBattery ? batteryProduct.estPrice : 0;
  const totalInitialCost = solarCost + batteryCost;

  // 4. Calculate Subsidies
  let nationalSolarSubsidy = 0;
  let nationalBatterySubsidy = 0;
  let localSolarSubsidy = 0;
  let localBatterySubsidy = 0;

  // National subsidies
  if (hasBattery) {
    // 1kWh around 3.7万円, max 20万円
    nationalBatterySubsidy = Math.min(
      SUBSIDY_DATABASE.national.battery.max,
      batteryCapacity * SUBSIDY_DATABASE.national.battery.rate
    );
  }

  // Local subsidies
  if (region) {
    let solarRate = region.solar.rate;
    let solarMax = region.solar.max;
    let batteryRate = region.battery.rate;
    let batteryMax = region.battery.max;

    // Apply custom slider values if the user selected custom regional profile
    if (regionId === "custom" && customRates) {
      solarRate = customRates.solarRate;
      solarMax = customRates.solarMax;
      batteryRate = customRates.batteryRate;
      batteryMax = customRates.batteryMax;
    }

    if (hasSolar && solarRate > 0) {
      localSolarSubsidy = Math.min(
        solarMax,
        solarCapacity * solarRate
      );
    }
    if (hasBattery && batteryRate > 0) {
      localBatterySubsidy = Math.min(
        batteryMax,
        batteryCapacity * batteryRate
      );
    }
  }

  const totalSubsidy = nationalSolarSubsidy + nationalBatterySubsidy + localSolarSubsidy + localBatterySubsidy;
  const netInitialCost = Math.max(0, totalInitialCost - totalSubsidy);

  // 5. Energy Generation & Electricity Consumptions
  // Annual power bill -> estimate annual consumption
  const estimatedMonthlyKwh = monthlyElectricBill / GRID_ELECTRIC_PRICE;
  const annualConsumptionKwh = estimatedMonthlyKwh * 12;

  // Average JPY solar generation in Japan: ~1,100 kWh per 1 kW capacity per year
  const annualGenerationKwh = solarCapacity * 1100;

  // Self-consumption rate model:
  // - Solar only: around 30% of generation is consumed instantly, 70% sold
  // - Solar + Battery: around 65% of generation is consumed (storing daytime excess for night use), 35% sold
  let selfConsumptionRate = 0;
  if (hasSolar) {
    selfConsumptionRate = hasBattery ? 0.65 : 0.30;
  }

  let selfConsumedKwh = annualGenerationKwh * selfConsumptionRate;
  // Cannot self-consume more than total annual consumption
  if (selfConsumedKwh > annualConsumptionKwh) {
    selfConsumedKwh = annualConsumptionKwh;
  }
  const soldKwh = Math.max(0, annualGenerationKwh - selfConsumedKwh);

  // 6. Annual Financial Benefits
  let savingsFromSelfConsumption = selfConsumedKwh * GRID_ELECTRIC_PRICE;
  let revenueFromSelling = soldKwh * FIT_PRICE;
  let batteryNightArbitrageSavings = 0;

  // If ONLY battery (No solar)
  if (!hasSolar && hasBattery) {
    // Buy cheap night-rate power (approx. 18 JPY/kWh) and use it during peak daytime (approx. 35 JPY/kWh)
    // Arbitrage profit: ~17 JPY/kWh. 1 cycle per day, 90% roundtrip efficiency.
    const dailyArbitrageKwh = batteryCapacity * 0.90;
    batteryNightArbitrageSavings = dailyArbitrageKwh * 17 * 365;
  }

  const totalAnnualSavings = savingsFromSelfConsumption + revenueFromSelling + batteryNightArbitrageSavings;

  // 7. Payback Years (ROI)
  const paybackYears = totalAnnualSavings > 0 ? (netInitialCost / totalAnnualSavings) : 99;

  // 8. CO2 Reduction
  const co2ReductionKg = annualGenerationKwh * CO2_FACTOR;
  const cedarTrees = Math.round(co2ReductionKg / CO2_CEDAR_ABSORPTION);

  return {
    hasSolar,
    hasBattery,
    solarCapacity: parseFloat(solarCapacity.toFixed(2)),
    batteryCapacity: parseFloat(batteryCapacity.toFixed(1)),
    totalInitialCost,
    subsidies: {
      nationalSolar: nationalSolarSubsidy,
      nationalBattery: nationalBatterySubsidy,
      localSolar: localSolarSubsidy,
      localBattery: localBatterySubsidy,
      total: totalSubsidy
    },
    netInitialCost,
    annualGenerationKwh: Math.round(annualGenerationKwh),
    selfConsumptionRate: Math.round(selfConsumptionRate * 100),
    selfConsumedKwh: Math.round(selfConsumedKwh),
    soldKwh: Math.round(soldKwh),
    savings: {
      selfConsumption: Math.round(savingsFromSelfConsumption),
      selling: Math.round(revenueFromSelling),
      arbitrage: Math.round(batteryNightArbitrageSavings),
      total: Math.round(totalAnnualSavings)
    },
    paybackYears: paybackYears < 99 ? parseFloat(paybackYears.toFixed(1)) : null,
    co2ReductionKg: Math.round(co2ReductionKg),
    cedarTrees
  };
}
