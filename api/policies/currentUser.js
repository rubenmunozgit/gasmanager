/**
 * Gets the current user from session, or returns 403
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to controller
  if (req.session.User) {
  	console.log('usuario: ' + req.session.User.name + ', usuario id: '+ req.session.User.id);
    req.body.user = req.session.User.id;
    console.log('body.user: ' + req.body.user + " body.id: "+ req.body.id);
    return next();
  }

  // User is not allowed
  else {
    return res.forbidden('You are not permitted to perform this action.');
  }
};
