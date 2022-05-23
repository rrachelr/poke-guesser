const { Client, DiscordAPIError } = require('discord.js');
const { token, apikey } = require('./config.json');

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const gen1 = [0, 151];
const gen2 = [152, 251];
const gen3 = [252, 386];
const gen4 = [387, 493];
const gen5 = [494, 649];
const gen6 = [650, 721];
const gen7 = [722, 809];
const gen8 = [810, 905];
const genList = [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8];

var pokemon;
var gen;

async function get_pokemon(gen){
    const min = gen[0];
    const max = gen[1];
    try {
        let res = await fetch("https://pokeapi.co/api/v2/pokemon/" + String(Math.floor(Math.random() * (max - min) + min)) + "/");
        let data = await res.json();
        return data;
    } catch(err) {
        message.channel.send("Could not get Pokemon.");
        console.log(err);
    } 
} 

client.once('ready', () => {
    console.log('Logged in!');
});

client.on('messageCreate', async message => {
    if (message.content.startsWith('!start')) {
        hint = 0;
        if (message.content.includes('gen')) {
            gen = genList[message.content.charAt(message.content.length - 1) - 1];
        } else {
            gen = gen1;
        }
        pokemon = await get_pokemon(gen);
        try {
            try {
                message.channel.send("This Pokemon has the types " + pokemon.types[0].type.name + " and " + pokemon.types[1].type.name + ".");
            } catch(err) {
                message.channel.send("This Pokemon has the type " + pokemon.types[0].type.name + ".");
            }
            message.channel.send("To guess a pokemon, use the command !guess");  
        } catch(err) {
            message.channel.send("Unable to start round.")
            console.log(err);
        }
    }
    switch (message.content) {
        case '!help':
            message.channel.send('Commands:\n **!start** *gen(1-8*: start new game, generation can be specified or else gen 1 is chosen automatically\n **!hint**: provides a hint for current roung (up to 4 hints)\n **!guess** *pokemon*: checks if your answer is correct\n **!giveup**: ends round and gives answer');
            break;
        case '!hint':
            try {
                switch (hint) {
                    case 0:
                        message.channel.send("The Pokemon's id number is " + String(pokemon.id));
                        hint++;
                        break;
                    case 1:
                        message.channel.send("The Pokemon's height and weight are: " + String(pokemon.height) + ", " + String(pokemon.weight));
                        hint++;
                        break;
                    case 2:
                        message.channel.send("The Pokemon's name starts with: " + pokemon.name[0]);
                        hint++;
                        break;
                    case 3:
                        message.channel.send("The Pokemon's name is " + String(pokemon.name.length) + " letters long.");
                        hint++;
                        break;
                    default:
                        message.channel.send("You are out of hints. To give up, use command !giveup");
                        break;
                }
        } catch(err) {
            message.channel.send("Unable to provide hint. Have you started a round using !start?");
            console.log(err);
        }
        break;
        case '!giveup':
            try {
                message.channel.send("The pokemon was " + pokemon.name + ". To play again, type !start");
            } catch(err) {
                message.channel.send("Unable to give up. Have you started a round using !start?");
                console.log(err);
            }
            break;
    }
    if (message.content.startsWith('!guess')) {
        try {
            if (message.content.toLowerCase().includes(pokemon.name)) {
                message.channel.send("Your guess is correct! The Pokemon was " + pokemon.name + "! To play again, use command !start");
                let res = await fetch("https://g.tenor.com/v1/search?q=" + pokemon.name + "&key=" + apikey + "&limit=" + 1);
                let data = await res.json();
                message.channel.send(data.results[0].media[0].tinygif.url);
            } else {
                message.channel.send("Try again. <:psyduck:965072281711828992>");
            }
        } catch(err) {
            message.channel.send("Unable to read guess. Have you started a round using !start?");
        }
    }
});

client.login(token);