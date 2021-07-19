const fetch = require('node-fetch');
const os = require('os');
const { exec } = require("child_process");

// fi, us
const language = {
	fi: 'https://www.pokemon.com/api/pokemontv/v2/channels/fi/',
	us: 'https://www.pokemon.com/api/pokemontv/v2/channels/us/'
};

const baseUrl = language.us; 

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

const {inspect} = require('util')

function insLog(obj, depth=1) {
	console.log(inspect(obj, {depth: depth}));
}

async function getData() {
    try {
        const result = await fetch(baseUrl);
        const data = await result.json();
        //insLog(data);
        //data.forEach(r => insLog(r));
        //insLog(data[7].channel_id);
	const season1 = data[8].media;
        const streamUrl = await season1.map((e,index) => { 
            console.log({ episode: e.episode, title: e.title});
            return {episode : e.episode, stream_url : e.stream_url}
        })

	while(true) {
        	let episode = await readLine("Select the episode to watch");
        	if (episode == "q" || episode == "x") break;
		// console.log(streamUrl[episode-1].stream_url);
        	if (streamUrl.some(a => a.episode == episode)) runVlc(streamUrl[episode-1].stream_url);
			
	}
    } catch (error) {
        console.log('Error : ' + error);
    }
}

getData();
//rl.close();
