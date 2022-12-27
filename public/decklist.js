function enableDecklist(response) {
	var existingButton = document.getElementById("deck-button");
	if(existingButton != null) {
		existingButton.remove();
	}

	// Create and place the deck button, it will show as an outline only.
	var deckButton = document.createElement("button");
	deckButton.onclick = showDecklist;
	deckButton.style.position = "absolute";
	deckButton.style.left = (response.deck_button_x * 100 / screenWidth) + "%";
	deckButton.style.top = (100 - (response.deck_button_y + response.deck_button_height) * 100 / screenHeight) + "%";
	deckButton.id = "deck-button";

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
		cardImage.alt = card.name + " " + card.description;

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
