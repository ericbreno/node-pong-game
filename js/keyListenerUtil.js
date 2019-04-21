const readline = require('readline');

const listeners = [];
const registerKeyPressListener = cb => listeners.push(cb);

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