const Server = require.main.require('./models/server.js')
module.exports = {
	name: 'prefix',
	description: 'Изменение префикса',
	args: true,
	usage: '<значение>',
	example: ';',
	argsLength: 1,
	async execute(message, args, Discord, tools) {
		console.log(args)
	Server.findOne({id: message.guild.id}, async (err, server) => {
		if(server){
			server.prefix = args[0];
			await server.save()
			message.reply(`Префикс изменён на \`${args[0]}\``)
		}else {
			const server = new Server({id: message.guild.id, prefix: args[0]})
			server.save((err, server) => {
				if (err) {
				console.log('err', err)
				}else {
					message.reply(`Префикс изменён на \`${args[0]}\``)
				}
			})
}
})
}
}