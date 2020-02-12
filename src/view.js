export class View {
    constructor(rootElementID){
        this.app = document.getElementById(rootElementID);
        
        this.door1 = this.app.querySelector('.prize-one');
        this.door2 = this.app.querySelector('.prize-two');
        this.door3 = this.app.querySelector('.prize-three');
        this.winsText = this.app.querySelector('#wins');
        this.losesText = this.app.querySelector('#loses');
        this.ratio = this.app.querySelector('#ratio');
    }

    render(doorsArray){
        this.door1.innerHTML = doorsArray[0];
        this.door2.innerHTML = doorsArray[1];
        this.door3.innerHTML = doorsArray[2];
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

    highlightSelectedDoor(door){
        this[`door${door + 1}`].nextElementSibling.style.filter = 'hue-rotate(45deg)';
    }

    unhighlightAllDoors(){
        this.door1.nextElementSibling.style.filter = 'hue-rotate(0deg)';
        this.door2.nextElementSibling.style.filter = 'hue-rotate(0deg)';
        this.door3.nextElementSibling.style.filter = 'hue-rotate(0deg)';
    }

    updateWins(num){
        this.winsText.innerText = num;
    }

    updateLoses(num){
        this.losesText.innerText = num;
    }

    updateRatio(ratio){
        this.ratio.innerText = ratio;
    }

}