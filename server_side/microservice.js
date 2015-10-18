
var restify = require('restify'), fs = require('fs'), uuidObject = require('restify/node_modules/node-uuid');

var today = new Date();

var TodayDate = today.toString();  


var wd = __dirname ;
console.log( 'Working directory ' + wd );
console.log( TodayDate );





var server = restify.createServer({
	name: 'quiz-microservice',
	version: '0.0.1'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser()); 
server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.CORS());

function initMessage() {
	console.log('%s listening at %s', server.name, server.url);
};

var PATH = '/'; // URL http://quiz.kiev.ua/microservice переспрямовується nginx-ом сюди в корінь

//
// quizId - це токен, який ми будемо генерувати унікальний для даного опитування даного користувача
//
server.post({path : PATH + '/quiz/',                  version : '0.0.1'} , controllerQuizCreate ); // return quizId
server.put ({path : PATH + '/quiz/:quizId' ,          version : '0.0.1'} , controllerQuizUpdateAndSave );
server.get ({path : PATH + '/quiz/:quizId/:langCode', version : '0.0.1'} , controllerQuizGet );
server.get ({path : PATH + '/quiz/:quizId/result',    version : '0.0.1'} , controllerQuizResult );
//
// беремо json з питанням, зберігаємо у базу, ПОВЕРТАЄМО json з id питання
//
server.post({path : PATH + '/question/',           version : '0.0.1'} , controllerQuestionCreate ); // return questionId
//
// { questionId: "шоприслали" }
//
server.put ({path : PATH + '/question/:questionId' ,          version : '0.0.1'} , controllerQuestionUpdateAndSave ); // edit
server.put ({path : PATH + '/question/:questionId/count' ,    version : '0.0.1'} , controllerQuestionUpdateCountersAndSave );
server.get ({path : PATH + '/question/:questionId/:langCode', version : '0.0.1'} , controllerQuestionGet );

server.listen( 9080, initMessage );