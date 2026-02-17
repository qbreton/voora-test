#!/bin/bash

# Script de configuration pour le développement local
# Usage: ./setup-local.sh

echo "🔧 Configuration du développement local pour Voora SDK"
echo ""

# Vérifier si .env existe
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env non trouvé"
    echo "📋 Création depuis .env.example..."
    cp .env.example .env
    echo "✅ Fichier .env créé"
    echo ""
    echo "⚠️  IMPORTANT : Éditez le fichier .env avec vos vraies valeurs"
    echo "   1. Ouvrez .env dans votre éditeur"
    echo "   2. Remplacez les valeurs par vos clés depuis le dashboard Voora"
    echo "   3. Sauvegardez le fichier"
    echo ""
else
    echo "✅ Fichier .env trouvé"
fi

# Lire les variables depuis .env
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Créer config.local.js avec les vraies valeurs
echo "📝 Création de config.local.js..."

cat > config.local.js << EOF
// Configuration Voora SDK pour développement local
// ⚠️ Ce fichier est ignoré par git (.gitignore)

const VOORA_CONFIG = {
  organizationId: "${VOORA_ORG_ID}",
  apiKey: "${VOORA_API_KEY}",
  apiUrl: "${VOORA_API_URL}"
}

if (typeof window !== 'undefined') {
  window.VOORA_CONFIG = VOORA_CONFIG
}
EOF

echo "✅ config.local.js créé avec vos variables d'environnement"
echo ""
echo "🚀 Configuration terminée !"
echo ""
echo "📝 Prochaines étapes :"
echo "   1. Ouvrez index.html dans votre navigateur"
echo "   2. Vérifiez la console (F12) pour confirmer l'initialisation"
echo "   3. Pour déployer sur GitHub Pages, configurez les secrets dans :"
echo "      Settings > Secrets and variables > Actions"
echo ""
