let token = '';
let tuid = '';

const twitch = window.Twitch.ext;
var screenHeight;
var screenWidth;

var previousResponse = "";

//const QUERY_URL = "http://127.0.01:8000";
const QUERY_URL = "https://boardengineer.net";

function slayBackendRequest () {
	return {
		type: 'GET',
		url: QUERY_URL + '/player/605614377/',
		success: slayResponse,
		error: customError,
	};
}

twitch.onAuthorized(function (auth) {
	// save our credentials
	token = auth.token;
	tuid = auth.userId;
});

function slayResponse (response, status) {
	var shouldProcess = false;
	previousResponse = response;


	var username = response.twitch_username;
	var currentHp = response.player_current_hp;
	var maxHp = response.player_max_hp;

	screenHeight = response.screen_height;
	screenWidth = response.screen_width;

	document.getElementById('returnbutton').onclick = off;

	enableDecklist(response);
	enableMap(response);
	enableRelicBar(response);
}

function areEqual(before, after) {
	if(typeof before == "undefined" || typeof after == "undefined") {
		return false;
	}
	if(before.length != after.length) {
		return false;
	}

	for(var index in before) {
		if(!index in before) {
			return false;
		}

		for(key in before[index]) {
			if(!key in after[index]) {
				return false;
			}

			if(before[index][key] != after[index][key]) {
				return false;
			}
		}
	}

	return true;
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
