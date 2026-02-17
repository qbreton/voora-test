// Configuration Voora SDK
// Ce fichier est utilisé uniquement pour le développement local
// En production (GitHub Pages), les valeurs sont injectées via GitHub Actions

// ⚠️ NE COMMITEZ JAMAIS CE FICHIER AVEC VOS VRAIES CLÉS API
// Ajoutez config.js dans .gitignore

const VOORA_CONFIG = {
  organizationId: "VOORA_ORG_ID_PLACEHOLDER",
  apiKey: "VOORA_API_KEY_PLACEHOLDER",
  apiUrl: "https://voora.vercel.app"
}

// Export pour utilisation dans index.html
if (typeof window !== 'undefined') {
  window.VOORA_CONFIG = VOORA_CONFIG
}
