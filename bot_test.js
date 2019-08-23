const Discord = require('discord.js');
const client = new Discord.Client({disableEveryone: true});
const token = 'yourtokenhere';
const config = require("./config_test.json");
const request = require('request');
client.login(token);

client.on('message', (message) => {
var name = message.author.username;

// generates a meme
var Memes = config.Memes;
var generateGrave = function(Memes, callback) {
  request.post({url: config.imgflipCaption, form: Memes}, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var JSONParse = JSON.parse(body);
      callback(null, JSONParse);
    }
    else
      callback(error);
  });
};

// sets the text
function setText(args){
  try {
    Memes.boxes[0].text = message.author.username;
    }
  catch (error) {
    console.log(error);
  }
}

// generates a grave image and returns the url
if (message.content == "grave") {
    Memes.template_id = 39982879;
    setText(name);
    generateGrave(Memes, function(error, data) {
      if (!error && data.success === true)
        message.channel.send(data.data.page_url);
      else if (data.success === false)
        message.channel.send(data.error_message);
      else {
        console.log(error);
      }
    });
    return;
  }
})
