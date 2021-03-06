var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var quizAuthor = require('../controllers/quiz_author');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
// Definición de ruta para las estadísticas
var statisticsController = require('../controllers/statistics_controller');

// Página de entrada (home page)
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load); // autoload :quizId
router.param('commentId', commentController.load); // autoload :commentId

// Definición de rutas de sesión
router.get('/login',						sessionController.new); 	// forulario login
router.post('/login',						sessionController.create);	// formulario sesión						
router.get('/logout', 						sessionController.destroy);	// formulario sesión

// Definición de rutas de /quizes
router.get('/quizes',                      	quizController.index);
router.get('/quizes/:quizId(\\d+)',        	quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
router.get('/quizes/new', 					sessionController.loginRequired, quizController.new);
router.post('/quizes/create', 				sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',	sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',			sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',		sessionController.loginRequired, quizController.destroy);

// GET /quizes/statistics
router.get('/quizes/statistics',          statisticsController.index, statisticsController.statistics);

// Definición de ruta para autores
router.get('/authors', quizAuthor.authors); 

// Definición de ruta para comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',	commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',		commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',	sessionController.loginRequired, commentController.publish);

module.exports = router;
