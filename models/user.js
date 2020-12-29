const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: String,
  id: Number,
  user: Number,
  step: Number,
  class: { type: String, default: "0"},
  characters: {
  	bonus: {
  		force: { type: Number, default: 0},
  		physique: { type: Number, default: 0},
  		agility: { type: Number, default: 0},
  		intellect: { type: Number, default: 0},
  		wisdom: { type: Number, default: 0},
  		charisma: { type: Number, default: 0}	
  },
  	force: { type: Number, default: 0},
  	physique: { type: Number, default: 0},
  	agility: { type: Number, default: 0},
  	intellect: { type: Number, default: 0},
  	wisdom: { type: Number, default: 0},
  	charisma: { type: Number, default: 0},
  },
  person: {
  	race: { type: String, default: "0"},
  	gender: { type: String, default: "0"},
  	growth: { type: String, default: "0"},
  	langs: { type: mongoose.Schema.Types.Mixed, default: "0"},
  	speed: { type: Number, default: 0},
  	specs : {
	  	wheight: { type: Number, default: 0},
	  	age: { type: Number, default: 0},
	  	heir: { type: String, default: "0"},
	  	eyes: { type: String, default: "0"},
	  	character: { type: mongoose.Schema.Types.Mixed, default: "0"},
	  	ideals: { type: mongoose.Schema.Types.Mixed, default: "0"},
	  	affection: { type: mongoose.Schema.Types.Mixed, default: "0"},
	  	weakness: { type: mongoose.Schema.Types.Mixed, default: "0"},
	  	hist: { type: String, default: "0"},
	  	spec: { type: mongoose.Schema.Types.Mixed, default: "0"},
	  	pos: { type: mongoose.Schema.Types.Mixed, default: "0"},
	  	other: { type: mongoose.Schema.Types.Mixed, default: "0"},
	  	spells: { type: mongoose.Schema.Types.Mixed, default: "0"}
  	},
  	wv: { type: String, default: "0"},
  	riches: {
  		money: { type: mongoose.Schema.Types.Mixed, default: "0"},
  		things: { type: mongoose.Schema.Types.Mixed, default: "0"},
  		armor: { type: mongoose.Schema.Types.Mixed, default: "0"},
  		weapons: { type: mongoose.Schema.Types.Mixed, default: "0"},
  		equipment: { type: mongoose.Schema.Types.Mixed, default: "0"},
  	}


  }
 
})

const User = mongoose.model('User', userSchema)

module.exports = User