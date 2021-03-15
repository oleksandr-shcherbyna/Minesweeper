// Info bocks
const infoBtns = document.querySelectorAll(".info-btns");
infoBtns.forEach(elem => {
    elem.addEventListener("click", ()=> {
        const infoBlock = document.querySelector(`#${elem.value}`);
        infoBlock.style.transform = "translateX(0%)";
    })
})
const closeBtns = document.querySelectorAll(".closing-btns");
closeBtns.forEach(elem => {
    elem.addEventListener("click", ()=> {
        const infoBlock = document.querySelector(`#${elem.value}`);
        infoBlock.dataset.id == "rules" ? infoBlock.style.transform = "translateX(100%)" : 
        infoBlock.style.transform = "translateX(-100%)";
    })
})
// Styling bar 
const stylingBtns = document.querySelectorAll(".btn-style");
let gameMineColor = "modern";
stylingBtns.forEach(elem => {
    elem.addEventListener("click", ()=> {
        const openedElements = document.querySelectorAll(`.no-resize-${gameMineColor}`);
        const correctFlagsWin = document.querySelectorAll(`.win-${gameMineColor}`);
        const correctFlagsLose = document.querySelectorAll(`.lose-correct-${gameMineColor}`);
        const incorrectFlagsLose = document.querySelectorAll(`.lose-incorrect-${gameMineColor}`);
        // Changing active button
        stylingBtns.forEach(btn => {
            btn.classList.remove("active-style");
        })
        elem.classList.add("active-style");
        // Changing game field style
        const gameField = document.querySelector(".main-container");
        gameField.className = "main-container";
        gameField.classList.add(`${elem.dataset.id}-style`);
        // Changing body background
        const backgroundColors = {
            modern: "#C2C2D6",
            renesans: "#C2C38D",
            gothic: "rgb(40, 139, 129)"
        };
        const bodyBackground = document.querySelector("#body");
        for (let prop in backgroundColors) {
            if (prop == elem.dataset.id) {
                bodyBackground.style.background = backgroundColors[prop];
            }
        }
        // Changing photos (top panel) color (their src)
        const icons = document.querySelectorAll(".img-icon");
        icons.forEach(img => {
            img.src = `img/${elem.dataset.id}-${img.dataset.id}-icon.png`;
        })
        // Changing mines color in field
        gameMineColor = elem.dataset.id;
        const iconsField = document.querySelectorAll(".mines-field");
        minesAndFlagsColor(iconsField, "mine");
        // Changing flags color
        const flagsStyle = document.querySelectorAll(".flag");
        minesAndFlagsColor(flagsStyle, "flag");
        // Changing empty cells color
        const emptyCells = document.querySelectorAll(".empty-cells");
        emptyCells.forEach(emptyCell => {
            emptyCell.className = `${elem.dataset.id}-empty-cell empty-cells`;
        })
        // Changing hover effects for opened elements
        stylesAddition(openedElements, "no-resize");
        // Changing background for flags at the end of the game
        stylesAddition(correctFlagsLose, "lose-correct");
        stylesAddition(incorrectFlagsLose, "lose-incorrect");
        stylesAddition(correctFlagsWin, "win");
    })
})
function stylesAddition(elements, classTitle) {
    elements.forEach(element => {
        element.className = `${classTitle}-${gameMineColor}`;
    })
}
function minesAndFlagsColor(elements, item) {
    elements.forEach(element => {
        if (gameMineColor == "gothic") {
            element.src = `img/renesans-${item}-icon.png`;
        }
        else {
            element.src = `img/${gameMineColor}-${item}-icon.png`;
        }
    })
}
// Game difficulty bar
const difficultyBtns = document.querySelectorAll(".btn-level");
let gameDifficulty;
difficultyBtns.forEach(elem => {
    elem.addEventListener("click", ()=> {
        difficultyBtns.forEach(btn => {
            btn.classList.remove("active-level");
        })
        elem.classList.add("active-level");
        reset();
        const cellsContainer = document.querySelector(".cells");
        cellsContainer.innerHTML = "";
        if (elem.dataset.id == "easy") {
            mainCellsFunction(8, 9, 9, 9, 10, "170px", "600px", "510px");
            minesAmount = 10;
            gameDifficulty = "easy";
        }
        else if (elem.dataset.id == "medium") {
            mainCellsFunction(15, 16, 16, 16, 40, "210px", "730px", "630px");
            minesAmount = 40;
            gameDifficulty = "medium";
        }
        else if (elem.dataset.id == "hard") {
            mainCellsFunction(15, 30, 16, 30, 99, "366px", "730px", "1100px");
            minesAmount = 99;
            gameDifficulty = "hard";
        }
        game(elem.dataset.id);
    })
})
window.onload = function() {
    const cellsContainer = document.querySelector(".cells");
    const tdNumber = addTd(9);
    let dataForTable = 0;
    for (let i = 0; i <= 8; i++) {
        cellsContainer.innerHTML += `<table data-id="${dataForTable}"><tbody><tr>${tdNumber}</tr></tbody></table>`
        dataForTable++;
    }
    gameDifficulty = "easy";
    game("easy");
}
function mainCellsFunction(tables, tdNumber, rowFractionsNumber, columnFractionsNumber, minesNumber, 
                            btnsWidth, gameContainerHeight, gameContainerWidth) {
    const allBtns = document.querySelectorAll(".resize");
    allBtns.forEach(btn => {
        btn.style.width = btnsWidth;
    })
    const gameContainer = document.querySelector(".main-container");
    gameContainer.style.height = gameContainerHeight;
    gameContainer.style.width = gameContainerWidth;
    const cellsContainer = document.querySelector(".cells");
    let dataForTable = 0;
    for (let i = 0; i <= tables; i++) {
        cellsContainer.innerHTML += `<table data-id="${dataForTable}"><tbody><tr>${addTd(tdNumber)}</tr></tbody></table>`
        dataForTable++;
    }
    cellsContainer.style.gridTemplateRows = `${fractions(rowFractionsNumber)}`;
    const tr = document.querySelectorAll("tr");
    tr.forEach(singleItem => {
        singleItem.style.gridTemplateColumns = `${fractions(columnFractionsNumber)}`;
    })
    document.querySelector("#current-number").innerHTML = minesNumber;
}
function addTd(numberOfTd) {
    let tdToAdd = "";
    for (let i = 0; i < numberOfTd; i++) {
        tdToAdd += "<td></td>";
    }
    return tdToAdd;
}
function fractions(numberOfFractions) {
    let fractions = "";
    for (let i = 0; i < numberOfFractions; i++) {
        fractions += "1fr ";
    }
    return fractions;
}
// Game 
let minesAmount = 10;
let firstMoveFlag = true;
let gameLost = false;
const minesCounterTopPanel = document.querySelector("#current-number");
function game(gameDifficulty) {
    const allCells = document.querySelectorAll("td");
    allCells.forEach((singleCell, index) => {
        singleCell.addEventListener("click", (event)=> {
            if (singleCell.children[0] != undefined && singleCell.children[0].classList[0] == "flag" || singleCell.children[0] != undefined && singleCell.children[0].style.opacity == "1" || gameLost == true) { // Prevent click on cell with flag icon
                event.preventDefault();
                return;
            }
            stopwatch();
            elementsGeneration(gameDifficulty, firstMoveFlag, index);
            const singleCellChild = singleCell.children[0];
            if (cellsWithMines.includes(index) == true) { // Mine
                singleCell.innerHTML += "<div class='mine-clicked'></div>";
                for (let i = 0; i < cellsWithMines.length; i++) {
                    allCells[cellsWithMines[i]].children[0].style.opacity = "1";
                }
                restartBtn.innerHTML = "<i class='fas fa-redo'></i>";
                allCells.forEach(td => {
                    td.style.pointerEvents = "none";
                })
                gameLost = true;
                clearInterval(time);
                const flags = document.querySelectorAll(".flag");
                flags.forEach(flag => {
                    if (flag.dataset.id != "mine") {
                        flag.parentElement.className = `lose-incorrect-${gameMineColor}`;
                    }
                    else {
                        flag.parentElement.className = `lose-correct-${gameMineColor}`;
                    }
                })
                gameEnd = true;
            }
            else if (singleCellChild != undefined && String(singleCellChild.classList[1]) == "empty-cells") { // Empty cells
                let emptyToOpen = [];
                emptyToOpen.push(index);
                if (gameDifficulty == "easy") {
                    openGroupOfEmptyCells(emptyToOpen, 9, 1, 10, 8);
                }
                else if (gameDifficulty == "medium") {
                    openGroupOfEmptyCells(emptyToOpen, 16, 1, 17, 15);
                }
                else if (gameDifficulty == "hard") {
                    openGroupOfEmptyCells(emptyToOpen, 30, 1, 31, 29);
                }
                if (minesCounterTopPanel.innerHTML == "0") {
                    checkForWin();
                }
            }
            else if (singleCellChild.innerHTML.length == 1) { // Single number
                singleCellChild.style.opacity = "1";
                singleCell.classList.add(`no-resize-${gameMineColor}`);
                if (minesCounterTopPanel.innerHTML == "0") {
                    checkForWin();
                }
            }
        })
    })
    allCells.forEach(item => {
        item.addEventListener("contextmenu", (event)=> {
            if (item.children[0] == undefined || item.children[0].style.opacity == "1" || gameLost == true) {
                event.preventDefault();
                return;
            }
            event.preventDefault();
            const currCell = event.currentTarget;
            const cellChild = event.currentTarget.children[0];
            if (cellChild != undefined && cellChild.classList[1] == "empty-cells") {
                currCell.innerHTML = `<img src='img/${gameMineColor}-flag-icon.png' data-id="empty" class="flag">`;
                minesCounter(minesCounterTopPanel);
            }
            else if (cellChild != undefined && cellChild.classList[0] == "number") {
                currCell.innerHTML = `<img src='img/${gameMineColor}-flag-icon.png' data-id="number" data-index-number="${cellChild.innerHTML}" class="flag">`;
                minesCounter(minesCounterTopPanel);
            }
            else if (cellChild != undefined && cellChild.classList[0] == "mines-field") {
                currCell.innerHTML = `<img src='img/${gameMineColor}-flag-icon.png' data-id="mine" class="flag">`;
                minesCounter(minesCounterTopPanel);
            }
            else if (cellChild != undefined && cellChild.classList[0] == "flag") {
                if (cellChild.dataset.id == "empty") {
                    const styleForEmptyCells = document.querySelector(".active-style").dataset.id;
                    currCell.innerHTML = `<div class='${styleForEmptyCells}-empty-cell empty-cells'></div>`;
                }
                else if (cellChild.dataset.id == "number") {
                    currCell.innerHTML = `<p class="number">${cellChild.dataset.indexNumber}</p>`;
                }
                else if (cellChild.dataset.id == "mine") {
                    if (gameMineColor == "gothic") {
                        currCell.innerHTML = `<img src="img/renesans-mine-icon.png" alt="mine-icon" class="mines-field">`;
                    }
                    else {
                        currCell.innerHTML = `<img src="img/${gameMineColor}-mine-icon.png" alt="mine-icon" class="mines-field">`;
                    }
                }
                minesCounter(minesCounterTopPanel, "plus");
            }
            if (minesCounterTopPanel.innerHTML == "0") {
                checkForWin();
            }
        })
    })
}
// Function for current mines number in the top game panel
function minesCounter(domElement, operand) {
    if (operand == "plus") {
        minesAmount++;
        domElement.innerHTML = `${minesAmount}`;
    }
    else {
        minesAmount--;
        domElement.innerHTML = `${minesAmount}`; 
    }  
}
// Function that checks if player won
function checkForWin() {
    const allCells = document.querySelectorAll("td");
    const flags = document.querySelectorAll(".flag");
    const nums = document.querySelectorAll(".number");
    const empty = document.querySelectorAll(".empty-cells");
    checkIfOpen(flags, "mine", true);
    checkIfOpen(nums, "number", true);
    checkIfOpen(empty, "emptyCells", true); 
    if (checkIfOpen(flags, "mine", true) && checkIfOpen(nums, "number", true) && checkIfOpen(empty, "emptyCells", true)) {
        clearInterval(time);
        restartBtn.innerHTML = "<i class='fas fa-thumbs-up'></i>";
        allCells.forEach(td => {
            td.style.pointerEvents = "none";
        })
        gameEnd = true;
        flags.forEach(flag => {
            flag.parentElement.className = `win-${gameMineColor}`;
        })
    }
}
function checkIfOpen(cellsType, checkType, checkFlag) {
    if (checkType == "mine") {
        cellsType.forEach(item => {
            if (item.dataset.id != "mine") {
                checkFlag = false;
            }
        })
        return checkFlag;
    }
    else {
        cellsType.forEach(item => {
            if (item.style.opacity != "1") {
                checkFlag = false;
            }
        })
        return checkFlag;
    }
}
// Function that opens clicked group of empty cells and shows numbers near these cells
let emptyGroup = 1;
function openGroupOfEmptyCells(cellsToOpen, a, b, c, d) {
    let arrLength = cellsToOpen.length;
    let toSlice = 0;
    let duplicate;
    const allCells = document.querySelectorAll("td");
    const styleForEmptyCells = document.querySelector(".active-style").dataset.id;
    for (let i = 0; i < arrLength; i++) {
        if (allCells[cellsToOpen[i]].children[0].classList[0] == "flag") {
            minesAmount++;
        }
        allCells[cellsToOpen[i]].innerHTML = `<div class='${styleForEmptyCells}-empty-cell empty-cells'></div>`;
        allCells[cellsToOpen[i]].children[0].style.opacity = "1";
        allCells[cellsToOpen[i]].children[0].classList.add(`gr-${emptyGroup}`);
        allCells[cellsToOpen[i]].classList.add(`no-resize-${gameMineColor}`);
        const tableNumber = allCells[cellsToOpen[i]].parentElement.parentElement.parentElement.dataset.id;
        if (allCells[cellsToOpen[i]+a] != undefined) {
            indexToOpen(allCells, allCells[cellsToOpen[i]+a], allCells[cellsToOpen[i]+a].children[0], cellsToOpen), duplicate;
        }
        if (allCells[cellsToOpen[i]-a] != undefined) {
            indexToOpen(allCells, allCells[cellsToOpen[i]-a], allCells[cellsToOpen[i]-a].children[0], cellsToOpen, duplicate);
        }
        if (allCells[cellsToOpen[i]+b] != undefined && tableNumber == allCells[cellsToOpen[i]+b].parentElement.parentElement.parentElement.dataset.id) {
            indexToOpen(allCells, allCells[cellsToOpen[i]+b], allCells[cellsToOpen[i]+b].children[0], cellsToOpen, duplicate);
        }
        if (allCells[cellsToOpen[i]-b] != undefined && tableNumber == allCells[cellsToOpen[i]-b].parentElement.parentElement.parentElement.dataset.id) {
            indexToOpen(allCells, allCells[cellsToOpen[i]-b], allCells[cellsToOpen[i]-b].children[0], cellsToOpen, duplicate);
        }
        if (allCells[cellsToOpen[i]-c] != undefined && Number(tableNumber) == Number(allCells[cellsToOpen[i]-c].parentElement.parentElement.parentElement.dataset.id) + 1) {
            indexToOpen(allCells, allCells[cellsToOpen[i]-c], allCells[cellsToOpen[i]-c].children[0], cellsToOpen, duplicate);
        }
        if (allCells[cellsToOpen[i]-d] != undefined && tableNumber !== allCells[cellsToOpen[i]-d].parentElement.parentElement.parentElement.dataset.id) {
            indexToOpen(allCells, allCells[cellsToOpen[i]-d], allCells[cellsToOpen[i]-d].children[0], cellsToOpen, duplicate);
        }
        if (allCells[cellsToOpen[i]+c] != undefined && Number(tableNumber) == Number(allCells[cellsToOpen[i]+c].parentElement.parentElement.parentElement.dataset.id) - 1) {
            indexToOpen(allCells, allCells[cellsToOpen[i]+c], allCells[cellsToOpen[i]+c].children[0], cellsToOpen, duplicate);
        }
        if (allCells[cellsToOpen[i]+d] != undefined && tableNumber !== allCells[cellsToOpen[i]+d].parentElement.parentElement.parentElement.dataset.id) {
            indexToOpen(allCells, allCells[cellsToOpen[i]+d], allCells[cellsToOpen[i]+d].children[0], cellsToOpen, duplicate);
        }
        toSlice++;
        minesCounterTopPanel.innerHTML = `${minesAmount}`;
    }
    let newArr;
    newArr = cellsToOpen.slice(toSlice);
    if (cellsToOpen.length > 0) {
        openGroupOfEmptyCells(newArr, a, b, c, d);
    }
    else {
        const emptyDivs = document.querySelectorAll(`.gr-${emptyGroup}`);
        const emptyLength = document.querySelectorAll(`.gr-${emptyGroup}`).length;
        let emptyCells = [];
        for (let i = 0; i < emptyLength; i++) {
            emptyCells.push(Array.prototype.indexOf.call(allCells, emptyDivs[i].parentElement));
        }
        emptyGroup++;
        for (let i = 0; i < emptyCells.length; i++) {
            const tableNumber = allCells[emptyCells[i]].parentElement.parentElement.parentElement.dataset.id;
            if (allCells[emptyCells[i]+a] != undefined) {
                nextElementToOpen(allCells[emptyCells[i]+a], allCells[emptyCells[i]+a].children[0]);
            }
            if (allCells[emptyCells[i]-a] != undefined) {
                nextElementToOpen(allCells[emptyCells[i]-a], allCells[emptyCells[i]-a].children[0]);
            }
            if (allCells[emptyCells[i]+b] != undefined && tableNumber == allCells[emptyCells[i]+b].parentElement.parentElement.parentElement.dataset.id) {
                nextElementToOpen(allCells[emptyCells[i]+b], allCells[emptyCells[i]+b].children[0]);
            }
            if (allCells[emptyCells[i]-b] != undefined && tableNumber == allCells[emptyCells[i]-b].parentElement.parentElement.parentElement.dataset.id) {
                nextElementToOpen(allCells[emptyCells[i]-b], allCells[emptyCells[i]-b].children[0]);
            }
            if (allCells[emptyCells[i]-c] != undefined && Number(tableNumber) == Number(allCells[emptyCells[i]-c].parentElement.parentElement.parentElement.dataset.id) + 1) {
                nextElementToOpen(allCells[emptyCells[i]-c], allCells[emptyCells[i]-c].children[0]);
            }
            if (allCells[emptyCells[i]-d] != undefined && tableNumber !== allCells[emptyCells[i]-d].parentElement.parentElement.parentElement.dataset.id) {
                nextElementToOpen(allCells[emptyCells[i]-d], allCells[emptyCells[i]-d].children[0]);
            }
            if (allCells[emptyCells[i]+c] != undefined && Number(tableNumber) == Number(allCells[emptyCells[i]+c].parentElement.parentElement.parentElement.dataset.id) - 1) {
                nextElementToOpen(allCells[emptyCells[i]+c], allCells[emptyCells[i]+c].children[0]);
            }
            if (allCells[emptyCells[i]+d] != undefined && tableNumber !== allCells[emptyCells[i]+d].parentElement.parentElement.parentElement.dataset.id) {
                nextElementToOpen(allCells[emptyCells[i]+d], allCells[emptyCells[i]+d].children[0]);
            }
        }
        minesCounterTopPanel.innerHTML = `${minesAmount}`;
        return;
    }
}
function indexToOpen(allCells, nextCell, nextCellChild, cellsToOpen, duplicate) {
    if (nextCellChild != undefined && String(nextCellChild.classList[1]) == "empty-cells" && nextCellChild.style.opacity !== "1") {
        duplicate = Array.prototype.indexOf.call(allCells, nextCell);
        if (cellsToOpen.includes(duplicate) == false) {
            cellsToOpen.push(Array.prototype.indexOf.call(allCells, nextCell));
        }
    }
    else if (nextCellChild != undefined && String(nextCellChild.classList[0]) == "flag" && nextCellChild.dataset.id == "empty") {
        duplicate = Array.prototype.indexOf.call(allCells, nextCell);
        if (cellsToOpen.includes(duplicate) == false) {
            cellsToOpen.push(Array.prototype.indexOf.call(allCells, nextCell));
        }
    }
}
function nextElementToOpen(nextCell, nextCellChild) {
    if (nextCellChild != undefined && String(nextCellChild.classList[0]) == "number" && nextCellChild.style.opacity !== "1") {
        nextCellChild.style.opacity = "1";
        nextCell.classList.add(`no-resize-${gameMineColor}`);
    }
    else if (nextCellChild != undefined && String(nextCellChild.classList[0]) == "flag") {
        nextCell.innerHTML = `<p class="number">${nextCellChild.dataset.indexNumber}</p>`;
        nextCellChild.style.opacity = "1";
        nextCell.classList.add(`no-resize-${gameMineColor}`);
        minesAmount++;
    }
}
// Generating mines and numbers
function elementsGeneration(gameDifficulty, firstMoveCheker, firstCell) {
    if (firstMoveCheker == true) {
        firstMoveFlag = false;
        if (gameDifficulty == "easy") {
            forElementsGeneration(10, 81, firstCell, "easy");
        }
        else if (gameDifficulty == "medium") {
            forElementsGeneration(40, 256, firstCell, "medium");
        }
        else if (gameDifficulty == "hard") {
            forElementsGeneration(99, 480, firstCell, "hard");
        }
    }
    else {
        return;
    }
}
let cellsWithMines = [];
function forElementsGeneration(minesNumber, cellsNumber, target, gameDifficulty) {
    const allCells = document.querySelectorAll("td");
    for (let i = 0; i < minesNumber; i++) {
        let mineCell;
        mineCell = Math.floor(Math.random() * Math.floor(cellsNumber));
        let duplicate = cellsWithMines.find(elem => { return elem == mineCell})
        if (duplicate == undefined && mineCell != target) {
            cellsWithMines.push(mineCell);
            if (gameMineColor == "gothic") {
                allCells[mineCell].innerHTML = `<img src="img/renesans-mine-icon.png" alt="mine-icon" class="mines-field">`;
            }
            else {
                allCells[mineCell].innerHTML = `<img src="img/${gameMineColor}-mine-icon.png" alt="mine-icon" class="mines-field">`;
            }
        }
        else {
            i -= 1;
            continue;
        }
    }
    if (gameDifficulty == "easy") {
        setNumbers(9, 1, 10, 8);
    }
    else if (gameDifficulty == "medium") {
        setNumbers(16, 1, 17, 15); 
    }
    else if (gameDifficulty == "hard") {
        setNumbers(30, 1, 31, 29);
    }
}
function setNumbers(a, b, c, d) {
    const allCells = document.querySelectorAll("td");
    const styleForEmptyCells = document.querySelector(".active-style").dataset.id;
    for (let i = 0; i < allCells.length; i++) {
        let mineCounter = 0;
        const tableNumber = allCells[i].parentElement.parentElement.parentElement.dataset.id;
        if (allCells[i].innerHTML.length < 60) {
            if (allCells[i+a] != undefined) {
                if (allCells[i+a].innerHTML.length > 60) {
                    mineCounter++;
                }
            }
            if (allCells[i-a] != undefined) {
                if (allCells[i-a].innerHTML.length > 60) {
                    mineCounter++;
                }
            }
            if (allCells[i+b] != undefined && tableNumber == allCells[i+b].parentElement.parentElement.parentElement.dataset.id) {
                if (allCells[i+b].innerHTML.length > 60) {
                    mineCounter++;
                }
            }
            if (allCells[i-b] != undefined && tableNumber == allCells[i-b].parentElement.parentElement.parentElement.dataset.id) {
                if (allCells[i-b].innerHTML.length > 60) {
                    mineCounter++;
                }
            }
            if (allCells[i-c] != undefined && Number(tableNumber) == Number(allCells[i-c].parentElement.parentElement.parentElement.dataset.id) + 1) {
                if (allCells[i-c].innerHTML.length > 60) {
                    mineCounter++;
                }
            }
            if (allCells[i-d] != undefined && tableNumber !== allCells[i-d].parentElement.parentElement.parentElement.dataset.id) {
                if (allCells[i-d].innerHTML.length > 60) {
                    mineCounter++;
                }
            }
            if (allCells[i+c] != undefined && Number(tableNumber) == Number(allCells[i+c].parentElement.parentElement.parentElement.dataset.id) - 1) {
                if (allCells[i+c].innerHTML.length > 60) {
                    mineCounter++;
                }
            }
            if (allCells[i+d] != undefined && tableNumber !== allCells[i+d].parentElement.parentElement.parentElement.dataset.id) {
                if (allCells[i+d].innerHTML.length > 60) {
                    mineCounter++;
                }
            }
            if (mineCounter == 0) {
                allCells[i].innerHTML = `<div class='${styleForEmptyCells}-empty-cell empty-cells'></div>`;
            }
            else {
                allCells[i].innerHTML = `<p class="number">${mineCounter}</p>`;
            }
        }
    }
}
// Game stopwatch
let time;
let sekund = 1;
let intervalFlag = true;
function stopwatch() {
    const currentSekund = document.querySelector("#current-sekund");
    if (intervalFlag == true) {
        intervalFlag = false;
        time = setInterval(timeRuns, 1000);
        function timeRuns() {
            if (sekund == 1000) {
                return;
            }
            currentSekund.innerHTML = sekund;
            sekund++;
        }
    }
    else {
        return;
    }
}
// New game (reseting)
function reset() {
    clearInterval(time);
    document.querySelector("#current-sekund").innerHTML = "0";
    intervalFlag = true;
    sekund = 1;
    firstMoveFlag = true;
    cellsWithMines = [];
    gameLost = false;
    gameEnd = false;
    const allCells = document.querySelectorAll("td");
    allCells.forEach(td => {
        td.innerHTML = "";
        td.style.pointerEvents = "auto";
        td.className = "";
    })
    restartBtn.innerHTML = "<i class='fas fa-smile'></i>";
    emptyGroup = 1;
    if (gameDifficulty == "easy") {
        minesAmount = 10;
    }
    else if (gameDifficulty == "medium") {
        minesAmount = 40;
    }
    else if (gameDifficulty == "hard") {
        minesAmount = 99;
    }
    document.querySelector("#current-number").innerHTML = `${minesAmount}`;
}
// Restart button
const restartBtn = document.querySelector("#central-btn")
restartBtn.addEventListener("click", ()=> {
    reset();
})
document.addEventListener("keypress", (e)=> {
    if (e.code === "KeyR") {
        reset();    
    }
    else {
        return;
    }
})
// Prevent any clicks when the game ends
let gameEnd = false;
const gameSection = document.querySelector(".cells");
gameSection.addEventListener("contextmenu", (event) => {
    if (gameEnd == true) {
        event.preventDefault();
    }
})


