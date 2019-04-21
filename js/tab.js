const { tab } = require('../constants.json');
const { makeBall } = require('./ball');

/**
 * Constants
 */
const defaultCharTab = tab.defaultCharTab,
    player1Char = tab.player1Char,
    player2Char = tab.player2Char,
    player1CharCollision = tab.player1CharCollision,
    player2CharCollision = tab.player2CharCollision;

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

const spawnList = size => size && [defaultCharTab].concat(spawnList(size - 1)) || [];

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
            const scoreStr = `SCORE: ${score1} x ${score2}`;
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
            const [realBallx, realBally, ballChar] = ballInstance.calculateRealCoordinates();
            tabMatrix[realBallx][realBally] = clear ? defaultCharTab : ballChar;

            for (let i = 0; i <= playerSideSize; i++) {
                tabMatrix[p1x - i][0] = clear ? defaultCharTab : player1Char;
                tabMatrix[p2x - i][xTab - 1] = clear ? defaultCharTab : player2Char;
            }
            for (let i = 1; i <= playerSideSize; i++) {
                tabMatrix[p1x + i][0] = clear ? defaultCharTab : player1Char;
                tabMatrix[p2x + i][xTab - 1] = clear ? defaultCharTab : player2Char;
            }

            if (ballInstance.hitP1()) {
                tabMatrix[realBallx][0] = clear ? defaultCharTab : player1CharCollision;
            }
            if (ballInstance.hitP2()) {
                tabMatrix[realBallx][xTab - 1] = clear ? defaultCharTab : player2CharCollision;
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