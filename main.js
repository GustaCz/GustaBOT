const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
const token = '';

const GustaID = '290516361120317451'
const config = require("./config.json");

// STARTUP
client.login(token);
client.on('ready', () => 
	{client.user.setActivity("@me for a list of commands!")})

// MAIN
client.on('message', (message) => {
	if (message.author == client.user) {
		return
	}
	
	if (message.mentions.has(client.user.id)) {
		message.channel.send({ embed: {"title":"**Available Commands**","description":"These are the available commands:",
		"author":{"name":"Gusta Bot Version 0.1.1","url":"https://github.com/GustaCz/GustaBOT"},"color":16744448,
		"thumbnail":{"url":"https://cdn.discordapp.com/avatars/560502056821981195/3724f266834ef9cadf830939b8e6afe5.png"},
		"fields":[{"name":"g!fetchmeagrave","value":"fetches you a grave 💀","inline":true},
		{"name":"g!convert","value":"converts units","inline":true},
		{"name":"g!units","value":"sends you a DM with available units","inline":true},
		{"name":"Admin only:","value":"** **g!purge \n g!ban","inline":false}
		]} })
	}

	// Commands and stuff

	var date = new Date();
	if (message.content == "g!fetchmeagrave") {
		message.channel.send("⚰️ Here lies " + message.author.toString() + "\n" +
	    "Time of death: " + date.getHours() + ":" + date.getMinutes() + " (server time)")
		message.react("💀")
	}

	if (message.content == "bruh") {
		message.channel.send("🗿")
	}

	var msg = message.content;
	if (message.content.startsWith("g!say")) {
		message.channel.send(msg.slice(5))
		message.delete({ timeout: 1 })
	}

	if (message.content.startsWith("g!tts")) {
		message.channel.send(msg.slice(5), { tts: true })
		message.delete({ timeout: 1 })
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
		message.channel.send("Latency: " + Math.abs((Date.now() - message.createdTimestamp)) + " ms");
	}
	
	const args = message.content.split(' ').slice(1);
	const amount = args.join(' ');

	if (message.content.startsWith("g!purge")) {
		if (message.member.roles.cache.has('531583734592438285') || message.author.id == GustaID) { 
			message.channel.messages.fetch({limit: amount}).then(messages => {message.channel.bulkDelete(messages)});
		} else {
        message.channel.send("Sorry, only Mods can do that.")
		}
	}
	
})

// advanced
function ShutdownCommand(arguments, message) {
	if (message.author.id == GustaID) {
		message.channel.send("I'm going-")
			.then(msg => client.destroy())

	} else {
		message.channel.send("Sorry, only Gusta can do that.")
	}
}

function BanCommand(arguments, message) {
	if (message.content == "g!ban") {
		message.channel.send("Usage: g!ban <mention> <reason>")
	} else if (message.member.roles.cache.has('531583734592438285') || message.author.id == GustaID) {
		const user = message.guild.members.cache.get(message.mentions.users.first().id)
		user.send("You have been banned from " + (message.guild.name) + "\n" + "reason: " + message.content.substr(28))
		user.ban(user)
	} else {
		message.channel.send("Sorry, only Mods can do that.")
	}
}

// eval
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


client.on('message', (message) => {
	if (message.author == client.user) {
		return
	}
	if (message.content.startsWith("")) {
		processCommand(message)
	}
});

function processCommand(message) {
	let fullCommand = message.content.substr(0)
	let splitCommand = fullCommand.split(" ")
	let primaryCommand = splitCommand[0]
	let arguments = splitCommand.slice(1)

	if (primaryCommand == "g!shutdown") {
		ShutdownCommand(arguments, message)
	} else if (primaryCommand == "g!ban") {
		BanCommand(arguments, message)
	}
};
