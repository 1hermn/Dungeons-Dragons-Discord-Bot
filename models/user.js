const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: String,
  id: Number,
  user: Number,
  step: Number,
  race: String,
  class: String,
  specs: String,
  pos: String,
  preson: {
  	gender: String,
  	growth: String,
  	langs: [String]
  	specs : {
	  	wheight: Number,
	  	age: Number,
	  	heir: String,
	  	eyes: String,
	  	character: [String],
	  	ideals: [String],
	  	affection: [String],
	  	weakness: [String],
	  	hist: String,
	  	spec: [String],
	  	other: [String]
  	},
  	wv: String,
  	riches: {
  		money: String,
  		things: [String],
  		armor: [String],
  		weapons: [String],
  		equipment: [String],
  	}


  }
 
})

const User = mongoose.model('User', userSchema)

module.exports = User