var encryptLib = require('crypto');
//***local functionality

function isValidEmail(email){
	if(email.match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)){
		return true;
	}else{
		return false;
	}
} 

function encrypt(string){
	var sha512 = encryptLib.createHash("sha512");
	sha512.update(string);
	var hash = sha512.digest("hex");
	return hash;
}

//***global functionality
exports.getUserData = function(req, res, db){
	if(req.session.userID!=undefined){
		db.query('SELECT name,code,email FROM communities WHERE com_id = ?',[req.session.userID], function(err, docs) {
			res.send({
				"id": req.session.userID,
				"name": docs[0].name,
				"code": docs[0].code,
				"email": docs[0].email
			});
		});
	}else{
		res.send({"id":""});
	}
}

exports.index = function(req, res, db){	
	console.log(req.session.userID);
	res.render('home');
};

exports.login = function(req, res, db){
	var comName = req.body.comName;
	var comPass = req.body.comPass;
	db.query('SELECT * FROM communities WHERE name = ? AND password = ?',[comName,encrypt(comPass)], function(err, docs) {
		if(docs.length > 0){
			req.session.userID  = docs[0].com_id;
			res.send({success:true, message: "Successfully logged in"});
		}else{
			res.send({success:false, message: "Incorrect board name or password."});
		}
	});
}

exports.predictComName = function(req,res,db){
	var comName = "%"+req.body.comName+"%";
	db.query("SELECT name FROM communities WHERE name LIKE ?", [comName], function(err,docs){
		results = [];
		for(var i in docs){
			if(i==8){
				break;
			}
			results.push(docs[i].name);
		}
		res.send(results);
	});
}

exports.startCommunity = function(req,res,db, transporter){
	var comName = req.body.comName;
	var comPass = req.body.comPass;
	var comVPass = req.body.comVPass;
	var comEmail = req.body.comEmail;
	var passHash = encrypt(comPass);
	var errors = "";
	
	if(comName.length==0||comPass.length==0||comEmail.length==0||comVPass.length==0){
		errors = errors + "All fields are required. ";
		res.send({
			success:false,
			message: errors
		});
	}else{
	
		if(!isValidEmail(comEmail)){
			errors = errors + "You have supplied an invalid email. ";
		}
		
		if(comPass!=comVPass){
			errors = errors + "Your passwords do not match.";
		}
		
		if(comPass.length<4){
			errors = errors + "Your password is too short.";
		}else if(comPass.length>30){
			errors = errors + "Your password is too long.";
		}
		
		if(comName.length<4){
			errors = errors + "Your community name is too short.";
		}else if(comName.length>40){
			errors = errors + "Your community name is too long.";
		}
		
		db.query('SELECT email FROM communities WHERE email = ?',[comEmail], function(err, Edocs) {
			if(Edocs.length>0){
				errors = errors + "Your email is already in use.";
			}

			if(errors.length==0){
		
				function produceCode(s,e){
					var codeFeed = encrypt(comName+comPass+comEmail);
					var comCode  = codeFeed.substring(s, e);
					return comCode;
				}
		
				function checkCode(docs, count, comCode){
					if(docs!=""){
						count = count + 1;
						if(count>8){
							res.send({
								success:false,
								message: "There was a problem. Please try again later."
							});
						}else{
							parseCode(count);
						}
					}else{
						db.query("INSERT INTO communities VALUES('',?,?,?,?)", [comName, comCode, passHash, comEmail], function(err){
							var bodyHTML = "Dear " + comName + ",<br><br>Your new board has successfully been created. The code that will be used by your suggesters is: <b>" +comCode+"</b>. <br> Please share this code with your desired suggesters! If you have any questions please contact <i>hello@simplysuggest.it</i>.<br><br>Thank you,<br><br>SimplySuggest"; 
							var mailOptions = {
										from: "simplysuggest@gmail.com",
										to: comEmail, // list of receivers
										subject: "Your new SimplySuggest board!", // Subject line
										text: '', // plaintext body
										html: bodyHTML // html body
									};
						
							transporter.sendMail(mailOptions, function(error, info){
								res.send({
									success:true,
									message: "Successfully created board. Your board code is <b style = 'color: grey;'>" + comCode + "</b>."
								});
							});
					
						});
					}
				}
		
				function parseCode(count){
					var comCode = produceCode(count,count+6);
					db.query("SELECT code FROM communities WHERE code = ?", [comCode], function(err,docs){
						checkCode(docs, count, comCode);
					});
				}
		
				var count = 0;
				parseCode(count);
	
			}else{
				res.send({
					success:false,
					message: errors
				});
			}	
			
		});	
	}
};

exports.logout = function(req,res){
	req.session.destroy();
	res.redirect("/");

};

exports.getStaticContent = function(req,res,db){
	var name = req.body.name;
	
	db.query('SELECT text FROM static_content WHERE name = ?', [name], function(err,docs){
		res.send(docs[0].text);
	});	
};

exports.updateProfile = function(req,res,db){
	var newEmail = req.body.email;
	var newPass = req.body.pass;
	var vnewPass = req.body.vpass;
	
	var queryEmail = "";
	var queryPass = "";
	var queryParams = [];
	
	var emailAttempt = true;
	
	var errors = "";

	if(isValidEmail(newEmail)){

		queryEmail = 'email = ?';
		queryParams.push(newEmail);
		
	}else if(newEmail.length>0){
		errors = errors + "Invalid Email. ";
	}else{
		emailAttempt = false;
	}
	
	if(newPass.length!=0){
		if(newPass==vnewPass){
			queryPass = "password = ?";
			queryParams.push(encrypt(newPass));
		}else{
			errors = errors + "Your passwords do not match. ";
		}
	}
	
	if(queryEmail.length>0&&queryPass.length>0){
		queryPass = "," + queryPass;
	}

	queryParams.push(req.session.userID);

	var query = "UPDATE communities SET "+queryEmail+queryPass+" WHERE com_id = ?";

	if(errors.length==0){
		db.query('SELECT email FROM communities WHERE email = ?',[newEmail], function(err, Edocs) {
			if(Edocs.length>0&&emailAttempt==true){
				errors = errors + "That email is already in use.";
				res.send({success:false, msg: errors});
			}else{
				db.query(query, queryParams, function(err,docs){
					console.log(err);
					res.send({success:true, msg: "Successfully updated profile."});
				});
			}
		});	
		
		
	}else{
		res.send({success:false, msg: errors});
	}	
};