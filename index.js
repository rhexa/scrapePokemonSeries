const fetch = require('node-fetch');
const os = require('os');
const { exec } = require("child_process");

// fi, us
const language = 'fi';

const baseUrl = `https://www.pokemon.com/api/pokemontv/v2/channels/${language}/`;

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function readLine(text) {
    return new Promise(resolve => {
        rl.question(text + "\n", resolve);
    })
}

function runVlc(url) {
    if (os.platform() === 'win32') {
        const path = '"C:\\Program Files\\VideoLAN\\VLC'
        exec(`${path}\\vlc.exe" ${url}`, (err, stdout, stderr) => {
            if (err) return console.log(err);
            if (stderr) return console.log(stderr);
            return console.log(stdout);
        })
        return;
    }

    exec(`vlc ${url}`, (err, stdout, stderr) => {
        if (err) return console.log(err);
        if (stderr) return console.log(stderr);
        return console.log(stdout);
    })
}

async function getData() {
    try {
        const result = await fetch(baseUrl);
        const data = await result.json();
        const season1 = await data[8].media;
        const streamUrl = await season1.map((e,index) => { 
            console.log({ episode: e.episode, title: e.title});
            return {episode : e.episode, stream_url : e.stream_url}
        })
        let episode = await readLine("Select the episode to watch");
        // console.log(streamUrl[episode-1].stream_url);
        runVlc(streamUrl[episode-1].stream_url);
    } catch (error) {
        console.log('Error : ' + error);
    }
}

getData();
rl.close();