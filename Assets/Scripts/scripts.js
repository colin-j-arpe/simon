const UL = 0;
const UR = 1;
const LR = 2;
const LL = 3;

//  const upperLeft = $("#upper-left");
//  const upperRight = $("#upper-right");

const sections = $(".game-board__section");

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

    // let nextStep = (sequence[sequence.length - 1] + 1) % 4;
    //  nextStep = generate random number 0-3
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
    checkPlayer();
}

function displaySequence()  {
    let i = 0;
    let sequenceFinished = setInterval(() => {
        let thisSection = $(sections[sequence[i]]);
        blink(thisSection, true);
        // thisSection.addClass("blink");
        // setTimeout(() => {
        //     thisSection.removeClass("blink");
        // }, 250);
        i++;
        if (i == sequence.length) {
            clearInterval(sequenceFinished);
        }
    }, 500);
}

function checkPlayer()  {
    let i = 0;
    sections.click((e) => {
        let sectionClicked = e.currentTarget;
        if (sectionClicked != sections[sequence[i]]) {
            blink(sectionClicked, false);
            // $(sectionClicked).addClass("wrong-guess");
            // setTimeout(() => {
            //     $(sectionClicked).removeClass("wrong-guess");
            // }, 1000);
            gameOver();
        }   else    {
            blink(sectionClicked, true);
            i++;
            if (i == sequence.length) {
                sections.off("click");
                setTimeout(() => {
                    $("#score").text(sequence.length);
                    nextTurn();
                }, 500);
            }
        }
    })
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
    sections.off("click");
    startButton.removeAttr("disabled");
}