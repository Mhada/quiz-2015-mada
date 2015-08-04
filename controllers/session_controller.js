// GET /login  --Formulario de login
exports.new = function(req, res){
	var errors = req.session.errors || {};  // cargar errores o vacio si no está inicializada
	req.session.errors = {}; // reinicializamos para la siguiente transacción

	res.render('sessions/new', { errors: errors });
}

// POST /login   --Crear la sesión
exports.create = function(req, res){
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, 
		function(error, user){
			if(error){  // si hay error retornamos mensajes de error de sesión
				req.session.errors = [{ "message": 'Se ha producido un error: ' + error }];
				res.redirect("/login");
				return;  // acaba la ejecución
			}
		// Crear res.session.user y guardar campos id y usermana
		// La sesión se define por la existencia de: req.session.user
		req.session.user = { id: user.id, usermane: user.usermane };
		res.redirect(req.session.redir.toString()); // redirección a ruta anterior
		}
	);
};

// DELETE /logout   -- Destruir sesión
exports.destroy = function(req, res){
	delete req.session.user;
	res.redirect(req.session.redir.toString()); // redirección a ruta anterior
};