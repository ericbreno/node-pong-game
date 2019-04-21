const { registerKeyPressListener } = require('./keyListenerUtil');
const { makeBoard } = require('./board');
const { game } = require('../constants.json');

/**
 * Constants;
 */
const width = game.width,
    height = game.height,
    playerSpread = game.playerSideSize,
    // in ms. 33 = ~30 refresh per second (fps)
    REFRESH_RATE = 33;

/**
 * Utility
 */
const wait = time => new Promise((res) => setTimeout(res, time));

/**
 * Tab
 */
const tabInstance = makeBoard(width, height, playerSpread);
tabInstance.plotItens();

/**
 * Controller
 */
registerKeyPressListener(({ name }) => {
    switch (name) {
        case 'up':
            p1x = tabInstance.moveP2(-1);
            break;
        case 'down':
            p1x = tabInstance.moveP2(1);
            break;
        case 'z':
            p2x = tabInstance.moveP1(1);
            break;
        case 'a':
            p2x = tabInstance.moveP1(-1);
            break;
    }
});

/**
 * RunLoop
 */
const loop = async () => {
    while (true) {
        tabInstance.updateBall();
        tabInstance.printTab();
        await wait(REFRESH_RATE);
    }
};

module.exports = {
    loop
};