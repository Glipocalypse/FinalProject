// JavaScript File
/*
    Filename:  Loopiness
    Written by: Steven Frankeny
    Purpose: Learning and Having Fun
    Date: 6 Oct. 2014
    Modification History: None
    Last Modified: N/A
*/
var pictureSource;
var destinationType;

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	pictureSource=navigator.camera.PictureSourceType;
	destinationType=navigator.camera.DestinationType;
}
$(document).ready(function(){
	document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
	if (window.localStorage.getItem("highScore") == null)
		window.localStorage.setItem("highScore", 0);
	if (window.localStorage.getItem("playerColor") == null)
		window.localStorage.setItem("playerColor","#0000FF");
	if (window.localStorage.getItem("playerOpacity") == null)
		window.localStorage.setItem("playerOpacity",1);
	if (window.localStorage.getItem("usePicture") == null)
		window.localStorage.setItem("usePicture", "false");
	if (window.localStorage.getItem("playerAvatar") != null)
		$("#playerAvatar").attr("src",window.localStorage.getItem("playerAvatar"));
	$("#playerSquare").css("background-color",window.localStorage.getItem("playerColor")).css("opacity",window.localStorage.getItem("playerOpacity"));
	var playerColor = "#FFFFFF";
	var numMinesDodged = 0;
	var gameNotOver = true;
	var mineSpeed = 1;
	var songs = ["music/Suaveness!.mp3","music/Coolness!.mp3","music/Sweetness!.mp3","music/Awesomeness!.mp3","music/Ultimateness!.mp3","music/Uberness!.mp3"];
	var musicPlayer = document.getElementById("musicPlayer");
	
	
	$("#colorPicker").minicolors({
	inline: true,
	defaultValue: window.localStorage.getItem("playerColor"),
    change: function(hex, opacity) {
        $("#playerSquare").css("background-color",hex).css("opacity",opacity);
		playerColor = hex;
    }});
	$("#playerSquare").css("width","40px").css("height","40px");
	$("#playerAvatar").css("width","40px").css("height","40px");
	$("audio").bind("ended", playNextSong);
	$("#avatarScreen").hide();
	$("#instructionsScreen").hide();
	$("#gameScreen").hide();
	$("#gameOverScreen").hide();
	$("#optionsScreen").hide();
	$("#btnStartGame").bind("touchstart",startGame);
	$("#btnStartGame").bind("click", startGame);
	$("#btnInstructions").bind("touchstart",displayInstructions);
	$("#btnInstructions").bind("click", displayInstructions);
	$("#btnOptions").bind("touchstart",displayOptions);
	$("#btnOptions").bind("click",displayOptions);
	$("#btnBack").bind("touchstart",goBack);
	$("#btnBack").bind("click", goBack);
	$("#btnMainMenu").bind("touchstart",goBack);
	$("#btnMainMenu").bind("click", goBack);
	$("#btnTryAgain").bind("touchstart",restart);
	$("#btnTryAgain").bind("click", restart);
	$("#btnMute").bind("touchstart", muteUnmuteMusic)
	$("#btnMute").bind("click", muteUnmuteMusic);
	$("#btnAvatar").bind("click", displayAvatarSelect);
	$("#btnConfirmAvatar").bind("click", confirmAvatar);
	$("#btnCamera").bind("click", takePicture);
	$("#btnAvatar").bind("touchstart", displayAvatarSelect);
	$("#btnConfirmAvatar").bind("touchstart", confirmAvatar);
	$("#usePicture").bind("touchstart", function(){
		$("#usePicture").trigger("click");
		showPictureButton();
	});
	$("#usePicture").bind("click", showPictureButton);
	function showPictureButton(){
		if ($("#usePicture").is(":checked")){
			if (window.localStorage.getItem("playerAvatar") != null)
				$("#playerAvatar").attr("src",window.localStorage.getItem("playerAvatar"));
			$("#btnCamera").show();
		}
		else{
			$("#playerAvatar").attr("src","");
			$("#btnCamera").hide();
		}
	}
	function muteUnmuteMusic(){
		if (musicPlayer.paused){
			musicPlayer.play();
			$("#btnMute").text("Mute Music");
		}else{
			musicPlayer.pause();
			$("#btnMute").text("Unmute Music");
		}
	}
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
		for (i = 0; i < $("#gameScreen").width()/20; i++){
			$("<div/>", {'class': "mineSquare"}).css("width", "20px").css("height", "20px").appendTo("#gameScreen").css("left", Math.floor((Math.random()*($("#gameScreen").width()-20)))).css("top", -Math.floor((Math.random()*($("#gameScreen").height())))-25);
		}
		gameNotOver = true;
		setTimeout(timeout_trigger, 10);
		$("#playerSquare").css("left",($("#gameScreen").width()-$("#playerSquare").width())/2).css("top",window.screen.height/4);
		$("#playerSquare").draggable({ obstacle: ".mineSquare", containment: "#gameScreen" , scroll: false} );
	}
	function displayInstructions(){
		$("#menuScreen").hide();
		$("#instructionsScreen").prepend($("#btnBack"));
		$("#instructionsScreen").show();
	}
	function displayOptions(){
		$("#menuScreen").hide();
		$("#optionsScreen").prepend($("#btnBack"));
		$("#optionsScreen").show();
	}
	function displayAvatarSelect(){
		$("#optionsScreen").hide();
		$("#avatarScreen").show();
		$("#avatarScreen").prepend($("#btnBack"));
		$("#avatarPreview").prepend($("#playerSquare"));
		$("#avatarPreview").css("height","60px");
		$("#playerSquare").css("left",($("#avatarScreen").width()-$("#playerSquare").width())/2);
		$("#colorPicker").minicolors("value",window.localStorage.getItem("playerColor"));
		if(window.localStorage.getItem("usePicture") == "true"){
			if(!$("#usePicture").is(":checked")){
				$("#usePicture").trigger("click");
			}
		}else if($("#usePicture").is(":checked"))
			$("#usePicture").trigger("click");
				
		if ($("#usePicture").is(":checked"))
			$("#btnCamera").show();
		else
			$("#btnCamera").hide();
	}
	function confirmAvatar(){
		$("#avatarScreen").hide();
		displayOptions();
		$("#gameScreen").append($("#playerSquare"));
		if ($("#usePicture").is(":checked")){
			window.localStorage.setItem("playerAvatar",$("#playerAvatar").attr("src"));
			window.localStorage.setItem("usePicture","true");
		}
		else{		
			window.localStorage.setItem("playerColor",playerColor);
			window.localStorage.setItem("playerOpacity",$("#playerSquare").css("opacity"));
			window.localStorage.setItem("usePicture","false");
		}
	}
	function goBack(){
		if ($("#avatarScreen").is(":visible")){
			$("#avatarScreen").hide();
			displayOptions();
		}else{		
			$("#menuScreen").show();
			$("#instructionsScreen").hide();
			$("#gameOverScreen").hide();
			$("#optionsScreen").hide();
		}
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
	function playNextSong(){
		musicPlayer.src = songs[Math.floor(Math.random()*songs.length)];
		musicPlayer.load();
	}
	function takePicture(){
		alert("Takin' a picture!");
		navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
			destinationType: Camera.DestinationType.DATA_URL
		});

		function onSuccess(imageData) {
			var image = document.getElementById("playerAvatar");
			image.src = "data:image/jpeg;base64," + imageData;
		}

		function onFail(message) {
			alert('Failed because: ' + message);
		}
	}
});

	