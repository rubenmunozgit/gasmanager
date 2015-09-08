/**
* Dashboard.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,

  attributes: {

  	user: {
  		type: 'int'
  	},

  	distance: {
  		type: 'float',
  		required: true
  	},

  	qty: {
  		type: 'float',
  		required: true
  	},

  	totalprice: {
  		type: 'float',
  		required: true
  	},

  	unitprice: {
  		type: 'float'
  	},

    consumed: {
      type: 'float'
    },

  	date: {
  		type: 'date'
  	},

    fulldepot: {
      type: 'boolean'
    }

  },

  beforeCreate: function (attr, next) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    attr.date = yyyy+"-"+mm+"-"+dd;
    attr.unitprice = (attr.totalprice/attr.qty).toFixed(3);
    //attr.consumed = (attr.qty*100/attr.distance).toFixed(3); //liter/100km
    next();
  }
};

