import json

def get_app_secret_key() -> str:
    """Returns the secret key for the app, loaded from the json file."""

    with open("secret.json", "r") as d:
        contents: dict = json.load(d)
    
    key = contents.get("app_secret_key")

    if key is None:
        raise
    
    return key