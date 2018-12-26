const UL = 0;
const UR = 1;
const LR = 2;
const LL = 3;

//  const upperLeft = $("#upper-left");
//  const upperRight = $("#upper-right");

const sections = $(".game-board__section");
let selectedEvent;

let tones = [];
tones[0] = new Audio("Assets/Audio/tone3_Bb.wav");
tones[1] = new Audio("Assets/Audio/tone2_F.wav");
tones[2] = new Audio("Assets/Audio/tone0_Bb.wav");
tones[3] = new Audio("Assets/Audio/tone1_Db.wav");
tones[4] = new Audio("Assets/Audio/tone4_Ab.wav");

let sequence = [];
let addToEnd = true;

let startButton = $("#start-game");
let gameType;
let doubleUp;

startButton.click(() => {
    startButton.attr("disabled", true);
    gameType = $("#game-type").val();
    addToEnd = gameType == 0;
    doubleUp = $("#game-double").prop("checked") ? 2 : 1;
    sections.removeClass("wrong-guess");
    $("#score").text("0");
    nextTurn();
});

function nextTurn() {

    for (var i = 0; i < doubleUp; i++) {
        if (addToEnd) {
            sequence.push(Math.floor(Math.random() * 4));
        }   else    {
            sequence.unshift(Math.floor(Math.random() * 4));
        }
        if (gameType < 0) {
            addToEnd = !addToEnd;
        }
    }

    //  run sequence
    displaySequence();

    //  check player's turn
    if (selectedEvent == undefined) {
        checkScreen();
    }   else    {
        checkPlayer();
    }
}

function displaySequence()  {
    let i = 0;
    let sequenceFinished = setInterval(() => {
        let thisSection = $(sections[sequence[i]]);
        blink(thisSection, true);
        i++;
        if (i == sequence.length) {
            clearInterval(sequenceFinished);
        }
    }, 500);
}

function checkScreen()  {
    sections.on("click touchstart", (e) => {
        sections.off();
        selectedEvent = e.type;
        console.log(selectedEvent);
        checkPlayer();
        $(e.currentTarget).trigger(selectedEvent);
    });
}

function checkPlayer()  {
    let i = 0;
    sections.on(selectedEvent, (e) => {
        let sectionClicked = e.currentTarget;
        if (sectionClicked != sections[sequence[i]]) {
            blink(sectionClicked, false);
            gameOver();
        }   else    {
            blink(sectionClicked, true);
            i++;
            if (i == sequence.length) {
                sections.off(selectedEvent);
                setTimeout(() => {
                    $("#score").text(sequence.length);
                    nextTurn();
                }, 500);
            }
        }
    });
}

function blink(section, showColour)    {
    blinkClass = showColour ? "blink" : "wrong-guess";
    blinkDuration = showColour ? 250 : 1000;
    toneIndex = showColour ? $(section).data("position") : 4;
    $(section).addClass(blinkClass);
    tones[toneIndex].play();
    setTimeout(() => {
        $(section).removeClass(blinkClass);
        tones[toneIndex].pause();
        tones[toneIndex].currentTime = 0;
    }, blinkDuration);
}

function gameOver() {
    sequence = [];
    sections.off(selectedEvent);
    startButton.removeAttr("disabled");
}