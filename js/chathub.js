/*
 * Globals
 */

var user = "Guest"; // Default username
var profile;
var host = window.location.host;
var room = window.location.pathname.substr(1) || "Lobby";
var GITHUB_CLIENT_ID = host === "chathub.github.io" ? "5272ed33c7189d449ea8" : "45d29134d70365fbe5af";
var SOCKETIO_HOST = host === "chathub.github.io" ? "http://chathub-server.alfg.co" : "http://alf-macbook.local:3000";
var OAUTH_PROXY_URL = SOCKETIO_HOST + "/proxy";


/*
 * jQuery
 */

$(document).ready(function() {
  // Activate bootstrap tooltips
  $("[rel='tooltip']").tooltip({
    "placement": "bottom",
    "trigger": "hover",
    "container": "body"
  });

  // Dynamically set height of messages chatbox
  $("#messages").height($("body").height() - 300);

  // Update formatting of room on breadcrumbs UI
  $("#room").text(room.replace("/", " / "));
  if (room !== "Lobby") { $("#room").attr("href", "https://github.com/" + room); }

  // Initialize Emojify.js
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


/*
 * Socket.IO
 */

var socket = io(SOCKETIO_HOST); // Set socketio host


// Emit message on form submission
$("form").submit(function(){
  var p = profile;
  var m = $("#m").val() || $("#mcode").val(); // Form message or code message?
  var msg = formatMessage(m);

  socket.emit("message", room, msg, p);

  // Reset input values
  $("#m").val("");
  $("#mcode").val("");

  return false;
});


// Listen for socket connections
socket.on("connect", function() {

  // Delay 2 seconds to allow profile to load
  setTimeout(function() {
     socket.emit("room", room, profile);
  }, 2000);

  // Append message
  $("#messages").append($("<li>").text("You have entered the room, " + room));
});


// Listen for user connections
socket.on("user connected", function(msg, users) {
  $("#messages").append($("<li>").text(msg));

  // Rebuild users online list
  buildUsersOnline(users);

});


// Listen for users disconnecting
socket.on("user disconnected", function(msg, users) {
  $("#messages").append($("<li>").text(msg));

  // Rebuild users online list
  buildUsersOnline(users);
});


socket.on("message", function(msg, profile){

  // Set default profile info
  var html_url = "#";
  var thumbnail = "https://avatars0.githubusercontent.com/u/1746301";

  // Update html_url and thumbnail avatar on message if profile is loaded
  if (profile !== null && profile !== undefined) {
    html_url = profile.html_url;
    thumbnail = profile.thumbnail;
  }

  // Append to message list with profile data
  $("#messages").append($("<li>", {
      html: $("<a>", {
        href: html_url,
        html: $("<img>", {
          src: thumbnail,
          width: 20
        })
      })
    }).append(msg));

  // Rerun emojify and prettyprint
  emojify.run();
  window.prettyPrint && prettyPrint();

  // Scroll chatbox to latest message
  $("#messages").scrollTop($("#messages")[0].scrollHeight);
});


/*
 * Hello.js
 */

hello.on("auth.login", function(r){

  // Get Profile
  hello.api(r.network+":/me", function(p){

    // Set profile template html
    var tmpl = "<img src='"+ p.thumbnail + "' width=20/> " +
      "<strong>" + p.name + "</strong>";

    // Update profile link with html
    $("#github").html(tmpl);
    $("#github").attr("data-original-title", "Account");
    // $("#github").attr("href", p.html_url);

    // Global user is now profile name
    user = p.name;
    profile = p;
  });
});

// On logout
hello.on("auth.logout", function(r){
	alert("Signed out");
  var tmpl = "<i class='fa fa-github'></i> Connect";
  $("#github").html(tmpl);
}, function(e){
	alert( "Signed out error:" + e.error.message );
});

// Initialize hello.js
hello.init({
  github : GITHUB_CLIENT_ID
}, {
  redirect_uri:"../redirect.html",
  oauth_proxy:OAUTH_PROXY_URL
});

/*
 * Helper functions
 */

/**
 * Formats message to prettyprint if message is code
 */
function formatMessage(m) {
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
  return msg;
}

/**
 * Rebuilds Users online list
 */
function buildUsersOnline(users) {
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
}

/**
 * Escapes html in string
 */
function escapeHtml(string) {
  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
    "/": "&#x2F;"
  };
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}
