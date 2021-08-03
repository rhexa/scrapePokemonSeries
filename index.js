const fetch = require('node-fetch');
const os = require('os');
const { exec } = require("child_process");

// fi, us
const language = {
    fi: 'https://www.pokemon.com/api/pokemontv/v2/channels/fi/',
    us: 'https://www.pokemon.com/api/pokemontv/v2/channels/us/'
};

const baseUrl = language.fi;

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

const { inspect } = require('util')

function insLog(obj, depth = 1) {
    console.log(inspect(obj, { depth: depth }));
}

async function getData() {
    try {
        const result = await fetch(baseUrl);
        const data = await result.json();
        //insLog(data);
        const seasons = await data.map((r, i) => {
            return { index: i, season_name: r.channel_name, media: r.media}
        });
        
        while (true) {
            seasons.forEach(e => console.log(`${e.index+1}. ${e.season_name}`));
            let selectedSeason = await readLine("Select the season index number:   (q or x to exit)");

            if (selectedSeason == "q" || selectedSeason == "x") process.exit();

            const season = seasons[selectedSeason - 1].media;

            const streamUrl = await season.map((e, index) => {
                console.log({ episode: e.episode, title: e.title });
                return { episode: e.episode, stream_url: e.stream_url }
            })
    
            while (true) {
                let episode = await readLine("Select the episode to watch:  (b to go back, q or x to exit)");
                if (episode == 'b') break;
                if (episode == "q" || episode == "x") process.exit();
                // console.log(streamUrl[episode-1].stream_url);
                if (streamUrl.some(a => a.episode == episode)) runVlc(streamUrl[episode - 1].stream_url);
    
            }
        }
        //insLog(data[7].channel_id);
    } catch (error) {
        console.log('Error : ' + error);
    }
}

getData();
//rl.close();
