"use strict";

$(document).ready(function(){
	
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-23313986-3', 'auto');
	ga('send', 'pageview');

	var snfHTML = $("#snf-fields").html();
	var loginFormHTML = $("#login-form").html();
	$("#submit-note-form").animate({marginTop: '165px'}, 1000);
	$("#background-note-form").animate({marginTop: '20px'}, 1000);
	
	
	$(".close-popups").html("x");
	/*$("#note-pin").animate({top: '-30px'}, 500).animate({left: '30px'}, 500, function(){
		$("#submit-note-form").animate({rotate: '-7deg'}, 200);
		$("#note-pin").animate({rotate: '0deg'}, 200);
	});
	*/
	
	//ajax buffer icon
	$(document).ajaxStart(function(){
		$("#loader-img").fadeIn(200);
	}).ajaxStop(function(){
		$("#loader-img").fadeOut(200);
	}); 
	var setEmail;
	//render correct DOM elements depending on session status.
	function renderPage(justIn){
		$.post('/getUserData', function(loggedin, status){
			if(loggedin.id.length!=0){
				$("#login-name-ph").html(loggedin.name);
				$("#board-code-ph").html(loggedin.code);
				$("#board-email-ph").val(loggedin.email);
				setEmail = loggedin.email;
				//$("#login-form").css("height", "auto").css("min-height", "250px");
				$("#login-fields").hide();
				$("#board-content").show();
				
				$("#email-sender-tarea").val("From: "+loggedin.email);
				
				var noteShowTime;
				var loginFormHeight;
				if ($(window).width() <= 1250){	
					loginFormHeight = "350px";
				}else{
					loginFormHeight = "500px";
					
				}	
				if(justIn==false){
					//render page instantly
					var totalHeight = $("#login-form").prop('scrollHeight');
					$("#login-form").show();
					$("#login-form").css("background-color","#c09569")
					.css("width","500px").css("height",loginFormHeight).css("overflow", "auto");
					noteShowTime = 0;
				}else{
					//animate
					var totalHeight = $("#login-form").prop('scrollHeight');
					$("#login-form").animate({backgroundColor:"#c09569"}, 500)
					.animate({height: loginFormHeight}, 500)
					.animate({width:"500px"}, 500)
					.css("overflow", "auto");
					noteShowTime = 1500;
				}
				
				$.post('/getNotes', function(result){
					if(result.length>0){
						for(var i in result){
							var from = result[i].email;
							var message = result[i].message;
							var nID = result[i].note_id;
							var nLiked = result[i].liked;
							var emailSenderOpt = "";
							if(from != "Anonymous"){
								emailSenderOpt = "<span id = 'es-"+nID+"' class = 'email-sender-opt'>Email Sender</span><br><br>";
							}
							var likeOpt = "Like";
							var dispLike = "";
							if(nLiked=="1"){
								likeOpt = "Unlike";
								dispLike = "Liked<br>";
							}
							var pinPos = Math.floor((Math.random() * 25) + 1).toString();
						
							var deg = Math.floor((Math.random() * 10) + 1).toString();
							if(deg%2==0){
								deg = "-"+deg;
							}
							$("#board-content").append("<div class = 'dis-note' id = 'note"+nID+"'><div class = 'dis-note-cover' id = 'cover"+nID+"'><br>"+
							"<span id = 'ln-"+nID+"' class = 'like-note'>"+likeOpt+"</span><br><br>"+
							"<span id = 'em-"+nID+"' class = 'email-me-opt'>Email Me This</span><br><br>"+
							emailSenderOpt+
							"<span id = 'dn-"+nID+"' class = 'del-note'>Delete</span></div>"+
							"<img src = '/images/note-pin.png' class = 'note-pin' id = 'note-pin"+nID+"'><br>"+
							"<span id = 'dispLike"+nID+"' style = 'color: #5DC97F;font-weight:bold;'>"+dispLike+"</span>"+
							"From: <span style = 'color: dimgrey;'>"+from+"</span><br><span id = 'sug-msg-"+nID+"'>"+message+"</span></div>");
						
							$(".note-pin").animate({marginLeft:"-="+pinPos+"px"}, 0);
							$("#note"+nID).animate({rotate: deg+'deg'}, 0);
						
							$("#note"+nID).hover(function(){
								$(this).animate({rotate: '0deg'}, 200);

							}).mouseleave(function(){
								var deg = Math.floor((Math.random() * 10) + 1).toString();
								if(deg%2==0){
									deg = "-"+deg;
								}
								$(this).animate({rotate: deg+'deg'}, 200);
							});
						
						}
					}else{
						$("#board-content").html("<div id = 'no-sug-err'>There are no suggestions on this board.</div>");
						setTimeout(function(){$("#no-sug-err").fadeIn();}, 1500);
					}
					
					$(".dis-note-cover").hover(function(){
						$(this).animate({opacity: "0.9"}, 200);
					}).mouseleave(function(){
						$(this).animate({opacity: "0.0"}, 200);
					});
					
					
					//like note handler
					$(".like-note").click(function(){
						var nID = $(this).attr("id").substring(3);
						$.post('/noteAction', {nID:nID, action:"like"}, function(result){
							$("#ln-"+nID).html(result.newOpt);
							$("#dispLike"+nID).html(result.newDisp);
						});
					});
					
					//delete note handler
					$(".del-note").click(function(){
						var nID = $(this).attr("id").substring(3);
						$.post('/noteAction', {nID:nID, action:"del"}, function(result){
							$("#note-pin"+nID).remove();
							$("#note"+nID).css("position", "relative").animate({rotate: '120deg', marginTop: "2000px"}, 3000, function(){
								$("#note"+nID).remove();
							});
						});
					});
					
					//emailer sender
					$(".email-sender-opt").click(function(){
						var nID = $(this).attr("id").substring(3);
						$("#email-sender-form").slideDown();
						$("#email-sender-submit").click(function(){
							var bodyText = $("#email-sender-tarea").val();
							$.post('/noteAction', {nID:nID, action:"email", esBodyText: bodyText, emailAct:"response"}, function(result){
								if(result.success==false){
									$("#email-sender-res-msg").css("background-color", "salmon");
								}else{
									$("#email-sender-res-msg").css("background-color", "lightgreen");
								}
								$("#email-sender-res-msg").html(result.msg);
								$("#email-sender-res-msg").fadeIn();
								setTimeout(function(){
									$("#email-sender-res-msg").fadeOut();
									$("#email-sender-res-msg").html("");
									$("#email-sender-form").slideUp();
								}, 3000);
							});
						});
					});
					
					//email self
					$(".email-me-opt").click(function(){
						var nID = $(this).attr("id").substring(3);
						var bodyText = $("#sug-msg-"+nID).html();
						$.post('/noteAction', {nID:nID, action:"email", esBodyText: bodyText, emailAct:"self"}, function(result){
							if(result.success==false){
								$("#em-"+nID).css("color", "salmon");
							}else{
								$("#em-"+nID).css("color", "lightgreen");
							}
							$("#em-"+nID).html(result.msg);
							setTimeout(function(){
								$("#em-"+nID).html("Email Me This");
								$("#em-"+nID).css("color", "#3574ad");
							}, 2000);
						});
					});
					
					setTimeout(function(){
							$(".dis-note").slideDown();
					},noteShowTime);
					
				});
				
				$(".enable-loggedin").show();
				$(".enable-loggedout").hide();
				
			}else{
				$("#login-form").css("background-color","#5DC97F")
					.css("width","400px").css("height","200px").css("overflow","hidden");
				$("#login-fields").show();
				$("#board-content").hide().html("");
				$(".enable-loggedin").hide();
				$(".enable-loggedout").show();
			}
		});
	}
	
	renderPage(false);
	
	//send note handler
	var sendNoteEvent = function(){
		var comCode = $("#sn-com-code").val();
		var email = $("#sn-email").val();
		var message = $("#sn-message").val();
		$.post('/sendNote', {
			comCode:comCode,
			email:email,
		  	message:message
		},function(result){
			if(result==="success"){
				$("#note-bindings").hide();
				$("#submit-note-form").animate({marginTop: '+=40px'}, 200, function(){
					$("#ripped-bindings").show();
					$("#submit-note-form").animate({rotate: '20deg'}, 200).animate({boxShadow: '0px 0px 30px grey'}, 200);
					$("#submit-note-form").animate({marginLeft:"+=1500px"}, 1500);
					$("#snf-fields").html("<div style = 'height:265px;font-size:150%;color:white;'>"+comCode+"<br>"+email+"<br>"+message+"</div>");
					setTimeout(function(){
						$("#background-note-form").animate({backgroundColor:"#46b97c"}, 200);
						$("#success-msg").html("Successfully submitted note!");
						$("#success-msg").show();
					}, 1500);
					setTimeout(function(){
						$("#note-bindings").show();
						$("#snf-fields").html($(snfHTML));
						$("#background-note-form").css("background-color", "#f2dc60");
						$("#success-msg").html("");
						$("#ripped-bindings").hide();
						$("#submit-note-form").animate({rotate: '0deg'}, 0)
						.css("boxShadow"," '0px 0px 0px")
						.animate({marginTop: '-=40px'}, 0)
						.animate({marginLeft:"-=1500px"}, 0);
					}, 5000);	
				});
			}else{
				$("#submit-note-form").fadeOut();
				$("#background-note-form").animate({backgroundColor:"#f36e4e"}, 200);
				$("#success-msg").html("<div style = 'height:265px;font-size:100%;color:white;'>"+result+"</div><span id = 'err-snf-return'><< Go Back</span>");
				$("#success-msg").slideDown();
				
				$("#err-snf-return").click(function(){
					$("#submit-note-form").fadeIn();
					$("#background-note-form").animate({backgroundColor:"#F2DC60"}, 200);
					$("#success-msg").slideUp();
				});
			}
		});
	}
	$("#sn-submit").on('click',function(){
		sendNoteEvent();
	});
	
	//login predict comName handler
	$("#login-com-name").keyup(function(){
		var comName = $(this).val();
		if(comName.length<2){
			$("#pred-comName-list").slideUp();
		}
		if(comName.length>2){
			$.post('/predictComName', {comName: comName}, function(results){
				for(var i in results){
					results[i] = "<span class = 'all-preds' id = 'pred-opt"+i+"'>"+results[i]+"?</span><br>";
				}
				$("#pred-comName-list").html(results.join(""));
				$("#pred-comName-list").slideDown();
				$(".all-preds").click(function(){
					var selectedName = $(this).html();
					selectedName = selectedName.substring(0, selectedName.length-1);
					$("#login-com-name").val(selectedName);
					$("#pred-comName-list").slideUp();
				});
			});
		}
	}).blur(function(){
		$("#pred-comName-list").slideUp();
	});

	
	//login handler
	$("#login-submit").click(function(){
		var comPass = $("#login-com-pass").val();
		var comName = $("#login-com-name").val();
		
		$.post('/login', {comPass:comPass, comName:comName}, function(result){
			if(result.success==false){
				$("#login-submit").val("").css("border", "none");
				$("#login-submit").animate({width: "97%", backgroundColor: "#f36e4e"}, 1000);
				$("#login-submit").val(result.message);
				
				$("#login-com-name, #login-com-pass").focus(function(){
					$("#login-submit").val("Login").css("border", "1px dashed white");
					$("#login-submit").animate({width: "100px", backgroundColor: "#5DC97F"}, 500);
				});
			}else{
				renderPage(true);
				
			}
		});
		
	});
	
	//start community handler
	$("#sc-submit").click(function(){
		var comName = $("#sc-com-name").val();
		var comPass = $("#sc-com-pass").val();
		var comVPass = $("#sc-com-vpass").val();
		var comEmail = $("#sc-com-email").val();
		
		$.post('/startCommunity', {
			comName:comName,
			comPass:comPass,
			comVPass: comVPass,
			comEmail:comEmail
		},function(result){
			$("#go-back-note1").hide();
			$("#go-back-note2").show();
			$("#sc-fields").fadeOut(1000, function(){
				if(result.success==true){
					result.message  = "<img src = '/images/tick.png' id = 'img-tick'><br>"+result.message;
				}else{
					$("#sc-form").animate({backgroundColor: "#f36e4e"}, 1000);
				}
				$("#sc-messages").html(result.message);
				$("#sc-messages").fadeIn();
			});
		}); 
	});
	
	
	//site navigation
	var ready = true;
	function showPage(elements,toStay){
		if(ready==true){
			if(toStay==undefined){
				toStay = [];
			}
			toStay = toStay.concat(elements);
			var toFadeOut = ["acc-info-container","success-msg","bnf-text","sc-form","login-form","sc-messages","submit-note-form","background-note-form"];
	
	
			for(var i in toFadeOut){
				var out = true;
				for (var x in toStay){
					if(toFadeOut[i]==toStay[x]){
						out = false;
					}
				}
				if(out==true){
					$("#"+toFadeOut[i]).fadeOut(200);
				}
			}
			ready = false;
			setTimeout(function(){
				for(var i in elements){
					$("#"+elements[i]).fadeIn(200);
				}
				ready = true;
			}, 300, function(){
				toStay = [];
				elements = [];
			});	
		}
	}
	$("#go-back-note, #go-back-note1").click(function(){
		showPage(["background-note-form", "submit-note-form"]);
	});
	
	$("#go-back-note2").click(function(){
		showPage(["sc-form", "sc-fields"]);
		
		$("#sc-form").animate({backgroundColor: "#5DC97F"}, 1000);
		$("#go-back-note1").show();
		$("#go-back-note2").hide();
	});
	
	$("#ml-login").click(function(){
		showPage(["login-form"]);
	});
	$("#ml-logout").click(function(){
		$.post('/logout', function(){
			$("#login-form").slideUp(1000, function(){
				$("#submit-note-form").hide().fadeIn(1000);
				$("#background-note-form").hide().fadeIn(1000);
				renderPage(false);
			});
		});
	});	
	
	$("#ml-newboard").click(function(){
		showPage(["sc-form", "sc-fields"]);
		$("#sc-form").animate({backgroundColor: "#5DC97F"}, 1000);
	});
	
	$("#header").click(function(){
		showPage(["background-note-form", "submit-note-form"]);
	});
	
	$("#ml-about").click(function(){
		$.post('/getStaticContent', {name:"about"}, function(result){
			showPage(["background-note-form","bnf-text"]);
			$("#bnf-text").css("font-size", "80%").html(result).show();
		});
	});	
	$("#ml-help").click(function(){
		$.post('/getStaticContent', {name:"help"}, function(result){
			showPage(["background-note-form","bnf-text"]);
			$("#bnf-text").css("font-size", "80%").html(result).show();
		});
	});	
	
		
	$("#ml-acc-info").click(function(){
		$("#acc-info-container").slideDown();
	});
	
	$(".close-popups").click(function(){
		$("#acc-info-container, #email-sender-form").slideUp();
	});
	
	//profile change 
	
	
	$("#board-email-ph").focus(function(){
		setEmail = $("#board-email-ph").val();
		$("#save-profile").fadeIn();
	}).blur(function(){
		if($("#board-email-ph").val()==setEmail){
			$("#save-profile").fadeOut();
		}
	});
	$("#board-pass-ph").focus(function(){
		$("#vpass-ph").fadeIn();
		$("#save-profile").fadeIn();
		$("#acc-info-container").animate({height: "260px"}, 500);
	}).blur(function(){
		if($("#board-pass-ph").val().length==0){
			$("#acc-info-container").animate({height: "200px"}, 500);
			$("#vpass-ph").fadeOut();
			$("#save-profile").fadeOut();
		}
	});
	
	$("#save-profile").click(function(){
		var email = $("#board-email-ph").val();
		
		if(email==setEmail){
			email = "";
		}
		
		$.post('/updateProfile', {
			email: email,
			pass: $("#board-pass-ph").val(),
			vpass: $("#board-vpass-ph").val()
			}, function(result){
				var color;
				if(result.success==false){
					color = "#f36e4e";
				}else{
					color = "#90EE90";
				}
				$("#save-profile").animate({width: "97%", backgroundColor: color}, 1000);
				$("#save-profile").animate({width: "97%"});
				$("#save-profile").val("").css("border", "none");
				$("#save-profile").val(result.msg);
				$("#board-pass-ph").val("");
				$("#board-vpass-ph").val("");
				setTimeout(function(){
					$("#save-profile").val("Save").css("border", "1px dashed white");
					$("#save-profile").animate({width: "100px", backgroundColor: "#5DC97F"}, 500);
					if(result.success==true){
						$("#vpass-ph, #save-profile").slideUp();
						$("#acc-info-container").animate({height: "200px"}, 500);
						$("#email-sender-tarea").val("From: "+email);
					}
				}, 2500);
		});
	});
});