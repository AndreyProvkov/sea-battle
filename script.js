const record = document.getElementById("record");
const shot = document.getElementById("shot");
const hit = document.getElementById("hit");
const dead = document.getElementById("dead");
const enemy = document.getElementById("enemy");
const again = document.getElementById("again");
const header = document.querySelector(".header");
const chooseDirection = 0.5;
const fieldLength = 10;
const beginRecord = 0;
const collisionCellsInRow = 3;

const game = {
    ships: [],
    shipCount: 0,
    optionShip: {
        count: [1, 2, 3, 4],
        size: [4, 3, 2, 1]
    },
    collision: new Set(),
    generateShip() {
        for (let i = 0; i < this.optionShip.count.length; i++) {
            for (let j = 0; j < this.optionShip.count[i]; j++) {
                const size = this.optionShip.size[i];
                const ship = this.generateOptionsShip(size);
                this.ships.push(ship);
                this.shipCount++;
            }
        }
    },
    generateOptionsShip(shipSize) {
        const ship = {
            location: [],
            hit: []
        };
        
        const direction = Math.random() < chooseDirection;
        let x, y;
        if (direction) {
            x = Math.floor(Math.random() * fieldLength);
            y = Math.floor(Math.random() * (fieldLength - shipSize));
        } else {
            x = Math.floor(Math.random() * (fieldLength - shipSize));
            y = Math.floor(Math.random() * fieldLength);
        }

        for (let i = 0; i < shipSize; i++) {
            if (direction) {
                ship.location.push(x + "" + (y + i));
            } else {
                ship.location.push((x + i) + "" + y);
            }
            ship.hit.push("");
        }

        if (this.checkCollision(ship.location)) {
            return this.generateOptionsShip(shipSize);
        }

        this.addCollision(ship.location);

        return ship;
    },
    checkCollision(location) {
        for (const coord of location) {
            if (this.collision.has(coord)) {
                return true;
            }
        }
    },
    addCollision(location) {
        for (let i = 0 ; i < location.length; i++) {
            const startCoordX = location[i][0] - 1;

            for (let j = startCoordX; j < startCoordX + collisionCellsInRow; j++) {
                const startCoordY = location[i][1] - 1;

                for (let z = startCoordY; z < startCoordY + collisionCellsInRow; z++) {
                    
                    if (j >= 0 && j < fieldLength && z >= 0 && z < fieldLength) {
                        const coord = j + "" + z;
                        this.collision.add(coord);
                    }
                }
            }
        }
    },
    gameRestart() {
        console.log(game.ships);
        header.textContent = "Sea Battle";
        header.style.color = "black";
        game.ships = [];
        game.shipCount = 0;
        play.shot = 0;
        play.hit = 0;
        play.dead = 0;
        play.render();
        console.log(enemy);
        game.collision.clear();
        for (let i = 0; i < fieldLength; i++) {
            for (let j = 0; j < fieldLength; j++) {
                const cellTable = document.getElementById(i + "" + j);
                cellTable.className = "";
            }
        }
        game.generateShip();
    }
};

const play = {
    record: localStorage.getItem("seaBattleRecord") || beginRecord,
    shot: 0,
    hit: 0,
    dead: 0,
    set updateData(data) {
            this[data] += 1;
            this.render();
    },
    render() {
        record.textContent = this.record;
        shot.textContent = this.shot;
        hit.textContent = this.hit;
        dead.textContent = this.dead;
    }
};

const show = {
    hit(elem) {
        this.changeClass(elem, "hit");
    },
    miss(elem) {
        this.changeClass(elem, "miss");
    },
    dead(elem) {
        this.changeClass(elem, "dead");
    },
    changeClass(elem, value) {
        elem.className = value;
    },
    isClassName(elem) {
        if (elem.className) {
            return false;
        } else {
            return true;
        }
    }
};

const fire = (event) => {
    const target = event.target;
    if (show.isClassName(target) && 
    target.tagName === "TD" && 
    game.shipCount !== 0) {
        show.miss(target);
        play.updateData = "shot";

        for (let i = 0; i < game.ships.length; i++) {
            const ship = game.ships[i];
            const index = ship.location.indexOf(target.id);
            if (index >= 0) {
                show.hit(target);
                play.updateData = "hit";
                ship.hit[index] = "x";
                const life = ship.hit.indexOf("");
                if (life < 0) {
                    play.updateData = "dead";
                    for (const id of ship.location) {
                        show.dead(document.getElementById(id));
                    }
                    game.shipCount -= 1;

                    if (!game.shipCount) {
                        header.textContent = "Игра окончена!";
                        header.style.color = "red";

                        if (play.shot < play.record || play.record === 0) {
                            localStorage.setItem("seaBattleRecord", play.shot);
                            play.record = play.shot;
                            play.render();
                        }
                    }
                }
            }
        }
    }
};

const init = () => {
    enemy.addEventListener("click", fire);
    play.render();
    game.generateShip();
    again.addEventListener("click", game.gameRestart);
    /*again.addEventListener("click", () => {
        location.reload();
    });*/
    record.addEventListener("dblclick", () => {
        localStorage.clear();
        play.record = 0;
        play.render();
    })
};

init();
