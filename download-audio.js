const https = require('https');
const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, 'public', 'audio');
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

// URL of a known valid small MP3 file
const validMp3Url = 'https://raw.githubusercontent.com/anars/blank-audio/master/1-second-of-silence.mp3';

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve());
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { }); // Delete the file async. (But we don't check the result)
            reject(err);
        });
    });
}

(async () => {
    try {
        console.log('Downloading success.mp3...');
        await downloadFile(validMp3Url, path.join(audioDir, 'success.mp3'));
        console.log('Downloading whoosh.mp3...');
        await downloadFile(validMp3Url, path.join(audioDir, 'whoosh.mp3'));
        console.log('Downloads complete.');
    } catch (error) {
        console.error('Error downloading files:', error);
        process.exit(1);
    }
})();
