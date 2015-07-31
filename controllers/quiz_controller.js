var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
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

	 //console.log("req.query.search = "+req.query.search);
  	req.query.search = req.query.search || "";
	var search = req.query.search;
	if (search.length !== 0){
		search = '%'+search.replace(' ','%').trim()+'%';
	} else {
	    search = '%';
	}
	//console.log("search = "+search);

	models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function(quizes) {
		res.render('quizes/index', { quizes: quizes, errors: []});
	}).catch(function(error) { next(error);}) 
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz });
};

// GET /quizes/answer
exports.answer = function(req,res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado });
};
