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
			optionButton.onclick = (event) => {
				sendVote(event.currentTarget);
			};

			optionButton.style.position = "absolute";
			optionButton.style.left = (option.x_pos * 100 / screenWidth) + "%";
			optionButton.style.top = (100 - (option.y_pos + option.height) * 100 / screenHeight) + "%";
			
			optionButton.style.width = option.width * 100 / screenWidth + "%";
			optionButton.style.height = option.height * 100 / screenHeight + "%";

			optionButton.style.background = "none";
			optionButton.className = "vote-button";
			$('#decision-buttons').append(optionButton);
		} 
	}

}


function resetButtonBorders() {
	for(button of document.getElementById('decision-buttons').children) {
		button.className = "vote-button";
	}
}

function sendVote(button) {
	var data = {"option":button.value,"userId":userId}
	event.currentTarget.className = "vote-button-pending";
	$.ajax({
		type: 'PUT',
		url: QUERY_URL + "/player/vote/",
		contentType: "application/json",
		data: JSON.stringify(data),
		button: button,
		success: function(data) {
			resetButtonBorders();
			this.button.className = "vote-button-selected";
		},
		error: function(data) {
		},
	});
}
