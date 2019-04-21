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
const makeBoard = (_xTab, _yTab, _playerSideSize) => {
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
        /**
         * Clear itens on table, updates the ball to it's next position, increment score (if any player scored), and plot itens on table.
         */
        updateBall() {
            this.clearItens();

            const [shouldHitP1, shouldHitP2] = ballInstance.updateBallPosition(p1x, p2x);
            if (shouldHitP1) score1++;
            if (shouldHitP2) score2++;

            this.plotItens();
        },

        /**
         * Builds the data to be printed on terminal (score and table), and prints it.
         */
        printTab() {
            const scoreStr = `  >> SCORE: ${score1} x ${score2} <<  `;
            const tabStr = tabMatrix.map(line => ` ${line.join('')} `).join('\n');

            print(`\n${scoreStr}\n\n${tabStr}`);
        },

        /**
         * Moves the player 1 in x steps. Positive = move down, negative = move up.
         * Doesn't let the player move past the table limits.
         * 
         * @param {Number} x Steps to move player 1.
         */
        moveP1(x) {
            this.clearItens();
            p1x = Math.min(yTab - 1 - playerSideSize, Math.max(playerSideSize, p1x + x));
            this.plotItens();
        },

        /**
         * Moves the player 2 in x steps. Positive = move down, negative = move up.
         * Doesn't let the player move past the table limits.
         * 
         * @param {Number} x Steps to move player 1.
         */
        moveP2(x) {
            this.clearItens();
            p2x = Math.min(yTab - 1 - playerSideSize, Math.max(playerSideSize, p2x + x));
            this.plotItens();
        },

        /**
         * Plot itens on table.
         * Gets the coordinates and char to plot the ball, plot the center of each player
         * and it's sides.
         * 
         * If any player bounced back the ball in the last 2 updates (checked by hitP1 and hitP2),
         * the tile that bounced back will be plotted differently, for a fancier view.
         * 
         * Note that this method is O(playerSideSize * 2 + 4), roughly O(1), it doesn't 
         * iterates over the entire table.
         * 
         * @param {boolean} clear If truthy, erases all current position of itens on tab.
         *              
         */
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

        /**
         * Calls #plotItens with true flag
         */
        clearItens() {
            this.plotItens(true);
        }
    };
};

module.exports = {
    makeBoard
};