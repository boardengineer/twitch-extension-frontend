function enableDecisionUi(response) {
	if(!response.hasOwnProperty("decision_prompts")) {
		return;
	}


	$('#decision-buttons').empty();
	for(decision of response.decision_prompts) {
		var optionIds = {};
		for(var i = 0; i < decision.options.length; i++) {
			var option = decision.options[i]
			console.log("creating button for " + option.id);
			var optionButton = document.createElement("button");
			var optionId = option.id + "";

			optionButton.value = option.id;
			optionButton.onclick = (event) => { sendVote(event.currentTarget.value);};

			optionButton.style.position = "absolute";
			optionButton.style.left = (option.x_pos * 100 / screenWidth) + "%";
			optionButton.style.top = (100 - (option.y_pos + option.height) * 100 / screenHeight) + "%";
			
			optionButton.style.width = option.width * 100 / screenWidth + "%";
			optionButton.style.height = option.height * 100 / screenHeight + "%";

			optionButton.style.background = "none";
			$('#decision-buttons').append(optionButton);
		} 
	}

}

function sendVote(optionId) {
	var data = {"option":optionId,"userId":userId}
	$.ajax({
		type: 'PUT',
		url: QUERY_URL + "/player/vote/",
		contentType: "application/json",
		data: JSON.stringify(data),
	});
}