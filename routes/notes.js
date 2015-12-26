function isValidEmail(email){
	if(email.match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)){
		return true;
	}else{
		return false;
	}
} 

String.prototype.nl2br = function()
{
    return this.replace(/\n/g, "<br />");
}

exports.sendNote = function(req,res,db){
	var comCode = req.body.comCode;
	var email = req.body.email;
	var message = req.body.message;
	
	
	var errors = "";
	if(email==""){
		email = "Anonymous";
	}else if(!isValidEmail(email)){
		errors = errors + "You have supplied an invalid email. ";
	}
	
	if(message.length<10){
		errors = errors + "Your message is too short. ";
	}else if(message.length>1000){
		errors = errors + "Your message is too big. ";
	}
	
	if(comCode==""){
		errors = errors + "You must supply a community code. ";
	}
	
	db.query("SELECT code FROM communities WHERE code = ?", [comCode], function(err,docs){
			if(docs!=""){
				if(errors.length==0){
					db.query("INSERT INTO notes VALUES('', ?, ?, ?, 0)", [comCode, email, message], function(){	
						res.send("success");
					});

				}else{
					res.send(errors);
				}
			}else{
				errors = errors + "The community code does not exist. ";
				res.send(errors);
			}
	});
	
};

exports.getNotes = function(req,res,db){
	var comID = req.session.userID;
	db.query("SELECT code FROM communities WHERE com_id = ?", [comID], function(err,docs){
		db.query("SELECT * FROM notes WHERE com_code = ? ORDER BY note_id DESC", [docs[0].code], function(err,docs){
			res.send(docs);
		});
	});
};


exports.noteAction = function(req,res,db, transporter){
	var nID =  req.body.nID;
	var comID = req.session.userID;
	var action = req.body.action;
	var emailAct = req.body.emailAct;
	
	db.query('SELECT com_code, email FROM notes WHERE note_id = ? LIMIT 1', [nID], function(err,notesDocs){
		db.query('SELECT com_id, email, name FROM communities WHERE code= ? LIMIT 1', [notesDocs[0].com_code], function(err,docs){
			if(docs[0].com_id == comID){
				var fromEmail = docs[0].email;
				switch(action){
					case "email":
						var bodyHTML = "";
						var toEmail = notesDocs[0].email;
						var subject = "Regarding your suggestion...";
						var successMsg = "Email successfully sent.";
						if(emailAct=="self"){
							toEmail = fromEmail;
							subject = "Suggestion Reminder...";
							bodyHTML = "<i>Your saved suggestion for "+docs[0].name+"</i><br><br>";
						}else{
							successMsg += " Expect any replies in your actual inbox.";
							bodyHTML = "<i>Regarding your suggestion to " + docs[0].name + "...</i><br><br>";
						}
						var bodyText = (req.body.esBodyText).nl2br();
						bodyHTML +=bodyText;
						if(bodyText.length>5){
							var mailOptions = {
								from: fromEmail,
								to: toEmail, // list of receivers
								subject: subject, // Subject line
								text: '', // plaintext body
								html: bodyHTML + "<br><br>SimplySuggest" // html body
							};
						
							transporter.sendMail(mailOptions, function(error, info){
								if(error){
									res.send({success:false, msg: "Unknown error."});
								}else{
									res.send({success:true, msg: successMsg});
								}
							});
						}else{
							res.send({success:false, msg: "Your message is too short."});
						}
						
						break;
					case "like":
						var newVal = 1;
						var newOpt = "Unlike";
						var newDisp = "Liked<br>";
						db.query("SELECT liked FROM notes WHERE note_id = ? LIMIT 1", [nID], function(err,docs){
				
							if(docs[0].liked==1){
								newVal = 0;
								newOpt = "Like";
								newDisp = "";
							}
							db.query("UPDATE notes SET liked = ? WHERE note_id = ? LIMIT 1", [newVal, nID], function(err,docs){
								res.send({success:true, newOpt: newOpt, newDisp:newDisp});
							});
						});
						break;
			
					case "del":
						db.query('DELETE FROM notes WHERE note_id = ? LIMIT 1', [nID], function(err){
							res.send("success");
						});
						break;
				}
			}
		});		
	});
}
