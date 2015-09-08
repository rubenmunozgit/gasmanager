/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');
module.exports = {
  schema: true,

  attributes: {

  	name: {
  		type: 'string',
  		required: true
  	},

  	email: {
  		type: 'email',
  		required: true,
  		unique: true
  	},

  	encrypPassword: {
  		type: 'string',
  		required: true
  	}

  },

  beforeCreate: function (attr, next) {
    // var bcrypt = require('bcrypt');

    bcrypt.genSalt(10, function (err, salt) {
      if(err) return next(err);

        bcrypt.hash(attr.encrypPassword, salt, function(err, hash) {
          if(err) return next(err);

            attr.encrypPassword = hash;
            next();
        });
    });
  },

  beforeUpdate: function (attr, next) {
    var bcrypt = require('bcrypt');

    bcrypt.genSalt(10, function (err, salt) {
      if(err) return next(err);

        bcrypt.hash(attr.encrypPassword, salt, function(err, hash) {
          if(err) return next(err);

            attr.encrypPassword = hash;
            next();
        });
    });
  }

};

