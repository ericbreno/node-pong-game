const { registerKeyPressListener } = require('./keyListenerUtil');
const { makeTab } = require('./tab');

const wait = time => new Promise((res) => setTimeout(res, time));

const width = 30,
    height = 15,
    playerSpread = 2;

const tabInstance = makeTab(width, height, playerSpread);
tabInstance.plotItens();

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

const loop = async () => {
    while (true) {
        tabInstance.updateBall();
        tabInstance.printTab();
        await wait(40);
    }
};

loop().catch(console.error);