// Define variabel and button first
const start = document.querySelector('#start');
const instructionbtn = document.querySelector('#show-instruction');
const closeIntructionBtn = document.querySelector('#close-instruction');
const leaderboardBtn = document.querySelector('#LeaderBoard');

// Define username
let username = document.querySelector('#username');

// Setup start button disabled
start.disabled = true;

// Set Validation For Input box
const validate = () => {
    if (username.value !== '') {
        start.disabled = false;
    } else {
        start.disabled = true;
    }
}

// Event Listener for checking input
username.addEventListener('input', (e) => {
    validate();
});
// Instruction Button
instructionbtn.addEventListener('click', (e) => {
    document.querySelector('#show-menu-instruction').classList.add('active');
});

// Close Instruction Button
closeIntructionBtn.addEventListener('click', (e) => {
    document.querySelector('#show-menu-instruction').classList.remove('active');
});

// Setup LeaderBoard Javascript
let clickedLeaderBoard = false;
leaderboardBtn.addEventListener('click', () => {
    if (clickedLeaderBoard) {
        clickedLeaderBoard = false;
        document.querySelector('.leaderboard-table').classList.remove('active');
    } else {
        clickedLeaderBoard = true;
        document.querySelector('.leaderboard-table').classList.add('active');
    }

});
// Setup playbtn
start.addEventListener('click', (e) => {
    document.querySelector('.leaderboard-table').classList.remove('active');
    document.querySelector('.intruction-board').style.display = 'none';
    document.querySelector('.container-board').style.display = 'flex';

    let game = new Game(username.value);
    game.update();
});

document.querySelector('#restart').addEventListener('click', () => {
    window.location.reload();
});

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + 1);
}

readDataLeadboard();

function readDataLeadboard() {
    const data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : [];

    let createElem = document.createElement('td');

    let tbody = document.querySelector('.tr-table');

    let no = 0;

    data.map((item) => {
        no++;
        let tr = document.createElement('tr');

        let td = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');

        td.innerHTML = item.username;
        td2.innerHTML = item.stage;
        td3.innerHTML = no;

        tr.append(td3);
        tr.append(td);
        tr.append(td2);

        tbody.append(tr);

    });

    // console.log(data);


}

class Game {
    // Define the default
    constructor(username) {
        this.username = username;

        this.memorizeTime = 10;
        this.memorizeInit = true;

        this.leftArea = [
            0, 10, 20, 30, 40, 50, 60, 70, 80, 90
        ];
        this.winArea = [
            9, 19, 29, 39, 49, 59, 69, 79, 89, 99
        ];
        this.firstGrid = [
            2, 12, 22, 32, 42, 52, 62, 72, 82, 92
        ];
        this.secondGrid = [
            4, 14, 24, 34, 44, 54, 64, 74, 84, 94
        ];
        this.thirdGrid = [
            6, 16, 26, 36, 46, 56, 66, 76, 86, 96
        ];
        this.fourthGrid = [
            8, 18, 28, 38, 48, 58, 68, 78, 88, 98
        ];

        this.topAreaMax = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9
        ];
        this.bottomAreaMax = [
            90, 91, 92, 93, 94, 95, 96, 97, 98, 99
        ];
        this.rightAreaMax = [
            9, 19, 29, 39, 49, 59, 69, 79, 89, 99
        ];

        this.randBom = [];

        this.round = 1;
        this.hint = true;

        this.heart = 3;

        this.gameOver = false;

        this.elem = [];
        this.player = null;
        this.finish = null;

        this.isFreezedLeft = true;
        this.isFreezedTop = false;
        this.isFreezedBottom = false;
        this.isFreezedRight = false;

        this.setupDetailGame();
        this.generateBlock();
        this.processMemorizeTime();

        this.generatePlayer();
        this.handleMovement();

        this.generateWinArea(); //changetoplayer
        this.generateGrayBom();

    }
    resetAll() {
        document.querySelector('#memorize').innerHTML = 'Memorizing Time';
        document.getElementById(this.player).classList.remove('player');
        this.player = null;
        this.generatePlayer();

        this.randBom = [];
        this.elem = [];

        if(this.round > 10){
            this.memorizeTime = 3;
        }else if(this.round > 5){
            this.memorizeTime = 6;
        }else{
            this.memorizeTime = 10;
        }
        this.memorizeInit = true;

        this.isFreezedLeft = true;
        this.isFreezedTop = false;
        this.isFreezedBottom = false;
        this.isFreezedRight = false;
        

        this.generateWinArea(); //changetoplayer
        this.generateGrayBom();
    }
    // GenerateRandomGrayBom and pushing to array
    generateGrayBom() {
        for (let i = 0; i <= 8; i++) {
            let randId = random(i === 0 ? 1 : i, this.firstGrid.length);

            if (randId === null) {
                randId = 0;
            }
            document.getElementById(this.firstGrid[randId]).classList.add('gray');
            this.randBom.push(this.firstGrid[randId]);

        }
        this.randBom.push(this.firstGrid[0]);
        document.getElementById(this.firstGrid[0]).classList.add('gray');
        this.randBom.push(this.firstGrid[9]);
        document.getElementById(this.firstGrid[9]).classList.add('gray');

        for (let i = 0; i <= 9; i++) {
            let randId = random(i === 0 ? 1 : i, this.secondGrid.length);

            if (randId === null) {
                randId = 0;
            }
            document.getElementById(this.secondGrid[randId]).classList.add('gray');
            this.randBom.push(this.secondGrid[randId]);
        }

        for (let i = 0; i <= 9; i++) {
            let randId = random(i === 0 ? 1 : i, this.thirdGrid.length);

            if (randId === null) {
                randId = 0;
            }
            document.getElementById(this.thirdGrid[randId]).classList.add('gray');
            this.randBom.push(this.thirdGrid[randId]);
        }

        for (let i = 0; i <= 9; i++) {
            let randId = random(i === 0 ? 1 : i, this.fourthGrid.length);

            if (randId === null) {
                randId = 0;
            }
            document.getElementById(this.fourthGrid[randId]).classList.add('gray');
            this.randBom.push(this.fourthGrid[randId]);
        }
        // let time = this.memorizeTime;

        setInterval(() => {
            this.memorizeTime - 1;
            document.querySelector('#memorize').innerHTML = 'Memorizing Time';

            if (this.memorizeTime <= 0) {
                this.randBom.map((item) => {
                    document.getElementById(item).classList.remove('gray');
                });
                document.querySelector('#memorize').innerHTML = 'Move Time';
                this.memorizeInit = false;
                // clearInterval(this);
            }

        }, 1000);

    }
    // Check if the player touch gray
    checkGameover() {

        this.randBom.map((bom) => {
            // console.log(bom, this.player);
            if (bom === this.player) {
                this.heart--;
                alert('You Hit A Wall !');

                document.getElementById(this.player).classList.remove('player');

                let randId = random(1, this.leftArea.length);

                if (randId === null) {
                    randId = 0;
                }

                document.getElementById(this.leftArea[randId]).classList.add('player');
                this.player = this.leftArea[randId];

                if (this.heart <= 0) {
                    this.gameOver = true;
                    document.querySelector('#usernameover').innerHTML = `Username : ${this.username}`;
                    document.querySelector('#stageNum').innerHTML = `Stage Number : ${this.round}`;
                    document.querySelector('#gameover-menu').style.display = 'flex';
                }
                document.querySelector('#heart-total').innerHTML = `Heart : ${this.heart}`;

            }
        });

    }
    // Generate random win area at right grid
    generatePlayer() {
        if (this.player) {
            console.log('reseted');
            document.getElementById(this.player).classList.remove('player');
        }

        let randId = random(1, this.leftArea.length);
        if (randId === null) {
            randId = 0;
        }
        document.getElementById(this.leftArea[randId]).classList.add('player');
        this.player = this.leftArea[randId];
    }
    // Generate background for player
    generateWinArea() {
        if (this.finish) {
            document.getElementById(this.finish).classList.remove('win');
        }

        let randId = random(1, this.winArea.length);
        if (randId === null) {
            randId = 9;
        }
        document.getElementById(this.winArea[randId]).classList.add('win');
        this.finish = this.winArea[randId];
    }
    // Check Winner 
    checkWinner() {
        if (this.finish === this.player) {
            alert(`You Finished Round ${this.round}`);
            this.round++;
            this.resetAll();
            document.querySelector('.roundArea').innerHTML = `Round : ${this.round}`;
        }
    }

    // HandleMovement player
    handleMovement() {
        window.addEventListener('keydown', (e) => {
            if (!this.gameOver) {
                if (!this.memorizeInit) {
                    if (e.key === 'ArrowRight') {
                        this.rightAreaMax.map((area) => {
                            if(area === this.player){
                                this.isFreezedRight = true;
                            }
                        });

                        if(!this.isFreezedRight){
                            this.isFreezedLeft = false;
                            document.getElementById(this.player).classList.remove('player');
                            this.player = this.player + 1;
                            document.getElementById(this.player).classList.add('player');
    
    
                            this.checkWinner();
                            this.checkGameover();
                        }
                      

                    } else if (e.key === 'ArrowLeft') {
                        this.leftArea.map((item) => {
                            if (item === this.player) {
                                this.isFreezedLeft = true;
                            }
                        });

                        if (!this.isFreezedLeft) {
                            this.isFreezedRight = false;
                            console.log(this.player);

                            document.getElementById(this.player).classList.remove('player');
                            this.player = this.player - 1;
                            document.getElementById(this.player).classList.add('player');

                            this.checkWinner();
                            this.checkGameover();
                        }


                    } else if (e.key === 'ArrowUp') {
                        this.topAreaMax.map((top) => {
                            if (top === this.player) {
                                this.isFreezedTop = true;
                            }
                        });

                        if (!this.isFreezedTop) {
                            this.isFreezedBottom = false;
                            document.getElementById(this.player).classList.remove('player');
                            this.player = this.player - 10;
                            document.getElementById(this.player).classList.add('player');

                            this.checkWinner();
                            this.checkGameover();
                        }

                    } else if (e.key === 'ArrowDown') {
                        this.bottomAreaMax.map((bott) => {
                            if (bott === this.player) {
                                this.isFreezedBottom = true;
                            }
                        })
                        if (!this.isFreezedBottom) {
                            this.isFreezedTop = false;

                            document.getElementById(this.player).classList.remove('player');
                            this.player = this.player + 10;
                            document.getElementById(this.player).classList.add('player');

                            this.checkWinner();
                            this.checkGameover();

                        }

                    }
                }
            }
        });

        // Check Hit Button Clicked or not
        document.querySelector('#hint').addEventListener('click', () => {
            this.randBom.map((item) => {
                console.log(item);
                document.getElementById(item).classList.add('gray');
            });

            document.querySelector('#hint').style.display = 'none';
            this.memorizeInit = true;
            setTimeout(() => {
                this.memorizeInit = false;
                document.getElementById(item).classList.remove('gray');
            }, 1000);
        });

        document.querySelector('#save-score').addEventListener('click', () => {
            const data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : [];

            let dataMain = {
                username: this.username,
                stage: this.round
            };

            data.push(dataMain);

            localStorage.setItem('data', JSON.stringify(data));

            window.location.reload();
        });

    }

    processMemorizeTime() {
        setInterval(() => {
            if (this.memorizeTime <= 0) {
                this.memorizeTime = 0;
                clearInterval(this);
            } else {
                this.memorizeTime--;
                document.querySelector('#seconds').innerHTML = `${this.memorizeTime}s`;
            }
        }, 1000);
    }
    setupDetailGame() {
        // document.querySelector('#playername').innerHTML = this.username;
    }
    generateBlock() {
        let parent = document.querySelector('.box-item');
        for (let i = 0; i < 100; i++) {
            console.log('heii');
            var newDiv = document.createElement('div');
            newDiv.id = i;
            newDiv.classList.add('items');

            parent.append(newDiv);
            this.elem.push(newDiv);
        }
    }

    update() {
        requestAnimationFrame(this.update.bind(this));
    }
}

