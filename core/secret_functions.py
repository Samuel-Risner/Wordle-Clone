import json

def get_app_secret_key() -> str:
    with open("secrets/secret.json", "r") as d:
        contents: dict = json.load(d)
    
    return contents.get("app_secret_key")