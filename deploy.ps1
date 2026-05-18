# Solar Subsidy AI Navigator - Raspberry Pi Deployment Script
# This script copies the application files to your connected Raspberry Pi using SCP.

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host " ☀️ Solar AI Navigator - Raspberry Pi デプロイ" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Get Connection Information from User
$ip = Read-Host "Raspberry Pi の IP アドレスを入力してください (例: 192.168.1.10)"
if (-not $ip) {
    Write-Host "IP アドレスが入力されなかったため、処理を中断します。" -ForegroundColor Red
    Exit
}

$user = Read-Host "ユーザー名を入力してください [デフォルト: pi]"
if (-not $user) { $user = "pi" }

$destPath = Read-Host "転送先のパスを入力してください [デフォルト: /var/www/html/solar_subsidy_navigator]"
if (-not $destPath) { $destPath = "/var/www/html/solar_subsidy_navigator" }

Write-Host ""
Write-Host "----------------------------------------------"
Write-Host "接続情報を確認しました。"
Write-Host " 接続先: ${user}@${ip}"
Write-Host " 転送先: ${destPath}"
Write-Host "----------------------------------------------"
Write-Host ""

# 2. Check if SCP is available in this Windows environment
if (-not (Get-Command scp -ErrorAction SilentlyContinue)) {
    Write-Host "[エラー] Windows環境に 'scp' コマンドが見つかりません。OpenSSH クライアント機能が有効であることを確認してください。" -ForegroundColor Red
    Exit
}

# 3. Create destination directory structure via SSH (ensures destination exists)
Write-Host "転送先ディレクトリを作成・確認中..." -ForegroundColor Yellow
ssh ${user}@${ip} "sudo mkdir -p ${destPath} && sudo chown -R ${user}:${user} ${destPath}"

# 4. Perform SCP Transfer of all critical assets
Write-Host "ファイルを Raspberry Pi へ転送しています..." -ForegroundColor Yellow
$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Copy index.html, style.css, data.js, calculator.js, app.js
$files = @("index.html", "style.css", "data.js", "calculator.js", "app.js")
foreach ($file in $files) {
    $srcFile = Join-Path $currentDir $file
    if (Test-Path $srcFile) {
        Write-Host " 📤 ${file} を送信中..." -ForegroundColor Cyan
        scp $srcFile "${user}@${ip}:${destPath}/${file}"
    } else {
        Write-Host " [警告] ${file} が見つかりません。" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 転送が成功しました！" -ForegroundColor Green
Write-Host "----------------------------------------------"
Write-Host "Raspberry Pi 側で公開するための設定手順:" -ForegroundColor Cyan
Write-Host "1. Nginx や Apache がインストールされている場合:"
Write-Host "   ブラウザから http://${ip}/solar_subsidy_navigator/ にアクセスして公開されているか確認してください。"
Write-Host ""
Write-Host "2. 簡易的にポート 8000 でホストする場合 (SSH 上で実行):"
Write-Host "   ssh ${user}@${ip}"
Write-Host "   cd ${destPath}"
Write-Host "   python3 -m http.server 8000"
Write-Host "   (その後ブラウザから http://${ip}:8000/ にアクセス)"
Write-Host "==============================================" -ForegroundColor Green
Read-Host "エンターキーを押すと終了します..."
