const chs = ['▖', '▗', '▝', '▘', '-'];
const [dl, dr, ur, ul, center] = chs;

const makeBall = (_xTab, _yTab, _playerSideSize) => {
    const xTab = _xTab;
    const yTab = _yTab;
    const playerSideSize = _playerSideSize;

    let ballHorDir = 1,
        ballVerDir = 0,
        ballx = 3,
        bally = 3;

    let hitP1 = 0,
        hitP2 = 0;

    let shift = 1;
    return {
        restart() {
            ballx = Math.floor(yTab / 2);
            bally = Math.floor(xTab / 2);
        },
        checkIfHitTopOrBottom() {
            const [realBallx] = this.calculateBallFor();
            if (realBallx === 0 && ballHorDir != 0)
                ballVerDir = 1;
            if (realBallx === yTab - 1 && ballHorDir != 0)
                ballVerDir = -1;
        },
        // once we are working with a virtual tab 4 times
        // bigger than the actual terminal lines x columns
        // we need to map the virtual coordinates to 
        // real coordinates on the tab size
        calculateBallFor() {
            const isUpper = ballx % 2 === 0;
            const isDown = !isUpper;
            const isLeft = bally % 2 === 0;
            const isRight = !isLeft;

            const bchar = ballVerDir == 0 ? center
                : isUpper && isLeft ? ul
                    : isUpper && isRight ? ur
                        : isDown && isLeft ? dl : dr;

            const realBx = !isUpper ? (ballx - 1) / 2 : ballx / 2;
            const realBy = !isLeft ? (bally - 1) / 2 : bally / 2;
            return [realBx, realBy, bchar];
        },
        changeBallVerticalDirCollision(realBallx, centerOfPlayerToCollide) {
            if (realBallx === centerOfPlayerToCollide) {
                ballVerDir = 0;
            } else if (realBallx < centerOfPlayerToCollide) {
                ballVerDir = -1;
            } else {
                ballVerDir = 1;
            }
        },
        updateBallPosition(p1x, p2x) {
            shift *= -1
            if (ballVerDir != 0 && shift < 0) return [];
            this.checkIfHitTopOrBottom();
            bally += ballHorDir;
            ballx += ballVerDir;
            return this.checkCollisionOrRestart(p1x, p2x);
        },
        checkCollisionOrRestart(p1x, p2x) {
            const [realBallx, realBally] = this.calculateBallFor(ballx, bally);
            const nextMoveIsLimit = (realBally === xTab - 2) || (realBally === 1);
            if (!nextMoveIsLimit) { return []; };

            const shouldHitP1 = ballHorDir < 0;
            const shouldHitP2 = !shouldHitP1;

            const collisionP1 = shouldHitP1
                && (realBallx >= p1x - playerSideSize)
                && (realBallx <= p1x + playerSideSize);
            const collisionP2 = shouldHitP2
                && (realBallx >= p2x - playerSideSize)
                && (realBallx <= p2x + playerSideSize);

            ballHorDir *= -1;
            if (collisionP1 || collisionP2) {
                this.changeBallVerticalDirCollision(realBallx, collisionP1 ? p1x : p2x);
                hitP1 = collisionP1 && 1;
                hitP2 = collisionP2 && 1;
                return [];
            }
            ballVerDir = 0;

            this.restart();
            return [shouldHitP1, shouldHitP2];
        },
        hitP1() {
            const _hitP1 = hitP1 && hitP1++;
            if (hitP1 > 1)
                hitP1 = false;
            return _hitP1;
        },
        hitP2() {
            const _hitP2 = hitP2 && hitP2++;
            if (hitP2 > 1)
                hitP2 = false;
            return _hitP2;
        }
    };
};

module.exports = {
    makeBall
};