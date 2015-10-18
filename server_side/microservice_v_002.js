// Бета версия сервера
// microservice_v_002.js
// підгонка сервера з чекпоінтами та маячньою


var restify = require('restify'), fs = require('fs'), uuidObject = require('restify/node_modules/node-uuid');

var today = new Date();

var todayDate = today.toString();  

var absoluteTime = Date.now();

var absoluteFuture = (absoluteTime + (365 * 24 * 60 * 60 * 10) );



var wd = __dirname ;
console.log( 'Working directory ' + wd );
console.log( todayDate );






// точки входу

function controllerQuizCreate( req, res, next ) 

{
	var uuidValue = uuidObject.v4() ;
	console.log( 'Quiz ID ' + uuidValue );
	res.send( 'Quiz ID ' + uuidValue );
};



function controllerQuizUpdateAndSave( req, res, next )

{
	console.log( 'controllerQuizUpdateAndSave ' );
	res.send( 'controllerQuizUpdateAndSave ' );
}



function controllerQuizGet( req, res, next )
{
	console.log( 'controllerQuizCreate ' );
	res.send( 'controllerQuizGet ' );
}



function controllerQuizResult( req, res, next )
{
	console.log( 'controllerQuizResult ' );
	res.send( 'controllerQuizResult ' );
}

// конструктор 

function QuestionObject( someObject, res, next ) // already some object
{ 
	console.log( 'Викликано конструктор який має створити запитання із вхідного об’єкта ' );
	var templateOfQuestionObject =
	{
		"questionText_en_EN": "string",
 		"questionText_ru_RU": "string",
		"questionText_uk_UA": "string",
        "answer"            : "Array"
    };

	// console.log( "Template created with some keys, object type is \"" + typeof templateOfQuestionObject + "\"" );
	// console.log(Object.keys(templateOfQuestionObject));
    	
	// перевірка чи наш об’єкт-аргумент someObject відповідає шаблону
	// якщо ні - throw exception (нас намагались нагодувати сміттям)
	// якщо так - повертаємо this тобто власне об’єкт
	// перевірку типу - що answer є масивом розміру саме 5 - не пропустити
	// коли ми з’ясували що дійсно масив і дійсно 5 - перевірку поелементно
	// реалізувати циклом
	// 	        {	// 0
	//        		"text_en_EN": "string",
	//        		"text_uk_UA": "string",
	//        		"text_ru_RU": "string"
	//        	},
	// перша ж невдала перевірка спричиняє припинення подальших перевірок
	// і виводить нас на throw правильно сформованого об’єкта exception

	for ( var k in templateOfQuestionObject )
	{
		if ( ! someObject.hasOwnProperty(k) )
		{
			throw "InputObjectMissesMandatoryKey";
		}
		else if ( typeof someObject[ k ] != templateOfQuestionObject[ k ] )
		{
			if ( ( "Array" === templateOfQuestionObject[ k ] ) && ( someObject[ k ] instanceof Array ) )
			{
				; // це масив і все співпало - перевірка вдалась
			}
			else
			{
				console.log ( "Failed with k = " + k + " and " + typeof someObject[ k ] + " != " +  templateOfQuestionObject[ k ] );
				throw "InputObjectWrongTypeOfMandatoryKey";
			};
		};
	};
	//
	// ми вже знаємо що в someObject наявний ключ 'answer' і його значення - дійсно масив
	// перевіримо, що у нас правильний масив - довжини 5, і по 3 string у кожному об’єкті - елементі
	//
	// console.log( "Test for Array: " + (someObject.answer instanceof Array) );
	// console.log( "length is " + someObject.answer.length );
	if ( ! ( 5 === someObject.answer.length ) )
	{
		throw "InputObjectHas" + someObject.answer.length + "Answers";
	};
	//
	// кожний з 5-ти елементів масиву відповідей перевіряємо на відповідність, аби нас гівном не нагодували, ОКРЕМО по одному
	//
	for ( var a in someObject.answer )
	{
		// console.log( "Has answer item object a property text_en_EN? " + someObject.answer[ a ].hasOwnProperty( "text_en_EN" ) ); // true
		// console.log( "Answer item object someObject.answer[ a ] keys are " + Object.keys(someObject.answer[ a ]) );
		// console.log( "someObject.answer[" + a + "] has " + Object.keys(someObject.answer[ a ]).length + " keys" );
		//
		// min 4 тому що weight обов’язковий, це 4-й обов’язковий ключ
		//
		if ( ! ( 4 <= Object.keys(someObject.answer[ a ]).length && Object.keys(someObject.answer[ a ]).length <= 5 ) )
		{
			throw "InputObjectAnswer" + a + "Has" + Object.keys(someObject.answer[ a ]).length + "Keys";
		};
		var keylist = new Array( "text_en_EN", "text_uk_UA", "text_ru_RU", "weight" );
		for ( var lkey in keylist )
		{
			if ( ! someObject.answer[ a ].hasOwnProperty( keylist[ lkey ] ) )
			{
				throw "InputObjectBrokenAnswer" + a + "LacksMandatoryKey" + keylist[ lkey ];
			};
		};
		//
		// weight є - а це дійсно масив? розмір 2?
		//
		//console.log ( someObject.answer[ a ].weight );
		//console.log ( someObject.answer[ a ].weight instanceof Array );

		if ( ! (   (           someObject.answer[ a ].weight instanceof Array                                    )
				// перевірка коефіціентів
				&& ( ( -1.0 <= someObject.answer[ a ].weight[0] ) && ( someObject.answer[ a ].weight[0] <= 1.0 ) )
				&& ( ( -1.0 <= someObject.answer[ a ].weight[1] ) && ( someObject.answer[ a ].weight[1] <= 1.0 ) )
			   )
			)
		{
			throw "Weight is awesome" + " " + someObject.answer[ a ].weight;
		};
	};
	//
	// якщо ми опинились у цій точці - значить, всі перевірки успішні і ні одна не вивалила exception
	// тепер формуємо із someObject власне наш об’єкт, який і є цільовим результатом роботи конструктора,
	// спершу присвоюємо обов’язкові ключі і їхні значення
	//
	for ( var k in templateOfQuestionObject )
	{
	//	console.log ( someObject[ k ] );
	//	console.log ( typeof someObject[ k ] );
	//	console.log ( "k is type and value " + typeof [ k ] + " " + [ k ] );
	//	console.log ( Object.keys(someObject) );
		this [ k ] = someObject [ k ];
	};
	//
	// а тут присвоюємо значення НЕобов’язкових ключів
	//
	
	this.dateIntroduced      		    = absoluteTime;
	this.introducedByExpert  		    = "bberezka"; // пізніше візьмемо з модуля аутентифікації
	this.isObsolete           		    = false;
	this.dateValidUntil       		    = absoluteFuture; // вточнити як складається час !!!! TODO
	this.obsoletedByExpert  	        = null;
	this.lastModifiedByExpert 		    = this.introducedByExpert;
	this.dateLastModified     		    = this.dateIntroduced;
	this.timesIncludedInQuiz  	     	= 0;
	
	for ( var a1 in this.answer )
	{
		this.answer[ a1 ].timesChosen  = 0;
	};
    

	//console.log ( "SHIT HEPENS #2", this );
    

	return this;

};


function controllerQuestionCreate( req, res, next )
{
    var dbDir = './questionsDB/';
    if ( false === req.is('json') )
    {
    	res.status(415);
		res.json({ type: false, data: "Broken JSON"});
		return; //  хай контроллєр повертає сформований нами res
    };
    try
    {
	    var newQuestion = new QuestionObject( req.body ); // зловили об’єкт, якщо він кривий то exception кидаємо у конструкторі
	//    console.log( "Shit HEPENS number 3" + JSON.stringify(newQuestion) );
	}
	catch ( errorArgument )
	{
    	res.status(400);
		res.json( { err_arg: errorArgument } );
		return; //  контроллєр повертає сформований нами res і ми його отримуємо у відповіді на наш запит!
	};

    var uuidOfNewQuestion = uuidObject.v4();

    newQuestion.questionId = uuidOfNewQuestion;


    fs.writeFile( ( './questionsDB/' + uuidOfNewQuestion + '.json') , JSON.stringify(newQuestion),
    	function (error) 
    	{
		  	if (error)
		  	{
		       console.error( "write error:  " + error.message );
		       throw new "це фіґня, помилка не синтаксична, а вводу-виводу у файл";
		    }
		    else
		    {
		       res.status(200)
		       res.json( "Збережено в " + dbDir + " "+ ( './questionsDB/' + uuidOfNewQuestion + '.json') );
		       console.log( "Збережено в " + dbDir + " " + ( './questionsDB/' + uuidOfNewQuestion + '.json') );
		    }
		}
	);

    //
    // на цей момент у нас є об’єкт типу QuestionObject у змінній newQuestion
    // якщо newQuestion.questionId не undefined і не '', перевірити, чи є у нас в базі питання з таким id
    // якщо є - це помилка, ми не перетираємо існуюче запитання - повертаємо помилку 500й код
    //
    // тут має бути перевірка по файловій системі

	return next;
};


function controllerQuestionUpdateAndSave( req, res, next )
{
	console.log( 'controllerQuestionUpdateAndSave ');
	res.send( 'controllerQuestionUpdateAndSave ');
}


function controllerQuestionUpdateCountersAndSave( req, res, next )
{
	console.log( 'ontrollerQuestionUpdateCountersAndSave ' );
	res.send( 'ontrollerQuestionUpdateCountersAndSave ' );
}


function controllerQuestionGet( req, res, next )
{
	var questionFileName = ( './questionsDB/' + req.params.questionId + '.json');

	fs.readFile( questionFileName, function (err, data) 
	{
  		if (err) throw err;
  		var jsonData = JSON.parse(data)
  		console.log(jsonData);
  		res.send(jsonData);
	}); 

    return;

};
// підключені чекпоінти



var server = restify.createServer({
	name: 'quiz-microservice',
	version: '0.0.1'
});

server
	.use(restify.acceptParser(server.acceptable))
	.use(restify.queryParser()                  )
	.use(restify.fullResponse()                 )
    .use(restify.bodyParser()                   );

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
server.get ({path : PATH + '/question/:questionId', version : '0.0.1'} , controllerQuestionGet );

server.listen( 9080, initMessage );