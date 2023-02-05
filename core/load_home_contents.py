import json

from settings.words import PATH_TO_HOME_CONTENTS_JSON

def load_home_contents() -> list[tuple[str, int, int]]:
    with open(PATH_TO_HOME_CONTENTS_JSON, "r") as d:
        return json.loads(d.read())