const readline = require('readline');

/**
 * Simple subscriber for functions to wait on key press actions.
 * @param {Function} cb Callback to be registered to listen on pressing of keys.
 */
const listeners = [];
const registerKeyPressListener = cb => listeners.push(cb);

/**
 * Things needed to activate the listening on pressed keys.
 */
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        // avoid bugging next terminal line view
        console.log();
        process.exit();
    } else {
        listeners.forEach(cb => cb(key));
    }
});

module.exports = { registerKeyPressListener };