/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	'signup': function (rep, res) {
		res.view();
	},

	create: function (req, res, next) {
		//Create a user with the parameter sent from
		//the signup page
		User.create( req.params.all(), function usercreated (err, user) {
			//if error return the error
			if(err) {
				console.log(err);
				//redirect to error page
				return res.negotiate(err);
			} 

			//log user in in session
			req.session.authenticated = true;
			req.session.User = user;
			//After succesfull
			//redirect to the show action
			res.redirect('/dashboard/showdb/' + user.id);
		});
	}
	
};

