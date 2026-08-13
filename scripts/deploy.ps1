param (
    [Parameter(Mandatory=$true)]
    [string]$Token
)

$Owner = "DimEk74"
$Repo = "buhgalt2"
$Branch = "main"

$ProjectRoot = (Resolve-Path "$PSScriptRoot\..").Path

Write-Host "Deploying files from $ProjectRoot to $Owner/$Repo ..." -ForegroundColor Cyan

$Files = Get-ChildItem -Path $ProjectRoot -Recurse -File | Where-Object { 
    $_.FullName -notmatch '\\(\.git|\.gemini|node_modules|\.agents|scratch)' -and $_.Name -ne '.DS_Store'
}

$SuccessCount = 0
$FailCount = 0

$Headers = @{
    "Authorization" = "Bearer $Token"
    "Accept"        = "application/vnd.github+json"
    "User-Agent"    = "Antigravity-Deployer"
}

foreach ($File in $Files) {
    $RelPath = $File.FullName.Substring($ProjectRoot.Length + 1).Replace('\', '/')
    Write-Host "Uploading: $RelPath ..." -ForegroundColor Yellow

    $Bytes = [System.IO.File]::ReadAllBytes($File.FullName)
    $B64 = [System.Convert]::ToBase64String($Bytes)

    $Url = "https://api.github.com/repos/$Owner/$Repo/contents/$RelPath"

    $Sha = $null
    try {
        $Existing = Invoke-RestMethod -Uri $Url -Method Get -Headers $Headers -ErrorAction SilentlyContinue
        if ($Existing.sha) { $Sha = $Existing.sha }
    } catch {}

    $Body = @{
        message = "Deploy $RelPath"
        content = $B64
        branch  = $Branch
    }
    if ($Sha) { $Body["sha"] = $Sha }

    $JsonBody = $Body | ConvertTo-Json -Depth 5

    try {
        $Response = Invoke-RestMethod -Uri $Url -Method Put -Headers $Headers -Body ([System.Text.Encoding]::UTF8.GetBytes($JsonBody)) -ContentType "application/json"
        Write-Host "OK: $RelPath" -ForegroundColor Green
        $SuccessCount++
    } catch {
        Write-Host "ERROR uploading $RelPath : $_" -ForegroundColor Red
        $FailCount++
    }
}

Write-Host "Uploaded files: $SuccessCount (errors: $FailCount)" -ForegroundColor Cyan

$SiteUrl = "https://" + $Owner.ToLower() + ".github.io/" + $Repo + "/"

if ($SuccessCount -gt 0) {
    Write-Host "Enabling GitHub Pages..." -ForegroundColor Cyan
    try {
        $PagesUrl = "https://api.github.com/repos/$Owner/$Repo/pages"
        $PagesBody = @{ source = @{ branch = $Branch; path = "/" } } | ConvertTo-Json
        $PagesResponse = Invoke-RestMethod -Uri $PagesUrl -Method Post -Headers $Headers -Body ([System.Text.Encoding]::UTF8.GetBytes($PagesBody)) -ContentType "application/json"
        Write-Host "GitHub Pages activated successfully!" -ForegroundColor Green
        Write-Host "URL: $SiteUrl" -ForegroundColor Green
    } catch {
        Write-Host "Pages status note: $_" -ForegroundColor Yellow
        Write-Host "URL: $SiteUrl" -ForegroundColor Green
    }
}
