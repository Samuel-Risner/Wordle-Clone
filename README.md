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

  Open the file *secret.json* in the current directory.

  You should see the following:

  ```json
  {
      "app_secret_key": "Here goes you srecret key!"
  }
  ```

  Replace *Here goes you srecret key!* with something more secure.

# Adding more words and languages

 The instructions and examples for that are in *words.toml*.
