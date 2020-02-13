import './main.css';
import emojis from './emoji.struct';
import { View } from './view';

class Game{
    // DOMElement is parent node of game HTML
    // Mode is set to true to always switch doors, false to always keep selected door
    constructor(DOMElement, mode){
        this.doors = [];
        this.wins = 0;
        this.loses = 0;
        this.numOfGamesPlayed = 0;
        this.alwaysSwitch = mode;
        
        this.firstDoorSelected = null;
        this.doorShown = null;
        this.finalDoorSelected = null;
        
        this.prizeArray = [emojis.poop, emojis.poop, emojis.money];
        this.view = new View(DOMElement);
    }

    init(){
        this.setDoorPrizes();
        this.view.render(this.doors);
        this.selectFirstDoor();
        window.safeToStart = false;
    }

    setDoorPrizes(){
        this.view.closeAllDoors();
        this.doors = this._shufflePrizes(this.prizeArray.slice());
    }

    _shufflePrizes(prizeArray){
        var currentIndex = prizeArray.length;
	    var temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = prizeArray[currentIndex];
            prizeArray[currentIndex] = prizeArray[randomIndex];
            prizeArray[randomIndex] = temporaryValue;
        }
    return prizeArray;
    }

    // Game Play
    selectFirstDoor(){
        let randomIndex = Math.floor(Math.random() * this.doors.length);

        this.firstDoorSelected = randomIndex;
        this.view.highlightSelectedDoor(randomIndex);
        this.selectSecondDoor();
    }

    selectSecondDoor(){
        for(let i = 0; i < this.doors.length; i++){
            if(i !== this.firstDoorSelected && this.doors[i] !== emojis.money){
                this.view.openDoor(i)
                this.doorShown = i;
                setTimeout(() => {
                    if(this.alwaysSwitch){
                        this.switchDoors();
                    } else {
                        this.keepSelectedDoor();
                    }
                    
                },1000);
                return;
            }
        }
    }

    switchDoors(){
        this.view.unhighlightAllDoors();
        let doorOptions = [0,1,2];
        doorOptions.splice(doorOptions.indexOf(this.firstDoorSelected),1);
        doorOptions.splice(doorOptions.indexOf(this.doorShown),1);
        this.finalDoorSelected = doorOptions[0];
        this.view.highlightSelectedDoor(this.finalDoorSelected);

        this.view.openDoor(this.finalDoorSelected);
        setTimeout(() => {
            this.checkWin();
        },500);
    }

    keepSelectedDoor(){
        this.finalDoorSelected = this.firstDoorSelected;
        this.view.openDoor(this.finalDoorSelected);
        setTimeout(() => {
            this.checkWin();
        },500);
    }

    checkWin(){
        if(this.doors[this.finalDoorSelected] === emojis.money){
            this.win();
        }
        else {
            this.lose();
        }
    }

    win(){
        this.wins++;
        this.view.updateWins(this.wins);
        this.calculateWinRatio();
        setTimeout(() => {
            this.resetGame();
        }, 600);
    }

    lose(){
        this.loses++;
        this.view.updateLoses(this.loses);
        this.calculateWinRatio();
        setTimeout(() => {
            this.resetGame();
        }, 600)
    }

    calculateWinRatio(){
        let ratio = (this.wins / (this.wins + this.loses)) * 100;
        this.view.updateRatio(ratio.toFixed(2));
    }

    resetGame(){
        this.numOfGamesPlayed++;
        this.view.unhighlightAllDoors();
        this.firstDoorSelected = null;
        this.finalDoorSelected = null;
        this.doorShown = null;
        this.setDoorPrizes();
        this.view.render(this.doors);
        if(this.numOfGamesPlayed < 100){
            setTimeout(() => {
                this.selectFirstDoor();
            },500);
        } else {
            this.doors = [];
            this.wins = 0;
            this.loses = 0;
            window.safeToStart = true;
        }
    }
}


window.onload = function(){
    window.safeToStart = true;
    const startGames = () =>{
        if(safeToStart){
            const gameAlwaysSwitch= new Game('game-always-switch', true);
            const gameNeverSwitch= new Game('game-never-switch', false);
            gameAlwaysSwitch.init();    
            gameNeverSwitch.init(); 
        }
        else {
            alert('Game must finish before restarting.');
        }
    }

    const btnStart = document.getElementById('start');
    btnStart.addEventListener('click', () => {
        startGames();
    })
}