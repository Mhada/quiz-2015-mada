var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(
	function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next(); // se ejecuta el middleware correspondiente
		} else {
			next(new Error('No existe quizId = ' +quizId));
		}
	}
	).catch(function(error) { next(error); }); 
};

// GET /quizes
exports.index = function(req, res) {
	// models.Quiz.findAll().then(
	// function(quizes) {
	// 	res.render('quizes/index.ejs', { quizes: quizes });
	// }).catch(function(error) { next(error); }); 
	
	// Ejercicio de Búsqueda de preguntas
  	req.query.search = req.query.search || "";
	var search = req.query.search;
	if (search.length !== 0){
		search = '%'+search.replace(' ','%').trim()+'%';
	} else {
	    search = '%';
	};

	models.Quiz.findAll({where: ["pregunta LIKE ?", search]}).then(function(quizes) {
		res.render('quizes/index', { quizes: quizes, errors: []});
	}).catch(function(error) { next(error);}) 
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/answer
exports.answer = function(req,res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build( // crea objeto quiz
		{ pregunta: "", respuesta: ""}
	); 
	res.render('quizes/new', { quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
	quiz.tema = req.body.tema;

	quiz
	.validate()
	.then( 
		function(err) {
			if (err) {
				res.render('quizes/new', { quiz: quiz, errors: err.errors });
			} else {
				// save: guarda en DB cmapos pregunta y respuesta de quiz
				quiz
				.save({fields: ["tema", "pregunta", "respuesta"]})
				.then( 
					function() { 
						res.redirect('/quizes')
					}
				) // res.redirect: Redirecciona HTTP a lista de preguntas
			}
		}
	);
};

// GET quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; // autoload de instancia quiz

	res.render('quizes/edit', { quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta 	= req.body.quiz.pregunta;
	req.quiz.respuesta 	= req.body.quiz.respuesta;
	req.quiz.tema 		= req.body.tema;

	req.quiz
	.validate()
	.then(
		function(err) {
			if (err) {
			res.render('quizes/edit', { quiz: req.quiz, errors: err.errors });
		} else {
				// save: guarda en DB cmapos pregunta y respuesta de quiz
				req.quiz
				.save({fields: ["tema", "pregunta", "respuesta"]})
				.then( 
					function() { 
						res.redirect('/quizes')
					}
				) // res.redirect: Redirecciona HTTP a lista de preguntas
			}
		}
	)
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy()
	.then(
		function() {
			res.redirect('/quizes');
		}).catch(
		function(error) {
			next(error)
		});
};
