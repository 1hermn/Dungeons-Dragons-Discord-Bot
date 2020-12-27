module.exports = {
	name: 'roll',
	description: 'Симуляция броска кубика',
	args: true,
	usage: '<число бросков> <количество граней>',
	example: '2 20',
	argsLength: 2,
	aliases: ['r', 'rl'],
	execute(message, args, Discord, tools){
	n = args[0] 
  	d = args[1]
    message.channel.send("Генерирую..")
    const rolls = new Discord.MessageEmbed()
    	rolls.setColor('ff2400')
    for(i = 1; i <= n; i++){
    	rolls.addField(`Ролл #${i}`, tools.random(1, d), true)
    }
    message.channel.send(rolls)

	}
}