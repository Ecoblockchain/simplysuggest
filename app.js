
/**
 * Module dependencies.
 */

var express = require('express');
var index = require('./routes/index.js');
var notes = require('./routes/notes.js');
var http = require('http');
var path = require('path');
var mysql = require('mysql');

var app = express();

// all environments
var db;
if ('development' == app.get('env')) {
	app.set('port', process.env.PORT || 3000);
	app.use(express.errorHandler());
  
  	db = mysql.createConnection({
		host : "localhost",
		user : "root",
		password : "",
		database : "simplysuggest"
	});
  
}else{
	app.set('port', process.env.PORT || 80);
	db = mysql.createConnection({
		host : "localhost",
		user : "root",
		password : "mysql4545",
		database : "simplysuggest"
	});
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: 'IUyvt5tc7'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'simplysuggest@gmail.com',
        pass: 'BY6vb7oF8RG'
    }
});


db.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + db.threadId);
});
//main functionality
app.get('/', function(req,res){
	index.index(req,res,db);
});

app.post('/getUserID', function(req,res){
	index.getUserID(req,res);
});

app.post('/predictComName', function(req,res){
	index.predictComName(req,res,db);
});

app.post('/login', function(req,res){
	index.login(req,res,db);
});

app.post('/startCommunity', function(req,res){
	index.startCommunity(req,res,db, transporter);
});

app.post('/logout', function(req,res){
	index.logout(req,res);
});

app.post('/getStaticContent', function(req,res){
	index.getStaticContent(req,res,db);
});

//note functionality

app.post('/sendNote', function(req,res){
	notes.sendNote(req,res,db);
});

app.post('/getNotes', function(req,res){
	notes.getNotes(req,res,db);
});

app.post('/noteAction', function(req,res){
	notes.noteAction(req,res,db, transporter);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port') + app.get('env'));
});
