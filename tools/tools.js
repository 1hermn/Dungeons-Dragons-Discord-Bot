const User = require('../models/user.js')
const Server = require('../models/server.js')
var _ = require('lodash')

//изменение префикса для бота
var getPrefix = async function (message) {
	if (message.channel.type === 'dm') {
		return "."
	}
	var server = await Server.findOne({
		id: message.guild.id
	})
	if (server != null) {
		var prefix = server.prefix
		if (prefix != undefined) {
			return prefix
		} else {
			return "."
		}
	} else {
		const server = new Server({id: message.guild.id, prefix: '.'})
			server.save((err, server) => {
				if (err) {
				console.log('err', err)
				}
			})
		return "."
	}

}

var getRandomIntInclusive = function (min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}


//фукнция вопросов и ответов
var question = async function (q, message, answers, time) {
	//answers - фильтр ответов.
	//разделить на функции сохранение и выбор.
	//позже использовать эту функцию для тестирования
	let msg = await message.author.send(q)
		.then(async() => {
			if (message.channel.type !== 'dm') {
				id = await message.reply('Создание прерсонажа запущено!Сообщение отправно вам в лс!');
				id.delete()
			}
		})
		.catch(error => {
			console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
			message.reply('Похоже, что я не могу отправить сообщение! Может быть вы запретили отправилять личным сообщения?');
		});
	let ans = await message.author.dmChannel.awaitMessages(response => message.author.bot != true, {
			max: 1,
			time: time,
			errors: ['time']
		})
		.catch(err => {
			message.author.send('Время ожидания истекло. Повторить? `h continue`')
		})
	await message.author.send(`Вы ввели: ${ans.first().content}.\nСохранить? [y/n]`)
	try {
	var confirm = await message.author.dmChannel.awaitMessages(response => message.author.bot != true, {
			max: 1,
			time: time,
			errors: ['time']
		})
	if(confirm.first().content.toLowerCase() != 'y' && confirm.first().content.toLowerCase() != 'n'){
		message.author.send("Вы ввели неправильно, перезапускаю")
		let ret = await question(q, message, answers, time)	
		return ret
	}
	}catch(err) {
		message.author.send('Время ожидания истекло. Сохраняю')
		return ans.first().content;
	}

	switch (confirm.first().content.toLowerCase()) {
		case 'y': {
				message.author.send("Сохраняю..")
				return ans.first().content
			}
			break
		case 'n': {
			message.author.send("Отменяю")
			let ret = await question(q, message, answers, time)	
			return ret
			break
		}
		default:
			message.author.send("Вы ввели неправильно. Отменяю")
	}

}


//добавление базу
var addToDb = async function (args, Schem, is_new, step, id) {
	//args - JSON
	if(is_new){
	var schema = new Schem(args)
	schema.save((err, sc) => {
		if (err) {
			console.log('err', err)
		}
	})
	let ret = `Сохранено, запомните или запишите id(${args.id}) персонажа, чтобы в случае чего его редактировать` 
		return ret
	}else {
		let schema = await Schem.findOne({id: id})
		schema = await jsonConcat(schema, args)
		schema.step = step
		await schema.save()
		let ret = `Сохранено`
		return ret
	}

}

//2 json в один
var jsonConcat = function(o1, o2) {
 var result = _.merge(o1, o2)
 return result;
}

//герация персонажа
var steps = async function (message, args, Discord, tools, step, id) {
	//первый этап - это не имя, переделать, когда буду всё добавлять
	
	if (step == 0) {
		let q = "Этап 0. Введите имя" //в будущем сделать массив с вопросами
		let answers = []
		let time = 15 * 1000
		let ans = await question(q, message, answers, time)	
		let args = {
			name: ans,
			id: id,
			user: message.author.id,
			step: 0
	}
	let answer = await addToDb(args, User, true)
	await message.channel.send(answer)
	return 1
	}
	if(step == 1){
		let q = `Этап 1. Выберите рассу(отправьте цифру)
		\`\n1. Дварф
		\n2.Эльф
		\n3.Полурослик
		\n4.Человек
		\n5.Драконорождённый
		\n6.Гном
		\n7.Полуэльф
		\n8.Полуорк
		\n9.Тифлинг\``
		let answers = []
		let time = 15 * 1000
		let race = await question(q, message, answers, time)
		let raceArr = ["",
		"Дварф",
		"Эльф",
		"Полурослик",
		"Человек",
		"Драконорождённый",
		"Гном",
		"Полуэльф",
		"Полуорк",
		"Тифлинг"]	
		if(race == 1){
			let subraceArr = ["","Горный Дварф","Холмовой Дварф"]
			q = `Этап 1.1. Выберите подрассу(отправьте цифру)
			\`\n1.Горный Дварф
			\n2.Холмовой Дварф\``
			let subrace = await question(q, message, answers, time)
			if(subrace == 1){
				race = subraceArr[subrace]
				//указывать все значения в футах
				let db_args = {
					characters: {
						bonus: {
							force: 2,
							physique: 2
						},
					},
					person :{
						race: `${subraceArr[subrace]}`,
						langs: ["Общий","Дварфский"],
						speed: 25,
						specs: {
							wheight: 150,
							spec: ["Тёмное зрение","Дварфская устойчивость","Дварфская боевая тренировка", "Знание камня"],
							pos: ["Владение доспехами дварфов"]
						},

					},
				}
				let answer = await addToDb(db_args, User, false, step, id)
				await message.channel.send(answer)
			
			}
			if(subrace == 2){
				let db_args = {
					characters: {
						bonus: {
							force: 2,
							wisdom: 1
						},
					},
					person :{
						race: `${subraceArr[subrace]}`,
						langs: ["Общий","Дварфский"],
						speed: 25,
						specs: {
							wheight: 150,
							spec: ["Тёмное зрение","Дварфская устойчивость","Дварфская боевая тренировка", "Знание камня","Дварфская выдержка"]
						},

					},
				}
				let answer = await addToDb(db_args, User, false, step, id)
				await message.channel.send(answer)
			} 
		}
		if(race == 2){
			let subraceArr = ["","Высший Эльф","Лесной Эльф","Тёмный Эльф"]
			q = `Этап 1.1. Выберите подрассу(отправьте цифру)
			\`\n1. Высший Эльф
			\n2. Лесной Эльф
			\n3. Тёмный Эльф\``
			let subrace = await question(q, message, answers, time)
			if(subrace == 1){
				let db_args = {
					characters: {
						bonus: {
							agility: 2,
							intellect: 1
						},
					},
					person :{
						race: `${subraceArr[subrace]}`,
						langs: ["Общий","Эльфийский"],
						speed: 30,
						specs: {
							spec: ["Тёмное зрение","Обострённые чувства","Наследие фей", "Транс","Дварфская выдержка"],
							pos: ["Длинный меч","Короткий меч","Длинный лук","Короткий лук"]
							//ВОПРОС.заговоры когда выбираюься
						},

					},
				}
				let answer = await addToDb(db_args, User, false, step, id)
				await message.channel.send(answer)
			}
			if(subrace == 2){
				let db_args = {
					characters: {
						bonus: {
							agility: 2,
							wisdom: 1
						},
					},
					person :{
						race: `${subraceArr[subrace]}`,
						langs: ["Общий","Эльфийский"],
						speed: 35,
						specs: {
							spec: ["Тёмное зрение","Обострённые чувства","Наследие фей", "Транс","Дварфская выдержка", "Маскировка в дикой местности"],
							pos: ["Длинный меч","Короткий меч","Длинный лук","Короткий лук"]
						},

					},
				}
				let answer = await addToDb(db_args, User, false, step, id)
				await message.channel.send(answer)
			} 
			if(subrace == 3){
				let db_args = {
					characters: {
						bonus: {
							agility: 2,
							charisma: 1
						},
					},
					person :{
						race: `${subraceArr[subrace]}`,
						langs: ["Общий","Эльфийский"],
						speed: 30,
						specs: {
							spec: ["Превосходное тёмное зрение","Обострённые чувства","Наследие фей", "Транс","Дварфская выдержка","Чувствительность к солнцу"],
							pos: ["Рапира","Короткий меч","Ручной арбалет"],
							spells: ["Пляшущие огоньки"]
							//ВОПРОС. Что с уровнем
						},

					},
				}
				let answer = await addToDb(db_args, User, false, step, id)
				await message.channel.send(answer)
		}
	}
		if(race == 3){
			q = `Этап 1.1 Выберите подрассу(отправьте цифру)
			\`\n1.Коренастый Полурослик
			\n2.Легконогий Полурослик\``
			let subraceArr = ["","Коренастый Полурослик","Легконогий Полурослик"]
			let subrace = await question(q, message, answers, time)
			if(subrace == 1){
				let db_args = {
					characters: {
						bonus: {
							agility: 2,
							physique: 1
						},
					},
					person :{
						race: `${subraceArr[subrace]}`,
						langs: ["Общий","язык Полуросликов"],
						speed: 25,
						specs: {
							wheight: 40,
							spec: ["Везёчий","Храбрый","Проворство полуросликов","Устойчивость коренастых"]
						},

					},
				}
				let answer = await addToDb(db_args, User, false, step, id)
				await message.channel.send(answer)
			}
			if(subrace == 2){
				let db_args = {
					characters: {
						bonus: {
							agility: 2,
							charisma: 1
						}
					},
					person :{
						race: `${subraceArr[subrace]}`,
						langs: ["Общий","язык Полуросликов"],
						speed: 25,
						specs: {
							wheight: 40,
							spec: ["Везёчий","Храбрый","Проворство полуросликов", "Естественная скрытность"]
						},

					},
				}
				let answer = await addToDb(db_args, User, false, step, id)
				await message.channel.send(answer)
			}

		}
		if(race == 6){
			q = `Этап 1.1 Выберите подрассу(отправьте цифру)
			\`\n1.Скальный гном 
			\n2.Лесной гном\``
			let subraceArr = ["","Скальный гном","Лесной гном"]
			let subrace = await question(q, message, answers, time)
			//console.log(subrace)
			if(subrace == 1){
				let db_args = {
					characters: {
						bonus: {
							intellect: 2,
							physique: 1
						},
					},
					person :{
						race: `${subraceArr[subrace]}`,
						langs: ["Общий","Гномий"],
						speed: 25,
						specs: {
							wheight: 40,
							spec: ["Тёмное зрение","Гномья хитрость", "Ремесленные знания","Жестянщик"]
						},

					},
				}
				let answer = await addToDb(db_args, User, false, step, id)
				await message.channel.send(answer)
			}
			if(subrace == 2){
				let db_args = {
					characters: {
						bonus: {
							intellect: 2,
							agility: 1
						},
					},
					person :{
						race: `${subraceArr[subrace]}`,
						langs: ["Общий","Гномий"],
						speed: 25,
						specs: {
							wheight: 40,
							spec: ["Тёмное зрение","Гномья хитрость", "Природная иллюзия", "Общение с маленькими зверями"]
						},

					},
				}
				let answer = await addToDb(db_args, User, false, step, id)
				await message.channel.send(answer)
			}
		}
		if(race == 4){
			//4.Человек
			let db_args = {
					characters: {
						bonus: {
							force: 1,
					  		physique: 1,
					  		agility: 1,
					  		intellect: 1,
					  		wisdom: 1,
					  		charisma: 1
						},
					},
					person :{
						race: `${raceArr[race]}`,
						langs: ["Общий"],
						speed: 30,
						specs: {
							wheight: 0,
							spec: ["0"]
						},

					},
				}
				let answer = await addToDb(db_args, User, false, step, id)
				await message.channel.send(answer)
		}
		if(race == 5){
			//5.Драконорождённый
			let db_args = {
					characters: {
						bonus: {
							force: 2,
							charisma: 1
						},
					},
					person :{
						race: `${raceArr[race]}`,
						langs: ["Общий","Драконий"],
						speed: 30,
						specs: {
							wheight: 250,
							spec: ["Оружие дыхания","Сопротивление урону"]
						},

					},
				}
				let answer = await addToDb(db_args, User, false, step, id)
				await message.channel.send(answer)
		}
		if(race == 7){
			//7.Полуэльф
			let db_args = {
					characters: {
						bonus: {
							charisma: 2
						},
					},
					person :{
						race: `${raceArr[race]}`,
						langs: ["Общий","Эльфийский"],
						speed: 30,
						specs: {
							wheight: 0,
							spec: ["Тёмное зрение","Наследие фей","Универсальность навыков"]
						},

					},
				}
				let answer = await addToDb(db_args, User, false, step, id)
				await message.channel.send(answer)
		}
		if(race == 9) {
			//9.Тифлинг
			let db_args = {
					characters: {
						bonus: {
							intellect:1,
							charisma: 2
						},
					},
					person :{
						race: `${raceArr[race]}`,
						langs: ["Общий","Инфернальный"],
						speed: 30,
						specs: {
							wheight: 0,
							spec: ["Тёмное зрение","Адское сопротивление","Дьявольское наследие"],
							spells: ["чудотворство"]

					},
				}
			}
			//добавление характеристик(4.5.7.9)
			let answer = await addToDb(db_args, User, false, step, id)
			await message.channel.send(answer)
		}
		return 2
	}
	if(step == 2){
			let user = await User.findOne({id: id})
			let race = user.person.race
			let race_when_subrace = user.person.race.split(" ")[1];
			let subrace_when_subrace = user.person.race.split(" ")[0];
			if(race_when_subrace == "Дварф"){
				let q = "Выберете инструменты:\n```1.Инструменты кузнеца\n2.Инструменты пивовара\n3.Инструменты каменьщика```"
				let answers = []
				let time = 15 * 1000
				let ans = await question(q, message, answers, time)
				let q_arr = ["Инструменты кузнеца","Инструменты пивовара","Инструменты каменьщика"]
				console.log(q_arr[ans - 1])

			}
			if(subrace_when_subrace == "Высший Эльф"){
				let q = "Выберете инструменты:\n```1.Дварфский язык\n2.Драконий```"
				let answers = []
				let time = 15 * 1000
				let ans = await question(q, message, answers, time)
				let q_arr = ["Дварфский язык","Драконий"]
				console.log(q_arr[ans - 1])
			}
			if(race == "Драконорождённый"){
				let q = "Выберите тип дракона\n"
				let answers = []
				let time = 60 * 1000
				let ans = await question(q, message, answers, time)
				let q_arr = ["Белый","Бронзовый","Зелёный","Золотой","Красный","Латунный","Медный","Серебрянный","Синий","Чёрный"]
				console.log(q_arr[ans - 1])
			}
			if(race == "Человек"){
				let q = "Выберете инструменты:\n```1.Инструменты кузнеца\n2.Инструменты пивовара\n3.Инструменты каменьщика```"
				let answers = []
				let time = 15 * 1000
				let ans = await question(q, message, answers, time)
				let q_arr = ["Инструменты кузнеца","Инструменты пивовара","Инструменты каменьщика"]
				console.log(q_arr[ans - 1])
			}
			if(race == "Полуэльф"){
				let q = "Выберете инструменты:\n```1.Инструменты кузнеца\n2.Инструменты пивовара\n3.Инструменты каменьщика```"
				let answers = []
				let time = 15 * 1000
				let ans = await question(q, message, answers, time)
				let q_arr = ["Инструменты кузнеца","Инструменты пивовара","Инструменты каменьщика"]
				console.log(q_arr[ans - 1])
			}

		/*
		Дварф {
			на выбор: инструменты кузнеца, пивовара, каменьщика
		}
		Высший Эльф {
			+1 язык на выбор
		}
		Дракон {
			Наследие драконов. Вы получаете драконье
			наследие. Выберите тип дракона из таблицы
			«Наследие драконов». Вы получаете оружие дыха-
			ния и сопротивление к урону соответствующего
			вида, как указано в таблице.(в книге стр 35)
		}
		Человек {
	+1 язык на выбор
		}
		Полуэльф {
			увеличение 2-х характеристик на выбор на 1
			+2 навыка
			+1 язык
		}
		*/
		//Добавлять особенности, которые выбираются
		//а также добавлять всё, что выбирается после выбора рассы
		return false

	}
	if(step == 3){
		/*Классы

		Бард {
			ХИТЫ
			Кость Хитов: 1к12 за каждый уровень варвара
			Хиты на 1 уровне: 12 + модификатор Телосложения
			Хиты на следующих уровнях: 1к12 (или 7) + модифи-
			катор Телосложения за каждый уровень вар-
			вара после первого

			ВЛАДЕНИЕ
			Доспехи: Лёгкие доспехи, средние доспехи, щиты
			Оружие: Простое оружие, воинское оружие
			Инструменты: Нет
			Спасброски: Сила, Телосложение
			Навыки: Выберите два навыка из следующих: Ат-
			летика, Внимательность, Выживание, Запугива-
			ние, Природа, Уход за животными

			СНАРЯЖЕНИЕ (ВЫБОР)
			Вы начинаете со следующим снаряжением в до-
			полнение к снаряжению, полученному за вашу
			предысторию:
			• а) секира или б) любое воинское рукопашное
			оружие
			• а) два ручных топора или б) любое простое
			• оружие
			• Набор путешественника и четыре метатель-
			ных копья
		}
		Варвар
		Воин
		Волшебний
		Друид
		Жрец
		Колдун
		Монах
		Паладин
		Плут
		Следопыт
		Чародей
		
		*/
		return 4
	}
	if(step == 4){
		//Добавлять характеристику, владения, навыки для класса
		return 5
	}
	if(step == 5){
		//Имя, пол, рост и вес(случайный или заданный)
		return 6
	}
	if(step == 6){
		//Цвет волос, глаз, кожи иные характеристики
		return 7
	}
	if(step == 6){
		//мировоззрение
		return 6
	}
	if(step == 7){
		//языки
		return 8
	}
	if(step == 8) {
		//черты характера(две)
		return 9
	}
	if(step == 9){
		//Идеалы
		return 10
	}
	if(step = 10){
		//привязанности
		return 11
	}
	if(step == 11){
		//привязанности
		return 12
	}
	if(step == 12){
		//слабости
		return 13
	}
	if(step == 13){
		//слабости
		return 14
	}
	if(step == 14){
		//предыстрория
		return 15
	}
	if(step == 15){
		//снаряжение
		return false
	}
}


module.exports = {
	random: getRandomIntInclusive,
	steps: steps,
	getpr: getPrefix
}