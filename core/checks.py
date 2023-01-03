import settings

def check_game_id(game_id: str) -> bool:
    for character in game_id:
        if character not in settings.words.UNIQUE_ID_CHARS:
            return False

    return True