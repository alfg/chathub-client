# chathub-client [![ChatHub](http://img.shields.io/badge/ChatHub-connect-blue.svg)](http://chathub.github.io)

ChatHub is a simple chatroom application for your Github projects; featuring websockets, Github Login, Emojicons and code syntax highlighting!

**ChatHub Demo**: http://chathub.github.io/

**Room Example**: http://chathub.github.io/alfg/demo

`chathub-client` is the frontend application built to be hosted on any static host, including GitHub Pages!

`chathub-server` is the backend websocket/OAuth server used to connect the sockets from the client application.



## Installation

Setting up your own `chathub-client` is simple, just follow the steps below:

1) Install `chathub-server` using instructions at https://github.com/alfg/chathub-server

2) Clone, install and run grunt to build compiled resources

```bash
$ git clone https://github.com/alfg/chathub-client.git
$ cd chathub-client
$ npm install
$ grunt
```

3) Open `js/chathub.js` and configure

```javascript
var GITHUB_CLIENT_ID = "your github client id";
var SOCKETIO_HOST = host === "http://yoursocketiohost[:port]";
```

4) Host anywhere, including [Github Pages](https://pages.github.com/)!


## License
`chathub-client` is open-source under the [MIT License][1].

## Credits
`chathub-client` uses the following technologies, check them out!
* [Boostrap][2] The CSS Framework to resemble Github!
* [Hello.js][3] Javascript library for connecting OAuth2
* [Emojify.js][4] Gotta have those emoji in chat applications. :)
* [google-code-prettify][5] Code syntax highlighting when pasting code



[1]: http://opensource.org/licenses/MIT
[2]: http://getbootstrap.com/
[3]: https://github.com/MrSwitch/hello.js/
[4]: http://hassankhan.github.io/emojify.js/
[5]: https://code.google.com/p/google-code-prettify/
