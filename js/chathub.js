// Globals
var user;
var host = window.location.host;
var room = window.location.pathname.substr(1) || "Lobby";
var GITHUB_CLIENT_ID = host == "chathub.github.io" ? "5272ed33c7189d449ea8" : "45d29134d70365fbe5af";
var SOCKETIO_HOST = host == "chathub.github.io" ? "http://chathub-server.alfg.co" : "http://alf-macbook.local:3000";
var OAUTH_PROXY_URL = 'https://auth-server.herokuapp.com/proxy';

// jQuery
$(document).ready(function() {
  $("[rel='tooltip']").tooltip({"placement": "bottom", "trigger": "hover", "container": "body"});
  $("#room").text(room.replace("/", " / "));

});

// Socket.io
var socket = io(SOCKETIO_HOST);
$('form').submit(function(){
  socket.emit('message', room, user + ": " + $('#m').val());

  $('#m').val('');
  return false;
});

socket.on('connect', function() {
   socket.emit('room', room);
});

socket.on('message', function(msg){
  $('#messages').append($('<li>').text(msg));
   console.log('Incoming message:', msg);
});

// Hello.js
hello.on('auth.login', function(r){
  // Get Profile
  console.log("auth.login");
  hello.api(r.network+':/me', function(p){
    var tmpl = "<img src='"+ p.thumbnail + "' width=20/> " +
    "<strong>" + p.name + "</strong>";
    $("#github").html(tmpl);
    $("#github").attr("data-original-title", "Account")
    // $("#github").attr("href", p.html_url);
    user = p.name;
    console.log(p);
  });
});

hello.init({
  github : GITHUB_CLIENT_ID
},	{redirect_uri:'../redirect.html', oauth_proxy:OAUTH_PROXY_URL});
