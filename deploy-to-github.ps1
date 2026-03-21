# Pie Boy — Deploy to GitHub Pages
# Double-click this file (or run in PowerShell) to push your game live.
# Make sure you've already run: gh auth login

Set-Location $PSScriptRoot

Write-Host "=== Pie Boy Deploy Script ===" -ForegroundColor Cyan

# Remove any existing git repo and start fresh
if (Test-Path ".git") {
    Write-Host "Removing old git repo..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".git"
}

# Init fresh repo
git init
git branch -M main

# Stage only the game files (node_modules etc are in .gitignore)
git add .
git commit -m "Deploy Pie Boy game"

# Get GitHub username
$username = gh api user --jq ".login"
Write-Host "GitHub user: $username" -ForegroundColor Green

# Delete existing remote repo if it exists, then recreate
gh repo delete "$username/pieboy-game" --yes 2>$null
gh repo create pieboy-game --public --source=. --remote=origin --push

# Enable GitHub Pages
gh api "repos/$username/pieboy-game/pages" --method POST -f "source[branch]=main" -f "source[path]=/"

Write-Host ""
Write-Host "=== Done! ===" -ForegroundColor Green
Write-Host "Your game will be live in ~1 minute at:" -ForegroundColor Green
Write-Host "https://$username.github.io/pieboy-game" -ForegroundColor Cyan
Write-Host ""
pause
