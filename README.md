work in progress 

# Wordle-clone
 A Flask app for your local network to play Wordle.
# Install requirements
 ```sh 
 pip install -r requirements.txt
 ```
# Configuring the server
 ## Port
  You can change the port on which the server is running by changing the variable "PORT" in "changable_settings.py" to another number. The default port is 5000.
 ## Host/ IP
  You can change the IPv4 address on which the server is running to your devices so that the server is available in your local network. Do this by changing the "HOST" variable in "changable_settings.py" to your current IPv4 address or uncommenting the code after "# <<< IPv4 on Windows >>>". The default is "127.0.0.1".

 In either case you want to make sure that your firewall allows hosting on your IPv4 address.
# More setup
 ## Server key
  Create the directory *secrets*. Create the file *secret.json* in the directory.

  Write the following code to the file:
  ```json
  {
      "app_secret_key": "Here goes you recret key!"
  }
  ```

  Replace *Here goes you recret key!* with something more secure.
# TODO
 - [ ] Create a better svg for the delete key
 - [ ] Create a better svg for the enter key
 - [ ] Make the device keyboard usable for desktop
 - [ ] Create a button to show and hide the built in keyboard for desktop
 - [x] Make flashed messages removable
 - [ ] Add css for flashed messages
 - [ ] Combine "settings/game.py" and "settings.words.py"
 - [ ] Add more words
 - [x] Add functionality to show the highscores from finished games (when the user some how managed to evade them)
 - [ ] Add css for the highscores from finished games
 - [ ] Add css to the active games page
 - [ ] Add minimal requirements for special characters etc. for the password
 - [ ] Add a bar to show the password security
 - [ ] Remove the base 64 encoding when submiting username and passowrd
 - [ ] Show valid characters for username and password
 - [ ] Move "changable_settings.py" to a toml file
 - [ ] Add a user wide leaderboard
 - [ ] Save users highscores
 - [ ] Make the word length and the available languages more dependent on the loaded words
