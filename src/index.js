import './main.css';
import emojis from './emoji.struct';

class Game{
    constructor(){
        this.doors = [];
        this.wins = 0;
        this.loses = 0;
        this.numOfGamesPlayed = 0;
        
        this.firstDoorSelected = null;
        this.doorShown = null;
        this.finalDoorSelected = null;
        
        this.prizeArray = [emojis.poop, emojis.poop, emojis.money];
        this.door1 = null;
        this.door2 = null;
        this.door3 = null;
        this.winsText = null;
        this.losesText = null;
        this.ratio = null;
    }

    init(){
        this.grabElements();
        this.setDoorPrizes();
        this.render();
    }

    setDoorPrizes(){
        this.closeAllDoors();
        this.doors = this._shufflePrizes(this.prizeArray.slice());
        console.log(this.doors);
    }

    grabElements(){
        this.door1 = document.getElementsByClassName('prize-one')[0];
        this.door2 = document.getElementsByClassName('prize-two')[0];
        this.door3 = document.getElementsByClassName('prize-three')[0];
        this.winsText = document.getElementById('wins');
        this.losesText = document.getElementById('loses');
        this.ratio = document.getElementById('ratio');
    }

    render(){
        this.door1.innerHTML = this.doors[0];
        this.door2.innerHTML = this.doors[1];
        this.door3.innerHTML = this.doors[2];
    }

    closeAllDoors(){
        this.door1.nextElementSibling.style.animation = 'closeDoor 300ms forwards';
        this.door2.nextElementSibling.style.animation = 'closeDoor 300ms forwards';
        this.door3.nextElementSibling.style.animation = 'closeDoor 300ms forwards';
    }

    openDoor(num){
        const doorNum = `door${num+1}`;
        this[doorNum].nextElementSibling.style.animation = 'openDoor 300ms forwards';
    }

    closeDoor(num){
        const doorNum = `door${num+1}`;
        this[doorNum].nextElementSibling.style.animation = 'closeDoor 300ms forwards';
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

    // Highlight First Selected Door
    highlightSelectedDoor(door){
        this[`door${door + 1}`].nextElementSibling.style.filter = 'hue-rotate(45deg)';
    }

    // Game Play
    selectFirstDoor(){
        let randomIndex = Math.floor(Math.random() * this.doors.length);

        this.firstDoorSelected = randomIndex;
        this.highlightSelectedDoor(randomIndex);
        console.log('RI: ', randomIndex, 'First: ', this.firstDoorSelected)
        this.selectSecondDoor();
    }

    selectSecondDoor(){
        console.log('1st Door Selected: ', this.firstDoorSelected)
        for(let i = 0; i < this.doors.length; i++){
            if(i !== this.firstDoorSelected && this.doors[i] !== emojis.money){
                this.openDoor(i)
                this.doorShown = i;
                console.log('Door Shown: ', this.doorShown);
                // debugger
                setTimeout(() => {
                    this.switchDoors();
                },1000);
                return;
            }
        }
    }

    switchDoors(){
        this.unhighlightAllDoors();
        let doorOptions = [0,1,2];
        doorOptions.splice(doorOptions.indexOf(this.firstDoorSelected),1);
        doorOptions.splice(doorOptions.indexOf(this.doorShown),1);
        this.finalDoorSelected = doorOptions[0];
        this.highlightSelectedDoor(this.finalDoorSelected);

        console.log('Final Door Selected: ', this.finalDoorSelected);
        console.warn(`1st: ${this.firstDoorSelected}, Shown: ${this.doorShown}, Final: ${this.finalDoorSelected}`);
        console.warn(this.doors);
        this.openDoor(this.finalDoorSelected);
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
        this.winsText.innerText = this.wins;
        this.calculateWinRatio();
        setTimeout(() => {
            this.resetGame();
        }, 600);
    }

    lose(){
        console.log('lose')
        this.loses++;
        this.losesText.innerText = this.loses;
        this.calculateWinRatio();
        setTimeout(() => {
            this.resetGame();
        }, 600)
    }

    calculateWinRatio(){
        let ratio = (this.wins / (this.wins + this.loses)) * 100;
        this.ratio.innerText = ratio.toFixed(2);
    }

    unhighlightAllDoors(){
        this.door1.nextElementSibling.style.filter = 'hue-rotate(0deg)';
        this.door2.nextElementSibling.style.filter = 'hue-rotate(0deg)';
        this.door3.nextElementSibling.style.filter = 'hue-rotate(0deg)';
    }

    resetGame(){
        this.numOfGamesPlayed++;
        this.unhighlightAllDoors();
        this.firstDoorSelected = null;
        this.finalDoorSelected = null;
        this.doorShown = null;
        this.setDoorPrizes();
        this.render();
        if(this.numOfGamesPlayed < 100){
            setTimeout(() => {
                this.selectFirstDoor();
            },500);
        }
    }
}

window.Game = Game;
window.onload = function(){
    // document.getElementsByClassName('door-container')[0].innerHTML += 
    // `<span class="prize">${emojis.poop}</span>`;

    var x= new Game();
    x.init();
    window.x = x;
    window.x.selectFirstDoor();
}
