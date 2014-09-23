// Globals
var user = "Anonymous ";
var profile;
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
  var p = profile;
  var msg = "<strong> " + user + "</strong>" + ": " + $("#m").val();
  socket.emit('message', room, msg, p);

  $('#m').val('');
  return false;
});

socket.on('connect', function() {
   socket.emit('room', room);
   $('#messages').append($('<li>').text("You have entered the room, " + room));
});

socket.on('user connected', function(msg) {
   $('#messages').append($('<li>').text(msg));
});

socket.on('message', function(msg, profile){
  var html_url = profile != undefined ? profile.html_url : "#";
  var thumbnail = profile != undefined ? profile.thumbnail : "https://avatars0.githubusercontent.com/u/1746301";

  $("#messages").append($("<li>", {
      html: $("<a>", {
        href: html_url,
        html: $("<img>", {
          src: thumbnail,
          width: 20
        })
      })
    }).append(msg));

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
    profile = p;
    console.log(p);
  });
});

hello.init({
  github : GITHUB_CLIENT_ID
},	{redirect_uri:'../redirect.html', oauth_proxy:OAUTH_PROXY_URL});
