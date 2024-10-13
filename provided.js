/* 
  This file contains the provided functions and tests for the card game project. The coding environment and further instructions are located in the file script.js.
*/

/* Variables storing audio objects to play different sounds during the game. For example, the 'click' sound is used when a card is clicked. */
let clickAudio = new Audio('audio/click.wav');
let matchAudio = new Audio('audio/match.wav');
let winAudio = new Audio('audio/win.wav');

/* OVERVIEW:
Attaches a mouse click listener to a card, flips the card when clicked, and calls the 'onCardFlipped' function after the flip is complete.

INPUT/OUTPUT:
The 'cardObject' parameter is a custom card object created in the 'createCards' function.
This function makes the card element associated with 'cardObject' clickable and calls onCardFlipped with that cardObject after the flip is complete. */
function flipCardWhenClicked(cardObject) {
  // Adds an "onclick" listener to the element that calls the function below.
  cardObject.element.onclick = function() {
    // CODE THAT RUNS IN RESPONSE TO A CLICK.

    // If the card is already flipped, do nothing.
    if (cardObject.element.classList.contains("flipped")) {
      return;
    }

    // Play the "click" sound when the card is clicked.
    clickAudio.play();

    // Add the 'flipped' class immediately after the card is clicked.
    cardObject.element.classList.add("flipped");

    // Wait for 500 milliseconds for the flip transition to complete, then call onCardFlipped.
    setTimeout(function() {
      // CODE THAT RUNS AFTER A 500MS DELAY.
      onCardFlipped(cardObject);
    }, 500);
  };
}

/* Set up the game. This function calls createCards() and adds onclick listeners to each created card. */
function setUpGame() {
  let cardObjects =
    createCards(document.getElementById("card-container"), shuffleCardImageClasses());

  if (cardObjects != null) {
    for (let i = 0; i < cardObjects.length; i++) {
      flipCardWhenClicked(cardObjects[i]);
    }
  }
}

/* Test to verify that createNewCard creates a new card element properly with required properties and classes. */
function createNewCardTest() {
  const TEST_NAME = "createNewCardTest";

  // Check the initial steps for creating a new card element.
  let variableAndCreateElementPresentSpec =
    functionSpec(createNewCard)
      .contains("let")
      .or("var")
      .or("const")
      .andThen("createElement");
  let passedStep1Heuristics =
    checkFunctionSpec(variableAndCreateElementPresentSpec);
  let step1Hint = constructHintMessage(1, `Get started by calling document.createElement — this will create and return a new DOM element (the card) that you can store in a variable.`, RESOURCES.createElement);

  // Check that classes are added properly to the created card element.
  let classListAddPresentSpec =
    functionSpec(createNewCard)
      .contains("classList.add")
      .andThen("card");
  let classNameEqualsPresentSpec =
    functionSpec(appendNewCard)
      .contains("className")
      .andThen("card");
  let passedStep2Heuristics =
    checkFunctionSpec(classListAddPresentSpec) ||
    checkFunctionSpec(classNameEqualsPresentSpec);
  let step2Hint = constructHintMessage(2, `Remember you can access and manipulate an element's classes using its classList property. Try Googling JavaScript's classList.add method.`, RESOURCES.classListAdd);

  // Check if innerHTML is used to add child div elements to the card.
  let usesInnerHtml =
    functionSpec(createNewCard)
      .contains(".innerHTML");
  let passedStep3Heuristics =
    checkFunctionSpec(usesInnerHtml);
  let step3Hint = constructHintMessage(3, `You can write the HTML for the two child divs directly in script.js as a template string (using backticks). Try updating your card element's innerHTML with that structure.`, RESOURCES.innerHTML);

  // Run the user function to verify the card creation.
  let card;
  let exception = callUserCode(() => {
    card = createNewCard();
  });

  // Check for errors in card creation.
  if (card == undefined) {
    if (!passedStep1Heuristics) {
      console.log(constructLateErrorMessage(TEST_NAME, 4));
      console.log(step1Hint);
    } else if (!passedStep2Heuristics) {
      console.log(constructLateErrorMessage(TEST_NAME, 4));
      console.log(step2Hint);
    } else if (!passedStep3Heuristics) {
      console.log(constructLateErrorMessage(TEST_NAME, 4));
      console.log(step3Hint);
    } else {
      console.log(constructErrorMessage(TEST_NAME, 4, `We don't see a return value. Remember to return cardElement!`));
    }
    return false;
  }

  // Ensure the returned card is a DOM element.
  if (!(card instanceof Element)) {
    console.log(constructErrorMessage(TEST_NAME, 4, `This function should return a DOM element, but that's not what we got.`));
    return false;
  }

  // Verify that the created card is a 'div' element.
  if (card.tagName.toLowerCase() != "div") {
    console.log(constructErrorMessage(TEST_NAME, 1, `The card should be a div element but we got something else. Remember to use a div!`));
    console.log("\nHere's what the HTML looks like:\n" +
      serialize(card) + "\n");
    console.log(step1Hint);
  }

  // Check if the 'card' class is present on the created card element.
  if (!card.classList.contains("card")) {
    console.log(constructErrorMessage(TEST_NAME, 2, `The card div should contain the class 'card'.`));
    console.log("\nHere's what the HTML looks like:\n" +
      serialize(card) + "\n");
    console.log(step2Hint);
  }

  // Ensure the card element has exactly two child div elements.
  if (card.children.length !== 2) {
    console.log(constructErrorMessage(TEST_NAME, 3, `You should be adding exactly 2 children to the innerHTML of your card, but we see ${card.children.length}.`));
    console.log("\nHere's what the HTML looks like:\n" +
      serialize(card) + "\n");
    console.log(step3Hint);
    return false;
  }

  let cardDown = card.children[0];
  let cardUp = card.children[1];

  // Verify the first child div has the 'card-down' class.
  if (!cardDown.classList.contains("card-down")) {
    console.log(constructErrorMessage(TEST_NAME, 3, `The first child of the card should be a div with the class 'card-down'.`));
    console.log("\nHere's what the HTML looks like:\n" +
      serialize(card) + "\n");
    console.log(step3Hint);
    return false;
  }

  // Verify the second child div has the 'card-up' class.
  if (!cardUp.classList.contains("card-up")) {
    console.log(constructErrorMessage(TEST_NAME, 3, `The second child of the card should be a div with the class 'card-up'.`));
    console.log("\nHere's what the HTML looks like:\n" +
      serialize(card) + "\n");
    console.log(step3Hint);
    return false;
  }

  // If all checks pass, output a success message.
  outputPassMessage(TEST_NAME);
  return true;
}

/* Additional tests are provided below to verify that the other game functions, such as appending cards, shuffling cards, creating the game, and matching cards, behave as expected. */

/* The appendNewCardTest verifies the appendNewCard function properly appends a newly created card to the given parent element. */
/* The shuffleCardImageClassesTest checks if shuffleCardImageClasses function returns a shuffled array of image classes, as expected. */
/* The createCardsTest ensures that the createCards function properly creates the required number of cards and appends them to the parent container. */
/* The doCardsMatchTest verifies that the doCardsMatch function correctly identifies whether two cards have the same image class. */
/* The incrementCounterTest ensures the incrementCounter function behaves correctly by properly updating and displaying the counter value. */

/* The runAllTests function runs each of the provided tests and displays whether all tests have passed or if any have failed. */
function runAllTests() {
  let tests = [
    createNewCardTest,
    appendNewCardTest,
    shuffleCardImageClassesTest,
    createCardsTest,
    doCardsMatchTest,
    incrementCounterTest
  ];
  let passed = true;

  tests.forEach((test) => {
    passed &= test();
  });

  if (passed) {
    console.log(`${COLOR_CODE.green}ALL TESTS PASSING!${COLOR_CODE.reset}`);
  } else {
    console.log(`${COLOR_CODE.red}TEST RUN FAILED!${COLOR_CODE.reset}`);
  }
}