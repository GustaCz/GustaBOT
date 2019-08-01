const Discord = require('discord.js');
const client = new Discord.Client({disableEveryone: true});
const token = 'yourtokenhere';

//user IDs, if you're stupid enough to use my bot, change them to your likings
const GustaID = '290516361120317451'
const CaltropID = '214298654863917059'

const g = new Discord.Attachment('https://i.imgur.com/K4E0vKG.png');
const config = require("./config.json");
const prefix = 'g!'

// STARTUP
client.login(token);
client.on('ready', () => {
    // Set bot status to something
    client.user.setActivity("@me for a list of commands!")
})

// MAIN
client.on('message', (message) => {
    // Prevent bot from responding to its own messages
    if (message.author == client.user) {
        return
    }
    // Checks if the bot is tagged
    if (message.content.includes(client.user.toString())) {
        // Send acknowledgement message
        message.channel.send("Available commands:" + "\n" +
            "g \n" + "g!fetchmeagrave \n" + "g!say <message> \n" + "g!tts <message> \n" +
            "g!convert \n" + "g!units \n" + "g!lewd \n" + "g!shutdown \n")
    }

    // Commands and stuff
    if (message.content == "g") {
        message.channel.send(g)
    }

    var date = new Date();
    if (message.content == "g!fetchmeagrave") {
        message.channel.send("⚰️ Here lies " + message.author.toString() + "\n" + " Time of death: " +
            date.getHours() + " hours " + date.getMinutes() + " minutes (CET)")
        message.react("💀")
    }

    if (message.content == "g!lewd") {
        message.channel.send("no fuck you")
    }

    var msg = message.content;
    if (message.content.startsWith("g!say")) {
        message.channel.send(msg.slice(5))
        message.delete(1)
    }

    var msg = message.content;
    if (message.content.startsWith("g!tts")) {
        message.channel.send(msg.slice(5), {tts: true})
        message.delete(1)
    }

    var convert = require('convert-units')
    if (message.content == ("g!units")) {
        message.author.send("The available units are: \n" + config.units)
        message.channel.send("I have sent a DM with the available units.")
    }

    var arg = message.content.split(" ")
    if (message.content.startsWith("g!convert ")) {
        message.channel.send(parseFloat((convert(arg[3])).from(arg[1]).to(arg[2])).toFixed(arg[4]))
    }
    if (message.content == ("g!convert")) {
        message.channel.send("Usage: g!convert <unit> <target unit> <value> <decimal units>" + "\n" +
            "Example: `g!convert ft cm 1 2` will return 30.48")
    }

    if (message.content == "g!ping") {
        message.channel.send("Latency: " + Math.round(client.ping) + " ms");
    }


})


// ADMIN stuff
function ShutdownCommand(arguments, message) {
    if (message.author.id == GustaID) {
        message.channel.send("I'm going-")
            .then(msg => client.destroy())

    } else {
        message.channel.send("Sorry, only Gusta can do that.")
    }
}

function CaltropEater(arguments, message) {
    if (message.author.id == CaltropID) {
        message.channel.send("HEY GUYS CALTROP HERE", {tts: true})
    } else {
        message.channel.send("Sorry, only Caltrop can do that.")
    }
}

function BanCommand(arguments, message) {
    if (message.content == "g!ban") {
        message.channel.send("Usage: g!ban <mention> <reason>")
    } else if (message.author.id == GustaID) {
        const user = message.mentions.users.first()
        user.send("You have been banned from " + (message.guild.name) + "\n" + "reason: " + message.content.substr(28))
        message.guild.ban(user)
    } else {
        message.channel.send("Sorry, only Gusta can do that.")
    }
}

// eval code fetched from somewhere on the internet
const clean = text => {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

client.on("message", message => {
    if (message.content.startsWith("g!eval")) {
        if (message.author.id !== GustaID) return;
        try {
            const code = message.content.slice(6)
            let evaled = eval(code);
            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
            message.channel.send("The command has been executed successfully!");
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
});

// copied this section from Caltrop lol (https://github.com/CaltropUwU)
client.on('message', (message) => {
    if (message.author == client.user) {
        return
    }
    if (message.content.startsWith("")) {
        processCommand(message)
    }
});

function processCommand(message) {
    let fullCommand = message.content.substr(0) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

    if (primaryCommand == "g!shutdown") {
        ShutdownCommand(arguments, message)
    } else if (primaryCommand == "g!caltrop") {
        CaltropEater(arguments, message)
    } else if (primaryCommand == "g!ban") {
        BanCommand(arguments, message)
    }
};
