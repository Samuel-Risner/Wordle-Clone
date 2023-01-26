import time

from settings.disapprove import PATH_TO_FILE, PERIOD_IN_S, MAXIMUM_ENTRYS_PER_PERIOD

class Disapprove():
    """Handels disapproving words by users."""

    def __init__(self):
        self.users: dict[int, list[int]] = dict()
        """A Dictionary where the key is the user id and the value a list containing the times the user has added a new word."""
    
    def add_word(self, user_id: int, word: str) -> bool:
        current_time = int(time.time())
        entrys = self.users.get(user_id)

        if entrys is None:
            entrys = list()
            self.users[user_id] = entrys
        else:
            if not self._can_submit(current_time, entrys): return False
        
        entrys.append(current_time)

        with open(PATH_TO_FILE, "a") as d:
            d.write(f"{word}\n")
                
        return True
    
    def _can_submit(self, current_time: int, entrys: list[int]) -> bool:
        to_remove = list()

        for entry in entrys:
            print(current_time - entry)
            if current_time - entry > PERIOD_IN_S: to_remove.append(entry)
            else: break
        
        for entry in to_remove: entrys.remove(entry)

        return len(entrys) < MAXIMUM_ENTRYS_PER_PERIOD
