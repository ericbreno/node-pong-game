const { ball } = require('../constants.json');
const [dl, dr, ur, ul, center] =
    [ball.downLeft, ball.downRight, ball.upRight, ball.upLeft, ball.center];

const makeBall = (_xTab, _yTab, _playerSideSize) => {
    const xTab = _xTab;
    const yTab = _yTab;
    const playerSideSize = _playerSideSize;

    let ballHorDir = 1,
        ballVerticalDirection = 0,
        ballx = 3,
        bally = 3;

    let hitP1 = 0,
        hitP2 = 0;

    let shift = 1;
    return {
        /**
         * Resets the ball for the middle of table.
         */
        restart() {
            ballx = Math.floor(yTab / 2);
            bally = Math.floor(xTab / 2);
        },

        /**
         * Checks if the ball is on first or last row and is going up
         * or down, and changes it's vertical direction if so.
         * 
         * Updates #ballVerticalDirection
         * @private
         */
        _changeVerticalDirectionIfOnLimit() {
            const [realBallx] = this.calculateRealCoordinates();
            if (ballVerticalDirection != 0) {
                if (realBallx === 0)
                    ballVerticalDirection = 1;
                if (realBallx === yTab - 1)
                    ballVerticalDirection = -1;
            }
        },

        /**
         * Gets ball coordinates on table and the char to the ball.
         * 
         * once we are working with a virtual tab 4 times
         * bigger than the actual terminal lines x columns
         * we need to map the virtual coordinates to
         * real coordinates on the tab size
         * 
         * @returns {[Number, Number, String]} Ball x, y, and symbol.
         */
        calculateRealCoordinates() {
            const isUpper = ballx % 2 === 0;
            const isDown = !isUpper;
            const isLeft = bally % 2 === 0;
            const isRight = !isLeft;

            const bchar = ballVerticalDirection == 0 ? center
                : isUpper && isLeft ? ul
                    : isUpper && isRight ? ur
                        : isDown && isLeft ? dl : dr;

            const realBx = !isUpper ? (ballx - 1) / 2 : ballx / 2;
            const realBy = !isLeft ? (bally - 1) / 2 : bally / 2;
            return [realBx, realBy, bchar];
        },

        /**
         * Checks if the ball has hit a player, and if it needs to change the vertical
         * direction to start going up, down, or straight horizontally.
         * 
         * updates #ballVerticalDirection
         * 
         * @param {Number} realBallx
         * @param {Number} centerOfPlayerToCollide
         * @private
         */
        _changeBallVerticalDirectionOnCollision(realBallx, centerOfPlayerToCollide) {
            if (realBallx === centerOfPlayerToCollide) {
                ballVerticalDirection = 0;
            } else if (realBallx < centerOfPlayerToCollide) {
                ballVerticalDirection = -1;
            } else {
                ballVerticalDirection = 1;
            }
        },

        /**
         * Update the ball to it's next position, making all needed verifications, and returns if 
         * it collisioned with any player.
         * 
         * Obs: If the ball is travelling only horizontally, it's velocity is 1 (current framerate). 
         * If the ball is going diagonally, it's velocity is 1/2. 
         * I addded this because when the ball is travelling horizontally we have one-step-at-time, 
         * it goes one "step" aside on each update, and when it's going diagonally it goes two steps
         * each update (left-top eg.), and feels like it's going at 2x speed than horizontally.
         * 
         * This is controlled by the variable #shift, which changes it's value to -shift on each
         * update, and when the #ballVerticalDirection is not zero, only when shift is lesser than
         * zero that it actually moves the ball.
         * 
         * @param {Number} p1x Center of player 1. The center is used with #playerSideSize to calculate if the ball hit any player.
         * @param {Number} p2x Center of player 2. The center is used with #playerSideSize to calculate if the ball hit any player.
         * @returns {[Boolean, Boolean]} An array indicating if a collision ocurred with player one or two.
         */
        updateBallPosition(p1x, p2x) {
            shift *= -1
            if (ballVerticalDirection != 0 && shift < 0) return [false, false];
            this._changeVerticalDirectionIfOnLimit();
            bally += ballHorDir;
            ballx += ballVerticalDirection;
            return this._handleCollisionAndRestart(p1x, p2x);
        },

        /**
         * Checks if the ball has hit any wall (top or bottom) to change it's vertical direction,
         * checks if any player was hit, bouncing back the ball on it's expected angle, and
         * otherwise resets the ball and returns which player scored.
         * 
         * @param {Number} p1x Center of player 1. The center is used with #playerSideSize to calculate if the ball hit any player.
         * @param {Number} p2x Center of player 2. The center is used with #playerSideSize to calculate if the ball hit any player.
         * @returns {[Boolean, Boolean]} An array indicating if a collision ocurred with player one or two.
         */
        _handleCollisionAndRestart(p1x, p2x) {
            const [realBallx, realBally] = this.calculateRealCoordinates(ballx, bally);
            const nextMoveIsLimit = (realBally === xTab - 2) || (realBally === 1);
            if (!nextMoveIsLimit) { return [false, false]; };

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
                this._changeBallVerticalDirectionOnCollision(realBallx, collisionP1 ? p1x : p2x);
                hitP1 = collisionP1 && 1;
                hitP2 = collisionP2 && 1;
                return [];
            }
            ballVerticalDirection = 0;

            this.restart();
            return [shouldHitP1, shouldHitP2];
        },

        /**
         * Returns if player one bounced back the ball on one of the last 2 updates.
         */
        hitP1() {
            const _hitP1 = hitP1 && hitP1++;
            if (hitP1 > 1)
                hitP1 = false;
            return _hitP1;
        },

        /**
         * Returns if player two bounced back the ball on one of the last 2 updates.
         */
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