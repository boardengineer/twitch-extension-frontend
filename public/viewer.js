let token = '';
let tuid = '';

const twitch = window.Twitch.ext;
var screenHeight;
var screenWidth;

var previousResponse = "";

// Default to Developer's channel ID for testing and development
var channelId = "605614377";
var userId = "605614377";

var timestamp = 0;

//const QUERY_URL = "http://127.0.01:8000";
const QUERY_URL = "https://boardengineer.net";

function slayBackendRequest () {
	return {
		type: 'GET',
		url: QUERY_URL + "/player/" + channelId + "/?timestamp=" + timestamp,
		success: slayResponse,
		error: customError,
	};
}

twitch.onAuthorized(function (auth) {
	// save our credentials
	token = auth.token;
	tuid = auth.userId;
	channelId = auth.channelId;
	userId = auth.userId
});

function slayResponse (response, status) {
	var username = response.twitch_username;
	var currentHp = response.player_current_hp;
	var maxHp = response.player_max_hp;

	screenHeight = response.screen_height;
	screenWidth = response.screen_width;

	timestamp = Math.max(timestamp, response.deck_update_time);
	timestamp = Math.max(timestamp, response.decision_update_time);
	timestamp = Math.max(timestamp, response.relic_update_time);
	timestamp = Math.max(timestamp, response.map_update_time);

	document.getElementById('returnbutton').onclick = off;

	enableDecklist(response);
	enableMap(response);
	enableRelicBar(response);
	enableDecisionUi(response);
}

function showMap() {
	document.getElementById("overlay").style.display = "block";
	document.getElementById("decklist").style.display = "none";
	document.getElementById("map-container").style.display = "flex";
	disableRelicHover();
}

function showDecklist() {
	document.getElementById("overlay").style.display = "table";
	document.getElementById("decklist").style.display = "block";
	document.getElementById("map-container").style.display = "none";
	disableRelicHover()
}

function disableRelicHover() {
	var relics = document.getElementsByClassName("relic");
	while(relics.length > 0) {
		relics.item(0).className = "notrelic";
	}
}

function enableRelicHover() {
	var relics = document.getElementsByClassName("notrelic");
	while(relics.length > 0) {
		relics.item(0).className = "relic";
	}
}

function off() {
	document.getElementById("overlay").style.display = "none";
	document.getElementById("decklist").style.display = "none";
	document.getElementById("map-container").style.display = "none";
	enableRelicHover();
}

function customError(jqXHR, exception, errorMessage) {
	twitch.rig.log('Custom Error Handling');
	twitch.rig.log(jqXHR.status);
	twitch.rig.log(exception);
	twitch.rig.log(errorMessage);
}

$.ajax(slayBackendRequest());  

setInterval(function() {
	$.ajax(slayBackendRequest()); 
}, 5000);
