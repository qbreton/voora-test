# Script de configuration pour le développement local (Windows PowerShell)
# Usage: .\setup-local.ps1

Write-Host "🔧 Configuration du développement local pour Voora SDK" -ForegroundColor Cyan
Write-Host ""

# Vérifier si .env existe
if (-not (Test-Path .env)) {
    Write-Host "⚠️  Fichier .env non trouvé" -ForegroundColor Yellow
    Write-Host "📋 Création depuis .env.example..."
    Copy-Item .env.example .env
    Write-Host "✅ Fichier .env créé" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT : Éditez le fichier .env avec vos vraies valeurs" -ForegroundColor Yellow
    Write-Host "   1. Ouvrez .env dans votre éditeur"
    Write-Host "   2. Remplacez les valeurs par vos clés depuis le dashboard Voora"
    Write-Host "   3. Sauvegardez le fichier"
    Write-Host ""
} else {
    Write-Host "✅ Fichier .env trouvé" -ForegroundColor Green
}

# Lire les variables depuis .env
$envVars = @{}
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $envVars[$matches[1].Trim()] = $matches[2].Trim()
        }
    }
}

$VOORA_API_KEY = $envVars['VOORA_API_KEY']
$VOORA_ORG_ID = $envVars['VOORA_ORG_ID']
$VOORA_API_URL = $envVars['VOORA_API_URL']

# Créer config.local.js avec les vraies valeurs
Write-Host "📝 Création de config.local.js..." -ForegroundColor Cyan

$configContent = @"
// Configuration Voora SDK pour développement local
// ⚠️ Ce fichier est ignoré par git (.gitignore)

const VOORA_CONFIG = {
  organizationId: "$VOORA_ORG_ID",
  apiKey: "$VOORA_API_KEY",
  apiUrl: "$VOORA_API_URL"
}

if (typeof window !== 'undefined') {
  window.VOORA_CONFIG = VOORA_CONFIG
}
"@

$configContent | Out-File -FilePath "config.local.js" -Encoding UTF8

Write-Host "✅ config.local.js créé avec vos variables d'environnement" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Configuration terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "   1. Ouvrez index.html dans votre navigateur"
Write-Host "   2. Vérifiez la console (F12) pour confirmer l'initialisation"
Write-Host "   3. Pour déployer sur GitHub Pages, configurez les secrets dans :"
Write-Host "      Settings > Secrets and variables > Actions"
Write-Host ""
