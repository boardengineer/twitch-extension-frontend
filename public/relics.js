function enableRelicBar(response) {
	if(!response.hasOwnProperty("relics")) {
		return;
	}


	$('#relic-bar').empty();
	for(relic of response.relics) {
		$('#relic-bar').append(createRelicDiv(relic));
	}
}


function createRelicDiv(relic) {
	var relicDiv = document.createElement("div");

	relicDiv.style.top = (100 - (relic.y_pos + relic.height) * 100 / screenHeight) + "%";

	var leftPercent = relic.x_pos * 100 / screenWidth; 
	relicDiv.style.left = leftPercent + "%";
	relicDiv.style.height = relic.height * 100 / screenHeight + "%"; 
	relicDiv.style.width = relic.width * 100 / screenWidth + "%"; 
	relicDiv.className = "relic";

	var toolTipContainer = document.createElement("div");
	if(leftPercent <= 60) {
		toolTipContainer.className = "relic-tooltip-right";
	} else {
		toolTipContainer.className = "relic-tooltip-left";
	}

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
