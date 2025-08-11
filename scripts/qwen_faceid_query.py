import requests
import json

API_URL = "http://127.0.0.1:1234/v1/chat/completions"

headers = {
    "Content-Type": "application/json"
}

data = {
    "model": "qwen/qwen3-14b",
    "messages": [
        {
            "role": "system",
            "content": "Eres un experto en desarrollo de aplicaciones móviles con React Native y Expo, especializado en seguridad biométrica y autenticación. Por favor, proporciona respuestas detalladas y prácticas."
        },
        {
            "role": "user",
            "content": """Necesito implementar Face ID en una aplicación Expo/React Native que usa expo-secure-store. 
            
Contexto actual:
1. Ya agregué 'NSFaceIDUsageDescription' en app.json:
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSFaceIDUsageDescription": "Esta app usa Face ID para proteger tus datos médicos de manera segura"
      }
    }
  }
}

2. Estoy usando expo-secure-store con esta configuración:
const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  requireAuthentication: Platform.OS === 'ios',
  authenticationPrompt: 'Autenticación requerida para acceder a tu cuenta',
  accessibility: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

3. Pero sigo recibiendo el error:
"You must set `NSFaceIDUsageDescription` in your Info.plist"

¿Cuál es la manera correcta de implementar Face ID en esta aplicación? Necesito una solución que:
1. Funcione tanto en desarrollo como en producción
2. Sea compatible con expo-secure-store
3. Maneje correctamente los permisos en iOS
4. Tenga un fallback para cuando Face ID no está disponible

Por favor, proporciona una solución paso a paso."""
        }
    ],
    "temperature": 0.7,
    "max_tokens": 2000
}

try:
    response = requests.post(API_URL, headers=headers, json=data)
    if response.status_code == 200:
        result = response.json()
        print("\n=== Respuesta de Qwen sobre implementación de Face ID ===\n")
        print(result["choices"][0]["message"]["content"])
        print("\n===================================================\n")
    else:
        print(f"Error al consultar Qwen: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Error de conexión: {str(e)}")
