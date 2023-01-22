function enableDecisionUi(response) {
	if(!response.hasOwnProperty("decision_prompts")) {
		return;
	}


	$('#decision-buttons').empty();
	for(decision of response.decision_prompts) {
		for(option of decision.options) {
			console.log(option);
			var optionButton = document.createElement("button");

			optionButton.onclick = function() {
				var data = {"option":option.id,"userId":userId}
				$.ajax({
					type: 'PUT',
					url: QUERY_URL + "/player/vote/",
					contentType: "application/json",
					data: JSON.stringify(data),
				});
			}

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
