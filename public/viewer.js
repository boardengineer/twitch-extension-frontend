let token = '';
let tuid = '';

const twitch = window.Twitch.ext;
var screenHeight;
var screenWidth;

//const QUERY_URL = "http://127.0.01:8000";
const QUERY_URL = "https://boardengineer.net";

function slayBackendRequest () {
	return {
		type: 'GET',
		url: QUERY_URL + '/player/players/1/',
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
	//$.ajax(requests.get);
});

function updateBlock (hex) {
	twitch.rig.log('Updating block color');
	$('#color').css('background-color', hex);
} 

function createRelicDiv(relic) {
	var relicDiv = document.createElement("div");

	relicDiv.style.top = (100 - (relic.y_pos + relic.height) * 100 / screenHeight) + "%";
	relicDiv.style.left = (relic.x_pos * 100 / screenWidth) + "%";
	relicDiv.style.height = relic.height * 100 / screenHeight + "%"; 
	relicDiv.style.width = relic.width * 100 / screenWidth + "%"; 
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
	spanHover.innerHTML += "<p class=\"tooltipHeading\"><b>" + relic.name + "</b></p>";
	spanHover.innerHTML += "<p class=\"tooltiptext\">" + relic.description + "</p>";

	toolTipContainer.appendChild(toolTipTop);
	toolTipContainer.appendChild(toolTipBody);
	toolTipContainer.appendChild(toolTipBottom);

	toolTipBody.appendChild(spanHover);
	relicDiv.appendChild(toolTipContainer);
	return relicDiv;
}

function createBlackIconForImage(image) {
	var canvas = document.createElement("canvas");
	canvas.width = 128;
	canvas.height = 128;

	var ctx = canvas.getContext("2d");
	ctx.drawImage(image, 0,0);
	ctx.globalCompositeOperation = "source-in";
	ctx.fillStyle = "#000";
	ctx.fillRect(0,0,128,128);

	return canvas;
}

function enableMap(response) {
	var mapButton = document.createElement("button");
	mapButton.onclick = showMap;

	mapButton.style.position = "absolute";
	mapButton.style.left = (response.map_button_x * 100 / screenWidth) + "%";
	mapButton.style.top = (100 - (response.map_button_y + response.map_button_height) * 100 / screenHeight) + "%";

	mapButton.style.height = response.map_button_height * 100 / screenHeight + "%";
	mapButton.style.width = response.deck_button_width * 100 / screenWidth + "%";

	mapButton.style.background = "none";
	$('body').append(mapButton);

	var canvas = document.getElementById("map-canvas");
	var ctx = canvas.getContext("2d");

	var scalingFactor = .7;

	canvas.width = 1400 * scalingFactor;
	canvas.height = 3150 * scalingFactor;

	ctx.clearRect(0,0, canvas.width, canvas.height);

	var mapImg = document.getElementById("map-image");
	ctx.scale(scalingFactor, scalingFactor);

	ctx.drawImage(mapImg,10,10);

	icons = {
		"M": createBlackIconForImage(document.getElementById("monster-icon")),
		"R": createBlackIconForImage(document.getElementById("rest-icon")),
		"E": createBlackIconForImage(document.getElementById("elite-icon")),
		"?": createBlackIconForImage(document.getElementById("event-icon")),
		"$": createBlackIconForImage(document.getElementById("monster-icon")),
		"T": createBlackIconForImage(document.getElementById("chest-icon")),
	}


	var xSpacing = (1366 / 7) * .7;
	var ySpacing = (3093 / 16) * .8;

	var xAdjust = 300;

	var nodes = [];

	//ctx.fillStyle = "#09f";
	//ctx.fillRect(0,0, canvas.width, canvas.height);
	
	//ctx.globalCompositeOperation = "multiply";


	for(mapNode of response.map_nodes) {
		var totalXSpacing = xSpacing * mapNode.x;
		var totalYSpacing = ySpacing * mapNode.y;

		var xPos = totalXSpacing + mapNode.offset_x * .7 + xAdjust;
		var yPos = 2750 - (totalYSpacing + mapNode.offset_y * .8);

		ctx.drawImage(icons[mapNode.symbol], xPos, yPos);

		var savedNode = new Point(xPos + 64, yPos + 64);
		var index = mapNode.y * 7 + mapNode.x;

		nodes[index] = savedNode;
	}

	for(mapEdge of response.map_edges) {
		if(mapEdge.destination <= 7 * 16) {
			ctx.beginPath();
			ctx.setLineDash([5,15]);

			var sourceNode = nodes[mapEdge.source];
			var destinationNode = nodes[mapEdge.destination];

			if (typeof destinationNode === "undefined") {
				continue;
			}

			ctx.moveTo(sourceNode.xPos, sourceNode.yPos);
			ctx.lineTo(destinationNode.xPos, destinationNode.yPos);

			ctx.stroke();
		}
	}

	// after we draw everything resize it to the right width
	var container = document.getElementById("map-container");
	
	var aspect = canvas.height / canvas.width;
	var adjustedWidth = 500;

	ctx.setTransform(1, 0, 0, 1, 0, 0);


	//canvas.width = adjustedWidth;
}

function resizeMapCanvas() {
	// after we draw everything resize it to the right width
	var container = document.getElementById("map-container");
	var canvas = document.getElementById("map-canvas");
	
	var aspect = canvas.height / canvas.width;
	var adjustedWidth = 400;


	canvas.getContext("2d").scale(adjustedWidth, Math.round(adjustedWidth * aspect));
}

function Point(xPos, yPos) {
	this.xPos = xPos;
	this.yPos = yPos;
}

function enableDecklist(response) {
	// Create and place the deck button, it will show as an outline only.
	var deckButton = document.createElement("button");
	deckButton.onclick = showDecklist;
	deckButton.style.position = "absolute";
	deckButton.style.left = (response.deck_button_x * 100 / screenWidth) + "%";
	deckButton.style.top = (100 - (response.deck_button_y + response.deck_button_height) * 100 / screenHeight) + "%";

	deckButton.style.height = response.deck_button_height * 100 / screenHeight + "%";
	deckButton.style.width = response.deck_button_width * 100 / screenWidth + "%";

	deckButton.style.background = "none";
	$('body').append(deckButton);

	// regenerate the deck list from scratch
	$('#decklist').empty();

	var cardRow = document.createElement("div");
	cardRow.className = "cardrow";
	var numCardsInRow = 0;

	for(card of response.deck) {
		var cardImage = document.createElement("img");

		var cardDiv = document.createElement("div");
		var name = card.name;
		name = name.replaceAll(" ", "");
		name = name.replaceAll("+", "Plus");
		name = QUERY_URL + "/static/cards/" + name + ".png"
		cardImage.src = name; 

		cardDiv.append(cardImage);
		cardDiv.className = "cardcell";
		cardRow.append(cardDiv);

		if(++numCardsInRow >= 5) {
			numCardsInRow = 0;
			$('#decklist').append(cardRow);
			cardRow = document.createElement("div");
			cardRow.className = "cardrow";
		}
	}
	if(numCardsInRow > 0) {
		for(;numCardsInRow < 5; numCardsInRow++) {
			var cardDiv = document.createElement("div");
			cardDiv.className = "cardcell";
			cardRow.append(cardDiv);
		}

		$('#decklist').append(cardRow);
	}
}

function slayResponse (response, status) {
	var username = response.twitch_username;
	var currentHp = response.player_current_hp;
	var maxHp = response.player_max_hp;

	$('#relic-bar').empty();

	screenHeight = response.screen_height;
	screenWidth = response.screen_width;

	for(relic of response.relics) {
		$('#relic-bar').append(createRelicDiv(relic));
	}

	document.getElementById('returnbutton').onclick = off;

	enableDecklist(response);
	enableMap(response);
}

function showMap() {
	document.getElementById("overlay").style.display = "block";
	document.getElementById("map-display").style.display = "flex";
	disableRelicHover();
}

function showDecklist() {
	document.getElementById("overlay").style.display = "table";
	document.getElementById("decklist-container").style.display = "block";
	document.getElementById("map-display").style.display = "none";
	disableRelicHover()
}

function disableRelicHover() {
	var relics = document.getElementsByClassName("relic");
	console.log(relics.length);
	while(relics.length > 0) {
		relics.item(0).className = "notrelic";
	}
}

function enableRelicHover() {
	var relics = document.getElementsByClassName("notrelic");
	console.log(relics.length);
	while(relics.length > 0) {
		relics.item(0).className = "relic";
	}
}

function off() {
	document.getElementById("overlay").style.display = "none";
	document.getElementById("decklist-container").style.display = "none";
	document.getElementById("map-display").style.display = "none";
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
