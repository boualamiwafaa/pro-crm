    import google.generativeai as genai

# Remplace par ta clé
genai.configure(api_key="AIzaSyDokUjvmCSwCNxEm2zHewJAzuoHlqOUq20")

print("--- Liste des modèles accessibles ---")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"Modèle dispo : {m.name}")
    
    # Test de génération
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Dis bonjour !")
    print(f"\nTest Réussi : {response.text}")

except Exception as e:
    print(f"\nErreur détectée : {e}")