function Console(info, display, backgroundColor, textColor, textStyle)
{
	this.info = info;
	this.display = (typeof(display)==='undefined') ? false : display;
	this.backgroundColor = (typeof(backgroundColor)==='undefined') ? "#FF0000" : backgroundColor;
	this.textColor = (typeof(textColor)==='undefined') ? "#FFFFFF" : textColor;
	this.textStyle = (typeof(textStyle)==='undefined') ? "20px sans-serif" : textStyle;
	
	this.display = function () {
	    canvas = document.getElementById("gameCanvas");
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	    context = canvas.getContext("2d");
	    context.clearRect(0, 0, canvas.width, canvas.height);
	    stage = new createjs.Stage(canvas);

	    canvas.style.backgroundColor = this.backgroundColor;

	    // Error Text
	    infoText = new createjs.Text(this.info, this.textStyle, this.textColor);
	    //infoText.scaleX = Game.SCALE_X;
	    //infoText.scaleY = Game.SCALE_Y;
	    infoText.x = Game.MARGIN;
	    infoText.y = Game.MARGIN * Game.SCALE_Y;
	    stage.addChild(infoText);
	    stage.update();
	}

	if (this.display)
		this.display();
}