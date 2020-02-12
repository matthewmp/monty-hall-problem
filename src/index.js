import './main.css';
import emojis from './emoji.struct';
import { View } from './view';

class Game{
    constructor(DOMElement){
        this.doors = [];
        this.wins = 0;
        this.loses = 0;
        this.numOfGamesPlayed = 0;
        
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
    }

    setDoorPrizes(){
        this.view.closeAllDoors();
        this.doors = this._shufflePrizes(this.prizeArray.slice());
        console.log(this.doors);
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
        console.log('RI: ', randomIndex, 'First: ', this.firstDoorSelected)
        this.selectSecondDoor();
    }

    selectSecondDoor(){
        console.log('1st Door Selected: ', this.firstDoorSelected)
        for(let i = 0; i < this.doors.length; i++){
            if(i !== this.firstDoorSelected && this.doors[i] !== emojis.money){
                this.view.openDoor(i)
                this.doorShown = i;
                console.log('Door Shown: ', this.doorShown);
                setTimeout(() => {
                    this.switchDoors();
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

        console.log('Final Door Selected: ', this.finalDoorSelected);
        console.warn(`1st: ${this.firstDoorSelected}, Shown: ${this.doorShown}, Final: ${this.finalDoorSelected}`);
        console.warn(this.doors);
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
        console.log('win')
        this.wins++;
        this.view.updateWins(this.wins);
        this.calculateWinRatio();
        setTimeout(() => {
            this.resetGame();
        }, 600);
    }

    lose(){
        console.log('lose')
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
        }
    }
}

window.Game = Game;
window.onload = function(){
    const gameAlwaysSwitch= new Game('game-always-switch');
    window.gameAlwaysSwitch = gameAlwaysSwitch;
    gameAlwaysSwitch.init();
    
    const gameNeverSwitch= new Game('game-never-switch');
    window.gameNeverSwitch = gameNeverSwitch;
    gameNeverSwitch.init();
}
