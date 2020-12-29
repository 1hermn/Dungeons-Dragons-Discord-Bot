const User = require('../models/user.js')
module.exports = {
name: 'newcharacter',
description: 'Запустить создание персонажа',
args: false,
usage: '',
aliases: ['ncrt','nctr'],
async execute(message, args, Discord, tools) {
var old_step = 0;
var id;
for(;step != false; ){
	if(old_step == 0){
		id = await User.countDocuments()
	}
	var step = await tools.steps(message, args, Discord, tools, old_step, id); 
	message.author.send(`Этап ${old_step} завершён`)
	old_step = step
	
}


}
}