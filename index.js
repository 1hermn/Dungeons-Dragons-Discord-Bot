const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
client.commands = new Discord.Collection();
client.settings = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const settignFiles = fs.readdirSync('./commands/settings').filter(setting => setting.endsWith('.js'));
const tools = require('./tools/tools.js')
const config = require('./config.json')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/bot_discord_dnd', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', err => {
  console.log('error', err)
})
db.once('open', () => {
  console.log('Подключено к базе данных')
})

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
for (const file of settignFiles) {
  const setting = require(`./commands/settings/${file}`);
  client.settings.set(setting.name, setting);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//после решения всех проблем добавить интеграцию с Circle
//в env или config сохранять конфиги(пока только токен)

client.on('message', async message => {
  var prefix = await tools.getpr(message)
  if(!message.content.startsWith(prefix)) return
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;
  if (command.args && args.length != command.argsLength) {
   let reply = `Недостаточно аргументов в команде, ${message.author}!`;
   if (command.usage) {
     reply += `\nПравильное использование: \`${prefix}${command.name} ${command.usage}\``;
     reply += `\nПример: \`${prefix}${command.name} ${command.example}\``
   }
   return message.channel.send(reply);
  }else {
  command.execute(message, args, Discord, tools);
  if(message.channel.type !== 'dm') message.delete();
}
});

client.login(config.token);