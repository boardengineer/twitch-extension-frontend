let token = '';
let tuid = '';

const twitch = window.Twitch.ext;

function slayBackendRequest () {
  return {
    type: 'GET',
    url: 'https://boardengineer.net/player/players/1/',
    success: slayResponse,
    error: customError,
  };
}

function setAuth (token) {
  Object.keys(requests).forEach((req) => {
    twitch.rig.log('Setting auth headers');
    requests[req].headers = { 'Authorization': 'Bearer ' + token };
  });
}

twitch.onContext(function (context) {
  twitch.rig.log(context);
});

twitch.onAuthorized(function (auth) {
  // save our credentials
  token = auth.token;
  tuid = auth.userId;

  // enable the button
  $('#cycle').removeAttr('disabled');

  setAuth(token);
  $.ajax(requests.get);
});

function updateBlock (hex) {
  twitch.rig.log('Updating block color');
  $('#color').css('background-color', hex);
} 

function slayResponse (response, status) {
  var username = response.twitch_username;
  var currentHp = response.player_current_hp;
  var maxHp = response.player_max_hp;

  $('#list').empty();

  var screenHeight = response.screen_height;
  var screenWidth = response.screen_width;

  for(relic of response.relics) {
    var relicDiv = document.createElement("div");
    //relicDiv.innerHTML = relic.name;         // Create text with DOM
    relicDiv.style.top = (100 - (relic.y_pos + relic.height) * 100 / screenHeight) + "%";
    relicDiv.style.left = (relic.x_pos * 100 / screenWidth) + "%";
    relicDiv.style.height = relic.height * 100 / screenHeight + "%"; 
    relicDiv.style.width = relic.width * 100 / screenWidth + "%"; 
    relicDiv.style.position = "absolute";
    relicDiv.className = "relic";

    var spanHover = document.createElement("span");
    spanHover.innerHTML = relic.description;
    spanHover.className = "relicToolTip";
 
    relicDiv.appendChild(spanHover);  

    $('#list').append(relicDiv);
  }
 
}

function customError(jqXHR, exception, errorMessage) {
  twitch.rig.log('Custom Error Handling');
  twitch.rig.log(jqXHR.status);
  twitch.rig.log(exception);
  twitch.rig.log(errorMessage);
}

$.ajax(slayBackendRequest());  

setInterval(function() {
  twitch.rig.log('Hello Console World 5');
  console.log('hello world 7');
  $.ajax(slayBackendRequest()); 
}, 5000);
