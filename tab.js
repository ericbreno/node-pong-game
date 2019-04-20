const { makeBall } = require('./ball');

/**
 * Constants
 */
const defaultTabChar = ' ',
    p1char = ')',
    p2char = '(',
    p1charCollision = '❚',
    p2charCollision = '❚';

/**
 * Utility
 */
let linesToBack = 0;
const cls = () => { }//process.stdout.write("\x1Bc")
const print = c => {
    process.stdout.moveCursor(0, -linesToBack);
    process.stdout.write(c);
    linesToBack = c.split('\n').length - 1;
};

const spawnList = size => size && [defaultTabChar].concat(spawnList(size - 1)) || [];

/**
 * Tab constructor
 * 
 * @param {Number} _xTab Number of columns
 * @param {Number} _yTab Number of rows
 * @param {Number} _playerSideSize Tiles for each side of player center
 */
const makeTab = (_xTab, _yTab, _playerSideSize) => {
    const xTab = _xTab;
    const yTab = _yTab;
    const playerSideSize = _playerSideSize;

    const tabMatrix = spawnList(yTab).map(() => spawnList(xTab));
    const ballInstance = makeBall(xTab, yTab, playerSideSize);

    let p1x = playerSideSize,
        p2x = playerSideSize;

    let score1 = 0,
        score2 = 0;

    return {
        updateBall() {
            this.clearItens();

            const [shouldHitP1, shouldHitP2] = ballInstance.updateBallPosition(p1x, p2x);
            if (shouldHitP1) score1++;
            if (shouldHitP2) score2++;

            this.plotItens();
        },
        printTab() {
            cls();
            const scoreStr = `${score1} x ${score2}`;
            const tabStr = tabMatrix.map(line => ` ${line.join('')} `).join('\n');

            print(`\n${scoreStr}\n\n${tabStr}`);
        },
        moveP1(x) {
            this.clearItens();
            p1x = Math.min(yTab - 1 - playerSideSize, Math.max(playerSideSize, p1x + x));
            this.plotItens();
        },
        moveP2(x) {
            this.clearItens();
            p2x = Math.min(yTab - 1 - playerSideSize, Math.max(playerSideSize, p2x + x));
            this.plotItens();
        },
        plotItens(clear = false) {
            const [realBallx, realBally, ballChar] = ballInstance.calculateBallFor();
            tabMatrix[realBallx][realBally] = clear ? defaultTabChar : ballChar;

            for (let i = 0; i <= playerSideSize; i++) {
                tabMatrix[p1x - i][0] = clear ? defaultTabChar : p1char;
                tabMatrix[p2x - i][xTab - 1] = clear ? defaultTabChar : p2char;
            }
            for (let i = 1; i <= playerSideSize; i++) {
                tabMatrix[p1x + i][0] = clear ? defaultTabChar : p1char;
                tabMatrix[p2x + i][xTab - 1] = clear ? defaultTabChar : p2char;
            }

            if (ballInstance.hitP1()) {
                tabMatrix[realBallx][0] = clear ? defaultTabChar : p1charCollision;
            }
            if (ballInstance.hitP2()) {
                tabMatrix[realBallx][xTab - 1] = clear ? defaultTabChar : p2charCollision;
            }
        },
        clearItens() {
            this.plotItens(true);
        }
    };
};

module.exports = {
    makeTab
};