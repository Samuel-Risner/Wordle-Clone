def _check_word(word: str) -> bool:
    letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

    for character in word:
        if character not in letters:
            return False
    
    return True

word_lists = [
    "words/de/german.dic"
]

for word_list in word_lists:
    with open(word_list, "r") as d:
        contents = d.read()
    
    contents = contents.split("\n")
    out_contents = ""

    for word in contents:
        if _check_word(word.upper()):
            out_contents += f"{word}\n"
        else:
            print(word)
    
    with open(word_list, "w") as d:
        d.write(out_contents)