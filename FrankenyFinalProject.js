// JavaScript File
/*
    Filename:  Loopiness
    Written by: Steven Frankeny
    Purpose: Learning and Having Fun
    Date: 6 Oct. 2014
    Modification History: None
    Last Modified: N/A
*/
$(document).ready(function(){
	document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
	if (window.localStorage.getItem("highScore") == null)
		window.localStorage.setItem("highScore", 0);
	var numMinesDodged = 0;
	var gameNotOver = true;
	var mineSpeed = 1;
	$("#instructionsScreen").hide();
	$("#gameScreen").hide();
	$("#gameOverScreen").hide();
	$("#btnStartGame").bind("touchstart",startGame);
	$("#btnStartGame").bind("click", startGame);
	$("#btnInstructions").bind("touchstart",displayInstructions);
	$("#btnInstructions").bind("click", displayInstructions);
	$("#btnBack").bind("touchstart",showMainMenu);
	$("#btnBack").bind("click", showMainMenu);
	$("#btnMainMenu").bind("touchstart",showMainMenu);
	$("#btnMainMenu").bind("click", showMainMenu);
	$("#btnTryAgain").bind("touchstart",restart);
	$("#btnTryAgain").bind("click", restart);
	function touchHandler(event) {
    var touch = event.changedTouches[0];

    var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
    }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
	}
		
	function startGame(){
		$("#btnStartGame").unbind("touchstart",startGame);
		$("#btnStartGame").unbind("click", startGame);
		$("#btnStartGame").bind("touchstart",restart);
		$("#btnStartGame").bind("click", restart);
		$("#menuScreen").hide();
		$("#gameScreen").show();
		$("#gameScreen").css("height",window.screen.height);
		for (i = 0; i < $("#gameScreen").width()/10; i++){
			$("<div/>", {'class': "mineSquare"}).css("width", "20px").css("height", "20px").appendTo("#gameScreen").css("left", Math.floor((Math.random()*($("#gameScreen").width()-20)))).css("top", -Math.floor((Math.random()*($("#gameScreen").height())))-25);
		}
		gameNotOver = true;
		numSquaresTapped = 0;
		setTimeout(timeout_trigger, 10);
		$("#playerSquare").css("width","40px").css("height","40px");
		$("#playerSquare").css("left",($("#gameScreen").width()-$("#playerSquare").width())/2).css("top",window.screen.height/4);
		$("#playerSquare").draggable({ obstacle: ".mineSquare", containment: "#gameScreen" , scroll: false} );
	}
	function displayInstructions(){
		$("#menuScreen").hide();
		$("#instructionsScreen").show();
	}
	function showMainMenu(){
		$("#menuScreen").show();
		$("#instructionsScreen").hide();
		$("#gameOverScreen").hide();
	}
	function timeout_trigger(){
		if (gameNotOver)
		{
			mineSpeed = numMinesDodged/100 + 2;
			$(".mineSquare").each(function(){
				$(this).css("top", $(this).position().top + mineSpeed);
				if($(this).collision($("#playerSquare")).width()> 0){
					gameNotOver = false;
					$("#playerSquare").draggable('disable');
					$(document).trigger("mouseup");
				}
				if ($(this).position().top > $("#gameScreen").height()){
					$(this).css("left", Math.floor((Math.random()*($("#gameScreen").width()-20)))).css("top", -Math.floor((Math.random()*($("#gameScreen").height())))-25);
					numMinesDodged++;
				}
			});
			$("#mineCount").text(numMinesDodged);
			setTimeout(timeout_trigger, 10);
		}else{
			$("#playerSquare").fadeOut(2000, displayGameOverScreen);
		}
	}
	function displayGameOverScreen(){
		$("#gameScreen").hide();
		$("#gameOverScreen").show();
		if (numMinesDodged > window.localStorage.getItem("highScore"))
			window.localStorage.setItem("highScore", numMinesDodged);
		$("#gameSummary").html("You dodged " + numMinesDodged + " mines!<br/>High Score: " + window.localStorage.getItem("highScore"));
	}
	function restart(){
		$("#menuScreen").hide();
		$("#gameOverScreen").hide();
		$("#gameScreen").show();
		gameNotOver = true;
		$(".mineSquare").each(function(){
			$(this).css("left", Math.floor((Math.random()*($("#gameScreen").width()-20)))).css("top", -Math.floor((Math.random()*($("#gameScreen").height())))-25);
		});
		$("#playerSquare").css("left",($("#gameScreen").width()-$("#playerSquare").width())/2).css("top",window.screen.height/4);
		$("#playerSquare").draggable('enable');
		$("#playerSquare").show();
		numMinesDodged = 0;
		setTimeout(timeout_trigger, 10);
	}
});

	