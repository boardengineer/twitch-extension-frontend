function enableRelicBar(response) {
	$('#relic-bar').empty();
	for(relic of response.relics) {
		$('#relic-bar').append(createRelicDiv(relic));
	}
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
