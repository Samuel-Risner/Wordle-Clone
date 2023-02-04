from dataclasses import dataclass

# from ._word import Word

@dataclass
class User():
    unique_ids: list[str]
    """All the unique ids associated with the user."""
    reported_words: list[int]
    """Times (dates) when the user reported a word."""

    def __init__(self):
        self.unique_ids = list()
        self.reported_words = list()