const User = require('../models/user.js')
module.exports = {
	name: 'get',
	description: 'получить персонажа по id',
	args: true,
	usage: '<имя>',
	example: '0',
	argsLength: 1,
	async execute(message, args, Discord, tools) {
	id = args[0] 
    
	User.findOne({id: id, user: message.author.id}, (err, user) => {
		console.log(user)
	})
}
}