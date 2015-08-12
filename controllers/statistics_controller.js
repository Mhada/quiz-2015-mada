var models = require('../models/models.js');

var numPreguntas, numComentarios, mediaComentariosPorPregunta, numPreguntasSinComentarios, numPreguntasConComentarios, errors;

// GET /quizes/statistics
exports.index = function(req, res, next) {
	numPreguntas = 0;
	numComentarios = 0;
	mediaComentariosPorPregunta = 0;
	numPreguntasSinComentarios = 0;
	numPreguntasConComentarios = 0;
	errors = [];

	// Consulta para devolver todas los preguntas
	models.Quiz.findAll().then(
		function(quizes) {
			// El número de preguntas
			numPreguntas = quizes.length;
			console.log('número de preguntas: ' + numPreguntas);
			if(quizes.length === 0) {
				errors[errors.length] = new Error('No se encuentran preguntas');
			}
		}
	).catch(
		function(error) { 
		next(error);
		}
	);

	// Consulta para devolver todos los comentarios
	models.Comment.findAll().then(
		function(comments) {
			// Número total de comentarios
			numComentarios = comments.length;
			// Media de comentarios por pregunta
			mediaComentariosPorPregunta = Math.round((numComentarios/numPreguntas)*100)/100;
			var preguntasConComentarios = [];
			for(var i = 0; i < comments.length; i ++ ){
				if (preguntasConComentarios.indexOf(comments[i].QuizId) === -1){
					preguntasConComentarios.push(comments[i].QuizId);
				}
			}
			// Número de preguntas con comentarios
			numPreguntasConComentarios = preguntasConComentarios.length;
			// Número de preguntas sin comentarios
			numPreguntasSinComentarios = numPreguntas - numPreguntasConComentarios;
			if(comments.length === 0){
				errors[errors.length] = new Error('No se encuentran comentarios');
			}
			next();
		}).catch(
			function(error){ 
				next(error);
			}
		);
};

exports.statistics = function(req, res) {
	res.render(
		'quizes/statistics', {
			numPreguntas: numPreguntas,
			numComentarios: numComentarios,
			mediaComentariosPorPregunta: mediaComentariosPorPregunta,
			numPreguntasSinComentarios: numPreguntasSinComentarios,
			numPreguntasConComentarios: numPreguntasConComentarios,
			errors: errors
		}
	);
};