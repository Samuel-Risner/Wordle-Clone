from core.checks import check_word_characters

word_lists = [
    "words/de/german.dic"
]

for word_list in word_lists:
    with open(word_list, "r") as d:
        contents = d.read()
    
    contents = contents.split("\n")
    out_contents = ""

    for word in contents:
        if check_word_characters(word.upper()):
            out_contents += f"{word}\n"
    
    with open(word_list, "w") as d:
        d.write(out_contents)