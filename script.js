const record = document.getElementById('record');
const shot = document.getElementById('shot');
const hit = document.getElementById('hit');
const dead = document.getElementById('dead');
const enemy = document.getElementById('enemy');
const again = document.getElementById('again');
const headerEl = document.querySelector('.header');

const game = {
    ships: [
        {
            location: ['00', '01', '02', '03'],
            hit: ['', '', '', ''],
        },
        {
            location: ['05', '06', '07'],
            hit: ['', '', '']
        },
        {
            location: ['20', '21'],
            hit: ['', ''],
        },
        {
            location: ['09'],
            hit: ['']
        }
    ],
    shipCount: 4,
    status: 'load',
    start() {
        this.status = 'start';
        enemy.addEventListener('click', fire);
    },
    end() {
        this.status = 'end';
        enemy.removeEventListener('click', fire);
    }
};

const play = {
    record: localStorage.getItem('seaBattleRecord') || 0,
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
        this.changeClass(elem, 'hit');
    },
    miss(elem) {
        this.changeClass(elem, 'miss');
    },
    dead(elem) {
        this.changeClass(elem, 'dead');
    },
    changeClass(elem, value) {
        elem.className = value;
    }
};

const fire = (event) => {
    const target = event.target;

    if (target.tagName !== 'TD' || target.classList.length > 0) {
        return false;
    }
    // 
    show.miss(target);
    play.updateData = 'shot';

    for (let i = 0; i < game.ships.length; i++) {
        let currentShip = game.ships[i];
        let index = currentShip.location.indexOf(target.id);

        // proverka na popadanie v korabl
        if (index >= 0) {
            currentShip.hit[index] = 'x';
            show.hit(target);
            play.updateData = 'hit';
            
            // proverka na dead
            if (currentShip.hit.indexOf('') === -1) {
                currentShip.location.forEach((id, index) => {
                    show.dead(document.getElementById(id));
                    currentShip.hit[index] = 'x';
                });
                
                play.updateData = 'dead';
                game.shipCount--;

                // proverka na game end
                if (game.shipCount <= 0) {
                    game.end();
                    headerEl.textContent = "Игра Окончена!";
                    headerEl.style.color = 'red';
                    

                    if (play.shot < play.record || play.record === 0) {
                        localStorage.setItem('seaBattleRecord', play.shot);
                        play.record = play.shot;
                        play.render();
                    }
                }
            }                      
            
            break;
        }
    }
};

const init = () => {
    game.start();
    play.render();

    again.addEventListener('click', (event) => {
        location.reload();
    });
};

init();