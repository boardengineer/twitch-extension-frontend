function enableMap(response) {
	var oldButton = document.getElementById("map-button");
	if(oldButton != null) {
		oldButton.remove();
	}

	var mapButton = document.createElement("button");
	mapButton.id = "map-button";
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
		"$": createBlackIconForImage(document.getElementById("shop-icon")),
		"T": createBlackIconForImage(document.getElementById("chest-icon")),
	}

	bossIcons = {
		"The Guardian": createBlackIconForBossImage(document.getElementById("guardian-icon")),
		"Hexaghost": createBlackIconForBossImage(document.getElementById("hexaghost-icon")),
		"Slime Boss": createBlackIconForBossImage(document.getElementById("slime-icon")),
		"Collector": createBlackIconForBossImage(document.getElementById("collector-icon")),
		"Automaton": createBlackIconForBossImage(document.getElementById("automaton-icon")),
		"Champ": createBlackIconForBossImage(document.getElementById("champ-icon")),
		"Awakened One": createBlackIconForBossImage(document.getElementById("awakened-icon")),
		"Time Eater": createBlackIconForBossImage(document.getElementById("time-eater-icon")),
		"Donu and Deca": createBlackIconForBossImage(document.getElementById("donu-icon")),
		"The Heart": createBlackIconForBossImage(document.getElementById("heart-icon")),
	}


	var xSpacing = (1366 / 7) * .7;
	var ySpacing = (3093 / 16) * .8;

	var xAdjust = 300;

	// Store node locations to draw edges to them later.
	var nodes = [];

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

	// Add a boss node
	nodes[115] = new Point(xSpacing * 3 + xAdjust, 2750 - (ySpacing * 16));

	ctx.drawImage(bossIcons[response.boss_name], nodes[115].xPos - 256, nodes[115].yPos - 256);

	for(mapEdge of response.map_edges) {
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.setLineDash([15,15]);

		var sourceNode = nodes[mapEdge.source];
		var destinationNode = nodes[mapEdge.destination];

		if (typeof destinationNode === "undefined") {
			console.log("missing destination node " + mapEdge.destination);
			continue;
		}

		ctx.moveTo(sourceNode.xPos, sourceNode.yPos);
		ctx.lineTo(destinationNode.xPos, destinationNode.yPos);

		ctx.stroke();
	}

	// after we draw everything resize it to the right width
	var container = document.getElementById("map-container");

	var aspect = canvas.height / canvas.width;
	var adjustedWidth = 500;

	ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function createBlackIconForBossImage(image) {
	var canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 512;

	var ctx = canvas.getContext("2d");
	ctx.drawImage(image, 0,0);
	ctx.globalCompositeOperation = "source-in";
	ctx.fillStyle = "#000";
	ctx.fillRect(0,0,512,512);

	return canvas;
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
