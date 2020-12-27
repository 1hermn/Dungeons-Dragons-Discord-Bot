module.exports = {
		name: 'config',
		description: 'С помощью этой команды вы можете настроить бота',
		args: false,
		usage: '<параметр> <значение>',
		example: 'setprefix ;',
		aliases: ["settings"],
		async execute(message, args, Discord, tools) {
  			var prefix = await tools.getpr(message)
			const data = [];
			const {
				settings
			} = message.client;
			const settingList = new Discord.MessageEmbed()
			if (!args.length) {
				settingList.addField('Настройки: ', settings.map(setting => setting.name).join('\n'), true);
				settingList.addField('Дополнительно', `\nВы также можете отправить \`${prefix}config help [название команды]\` чтобы получить информацию о настройке!`, true);

				return message.author.send(settingList)
					.then(() => {
						if (message.channel.type === 'dm') return;
						message.reply('Информация о командах отправлена вам в ЛС!');
					})
					.catch(error => {
						console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
						message.reply('Похоже, что я не могу отправить сообщение! Может быть вы запретили отправилять личным сообщения?');
					});
			}

			if (args[0] == "help" || args[0] == "h") {
				const name = args[1].toLowerCase();
				const setting = settings.get(name) || settings.find(s => s.aliases && s.aliases.includes(name));

				if (!setting) {
					return message.reply('Это неправильная настройка!');
				}

				settingList.addField(`**Название:**`, `${setting.name}`, true);

				if (setting.aliases) settingList.addField('**Алиасы:**', setting.aliases.join(', '), true);
				if (setting.description) settingList.addField('**Описание:**', setting.description, true);
				if (setting.usage) settingList.addField('**Использование:**', `${prefix}${setting.name} ${setting.usage}`, true);
				if (setting.example) settingList.addField('**Пример:**', `${prefix}config ${setting.name} ${setting.example}`, true);

				message.channel.send(settingList)
			} else {
				if (message.channel.type === 'dm') {
					return message.reply("Невозможно выполненение этой команды вне сервера")
				};
				const settingName = args.shift().toLowerCase();
  				const setting = settings.get(settingName)
        		|| settings.find(s => s.aliases && s.aliases.includes(settingName));
				if (!setting) {
					return message.reply('Это неправильная настройка!');
				}
				if (setting.args && args.length != setting.argsLength) {
					let reply = `Недостаточно аргументов в команде, ${message.author}!`;
					if (setting.usage) {
						reply += `\nПравильное использование: \`${prefix}${setting.name} ${setting.usage}\``;
						reply += `\nПример: \`${prefix}config ${setting.name} ${setting.example}\``
					}
					return message.channel.send(reply);
				} else {
					setting.execute(message, args, Discord, tools);
				}
			}
		}
}