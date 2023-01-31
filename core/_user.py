from dataclasses import dataclass

# from ._word import Word

@dataclass
class User():
    unique_ids: list[str] = list()
    """All the unique ids associated with the user."""
    reported_words: list[int] = list()
    """Times (dates) when the user reported a word."""