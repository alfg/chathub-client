// Globals
var user = "Guest";
var profile;
var host = window.location.host;
var room = window.location.pathname.substr(1) || "Lobby";
var GITHUB_CLIENT_ID = host === "chathub.github.io" ? "5272ed33c7189d449ea8" : "45d29134d70365fbe5af";
var SOCKETIO_HOST = host === "chathub.github.io" ? "http://chathub-server.alfg.co" : "http://alf-macbook.local:3000";
var OAUTH_PROXY_URL = "https://auth-server.herokuapp.com/proxy";

// jQuery
$(document).ready(function() {
  $("[rel='tooltip']").tooltip({"placement": "bottom", "trigger": "hover", "container": "body"});
  $("#messages").height($("body").height() - 300);

  $("#room").text(room.replace("/", " / "));
  if (room !== "Lobby") { $("#room").attr("href", "https://github.com/" + room); }

  emojify.setConfig({
    emojify_tag_type: "div", // Only run emojify.js on this element
    only_crawl_id: null, // Use to restrict where emojify.js applies
    img_dir: "/images/emoji", // Directory for emoji images
    ignored_tags: { // Ignore the following tags
        "SCRIPT": 1,
        "TEXTAREA": 1,
        "A": 1,
        "PRE": 1,
        "CODE": 1
    }
  });
  emojify.run();
});

// Socket.io
var socket = io(SOCKETIO_HOST);

$("form").submit(function(){
  var p = profile;
  var m = $("#m").val() || $("#mcode").val();
  var msg;

  if (m.substring(0, 6) === "/code ") {
    m = "<pre class='prettyprint'>" + escapeHtml(m.substring(6)) + "</pre>";
    msg = "<strong> " + user + "</strong>" + ": " + m;
  }
  else if ($("#mcode").val() !== "") {
    m = "<pre class='prettyprint'>" + escapeHtml(m) + "</pre>";
    msg = "<strong> " + user + "</strong>" + ": " + m;
  }
  else {
    msg = "<strong> " + user + "</strong>" + ": " + escapeHtml(m);
  }

  socket.emit("message", room, msg, p);

  $("#m").val("");
  $("#mcode").val("");
  return false;
});

socket.on("connect", function() {
   setTimeout(function() {
     socket.emit("room", room, profile);
   }, 2000);
   $("#messages").append($("<li>").text("You have entered the room, " + room));
});

socket.on("user connected", function(msg, users) {
   $("#messages").append($("<li>").text(msg));

   $("#users").empty();
   $.each(users, function(i, v) {
    $("#users").append($("<li>", {
        html: $("<a>", {
          href: v.html_url,
          html: $("<img>", {
            src: v.thumbnail,
            width: 20
          })
        })
      }).append(v.nickname));
     });
});

socket.on("user disconnected", function(msg, users) {
   $("#messages").append($("<li>").text(msg));

   $("#users").empty();
   $.each(users, function(i, v) {
    $("#users").append($("<li>", {
        html: $("<a>", {
          href: v.html_url,
          html: $("<img>", {
            src: v.thumbnail,
            width: 20
          })
        })
      }).append(v.nickname));
     });
});

socket.on("message", function(msg, profile){
  var html_url = profile !== undefined ? profile.html_url : "#";
  var thumbnail = profile !== undefined ? profile.thumbnail : "https://avatars0.githubusercontent.com/u/1746301";

  $("#messages").append($("<li>", {
      html: $("<a>", {
        href: html_url,
        html: $("<img>", {
          src: thumbnail,
          width: 20
        })
      })
    }).append(msg));
  emojify.run();
  window.prettyPrint && prettyPrint();
  $("#messages").scrollTop($("#messages")[0].scrollHeight);
});

// Hello.js
hello.on("auth.login", function(r){
  // Get Profile
  hello.api(r.network+":/me", function(p){
    var tmpl = "<img src='"+ p.thumbnail + "' width=20/> " +
    "<strong>" + p.name + "</strong>";
    $("#github").html(tmpl);
    $("#github").attr("data-original-title", "Account");
    // $("#github").attr("href", p.html_url);
    user = p.name;
    profile = p;
    console.log(p);
  });
});

hello.init({
  github : GITHUB_CLIENT_ID
},	{redirect_uri:"../redirect.html", oauth_proxy:OAUTH_PROXY_URL});

// Helper functions
var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
    "/": "&#x2F;"
  };

function escapeHtml(string) {
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}
