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

		var toolTipContainer = document.createElement("div");
		toolTipContainer.className = "relicToolTip";

		var toolTipTop = document.createElement("div");
		toolTipTop.className = "relicToolTipTop";

		var toolTipBody = document.createElement("div");
		toolTipBody.className = "relicToolTipBody";

		var toolTipBottom = document.createElement("div");
		toolTipBottom.className = "relicToolTipBottom";

		
		var spanHover = document.createElement("span");
		spanHover.innerHTML += "<p style=\"font-weight:500; color:#efc851ff; padding-left:15px; padding-bottom:10px\"><b>" + relic.name + "</b></p>";
		spanHover.innerHTML += "<p style=\"padding-left:15px; padding-right:15px\">" + relic.description + "</p>";
		//spanHover.className = "relicToolTip";

		toolTipContainer.appendChild(toolTipTop);
		toolTipContainer.appendChild(toolTipBody);
		toolTipContainer.appendChild(toolTipBottom);

		toolTipBody.appendChild(spanHover);
		relicDiv.appendChild(toolTipContainer);  

		$('#list').append(relicDiv);
		//break;
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
  $.ajax(slayBackendRequest()); 
}, 5000);
