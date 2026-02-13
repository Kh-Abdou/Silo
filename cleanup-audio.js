const fs = require('fs');
const path = require('path');
fs.unlinkSync(path.join(__dirname, 'download-audio.js'));
console.log('Cleanup complete.');
