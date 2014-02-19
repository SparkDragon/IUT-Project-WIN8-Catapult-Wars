function InstructionsWindow()
{
    AbstractWindow.call(this);
	
	var background;
	this.preload;
    this.canvas;
    this.context;
    this.stage;
	this.BT_retour;
	
	
	this.initializeInstructionsWindow = function()
	{
		canvas = document.getElementById("gameCanvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context = canvas.getContext("2d");
        stage = new createjs.Stage(canvas);

		preload = new createjs.LoadQueue();
        preload.addEventListener("complete", prepareInstruction);
        var manifest = [
            { id: "InstructionImage", src: "images/Textures/Backgrounds/instructions.png" },
			{ id: "retourImage", src: "images/Textures/Menu/back.png" }
        ];
        preload.loadManifest(manifest);
	}
	
	function prepareInstruction()
	{
		background = new Image();
		background.image = preload.getResult("InstructionImage");
		background.bitmap = new createjs.Bitmap(background.image);
		background.bitmap.scaleX = InstructionsWindow.SCALE_X;
		background.bitmap.scaleY = InstructionsWindow.SCALE_Y;
        stage.addChild(background.bitmap);
		
		BT_retour = new Image();
		BT_retour.image = preload.getResult("retourImage");
		BT_retour.bitmap = new createjs.Bitmap(BT_retour.image);
		BT_retour.bitmap.scaleX = InstructionsWindow.SCALE_X;
		BT_retour.bitmap.scaleY = InstructionsWindow.SCALE_Y;
		BT_retour.setX ((background.image.width * InstructionsWindow.SCALE_X / 2) - ((BT_retour.image.width * InstructionsWindow.SCALE_X) / 2));
		BT_retour.setY ((background.image.height * InstructionsWindow.SCALE_Y / 2) + 340);
        stage.addChild(BT_retour.bitmap);
		
        canvas.addEventListener("MSPointerUp", clickRetour, false);
        context.clearRect(0, 0, canvas.width, canvas.height);
        stage.update();
	}
	
	function clickRetour(event)
	{
		if (event.x > BT_retour.borderLeft && event.x < BT_retour.borderRight && event.y < BT_retour.borderBottom && event.y > BT_retour.borderTop)
		{
		    context.clearRect(0, 0, canvas.width, canvas.height);
		    stage.clear();
            canvas.removeEventListener("MSPointerUp", clickRetour, false);
			var main = new Main();
			main.initializeMenu();
		}
	}
	
}
InstructionsWindow.SCALE_X = window.innerWidth / 800;
InstructionsWindow.SCALE_Y = window.innerHeight / 480;