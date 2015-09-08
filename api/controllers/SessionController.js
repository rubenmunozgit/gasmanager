/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var bcrypt = require('bcrypt');
module.exports = {

	'login': function(req, res) {
		res.view('session/login');
	},

	create: function(req, res, next) {
		// Check for email and password in params sent via the form, if none
		// redirect the browser back to the sign-in form.
		console.log('correo: ' + req.param('email') + ', contrasena: '+ req.param('password'));
		
		// Try to find the user by there email address.
		// findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
		// User.findOneByEmail(req.param('email')).done(function(err, user) {
		User.findOneByEmail(req.param('email'), function foundUser(err, user) {
			if (err) return next(err);
			// If no user is found...
			if (!user) {
				console.log('no email found: ' + req.param('email') );
				
				res.redirect('/');
				return;
			}
			// Compare password from the form params to the encrypted password of the user found.
			bcrypt.compare(req.param('password'), user.encrypPassword, function(err, valid) {
				if (err) return next(err);
				// If the password from the form doesn't match the password from the database...
				if (!valid) {
					console.log('la contrasena no coincide');
					res.redirect('/');
					return;
				}

				// Log user in
				req.session.authenticated = true;
				req.session.User = user;

				//Redirect to their profile page (e.g. /views/dashboard/showdbs.ejs)
				res.redirect('/dashboard/showdb/' + user.id);
			});
			
		});
	},

	destroy: function(req, res, next) {
		User.findOne(req.session.User.id, function foundUser(err, user) {
			var userId = req.session.User.id;
			if (user) {
				// Wipe out the session (log out)
				req.session.destroy();
				// Redirect the browser to the sign-in screen
				res.redirect('/');
			} 
			else {
				// Wipe out the session (log out)
				req.session.destroy();
				// Redirect the browser to the sign-in screen
				res.redirect('/');
			}
		});
	}	
};

