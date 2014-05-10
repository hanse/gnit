# gnit

A dead simple interface for managing single-user git repos. Useful for stuff like your editor configs, pass stores and other things you don't want to share with others, but nevertheless find useful to store on a server for sharing between multiple workstations.

The interface does *two* things: List all repositories you have created and gives you the ability to create new ones.

## Install
You should create a user specifically for running gnit.
```bash
cd /home/git
git clone git@github.com:Hanse/gnit .gnit
cd .gnit
mv config.example.json config.json
npm install
```

After changing `config.json` to fit your needs, you can run `make start` to launch the web interface at the port set by the environment variable PORT or 8123.
