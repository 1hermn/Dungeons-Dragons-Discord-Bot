module.exports = {
	name: 'help',
	description: 'Список всех моих команд',
	aliases: ['h', 'cmds'],
	usage: '[название команды]',
	cooldown: 5,
	async execute(message, args, Discord, tools) {
		var prefix = await tools.getpr(message)
		const data = [];
		const { commands } = message.client;
		const help = new Discord.MessageEmbed()
		if (!args.length) {
			help.addField('Команды: ', commands.map(command => command.name).join('\n'), true);
			help.addField('Дополнительно',`\nВы также можете отправить \`${prefix}help [название команды]\` чтобы получить информацию о команде!`, true);

			return message.author.send(help)
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('Информация о командах отправлена вам в ЛС!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('Похоже, что я не могу отправить сообщение! Может быть вы запретили отправилять личным сообщения?');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('Это неправильная команда!');
		}

		help.addField(`**Название:**`, `${command.name}`,true);

		if (command.aliases) help.addField('**Алиасы:**',command.aliases.join(', '),true);
		if (command.description) help.addField('**Описание:**',command.description,true);
		if (command.usage) help.addField('**Использование:**', `${prefix}${command.name} ${command.usage}`,true);
		if (command.example) help.addField('**Пример:**', `${prefix}${command.name} ${command.example}`,true);

		message.channel.send(help)
	}
}