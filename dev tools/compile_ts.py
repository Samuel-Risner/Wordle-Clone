import os

print("Getting files from the directory 'ts'...")
files = os.listdir("ts/")
print(f"Found these files in the directory 'ts': {files}.")

print("Checking for non '.ts' files...")
to_remove = list()
for file in files:
    if not file.endswith(".ts"):
        to_remove.append(file)
        print(f"Found non '.ts' file: {file}")
print("Finished checking for non '.ts' files.")

if len(to_remove) == 0:
    print("Found no non '.ts' files.")
else:
    print(f"Found {len(to_remove)} non '.ts' files: {to_remove}.")
    for file in to_remove:
        files.remove(file)

for i in range(0, len(files), 1):
    files[i] = files[i][:-3]

print("Starting to compile '.ts' files...")
for file in files:
    os.system(f"tsc ts/{file}.ts")
print("Finished compiling '.ts' files.")

print("Moving newly created '.js' files from direcory 'ts' to directory 'static/js'...")
for file in files:
    os.system(f"mv ts/{file}.js static/js/{file}.js")
print("Finished!")