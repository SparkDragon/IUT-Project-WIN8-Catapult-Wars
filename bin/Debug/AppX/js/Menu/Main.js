
function Main()
{

    var background;
    var BT_1Player;
    var BT_2Player;
	var BT_instruction;
	var BT_quitter;
	var ImgLoad;
    this.preload;
    this.canvas;
    this.context;
    this.stage;

    this.initializeMenu = function()
    {
		canvas = document.getElementById("gameCanvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context = canvas.getContext("2d");
        stage = new createjs.Stage(canvas);

        preload = new createjs.LoadQueue();
        preload.addEventListener("complete", prepareMenu);
        var manifest = [
            { id: "backgroundImage", src: "images/Textures/Menu/Catapult-Wars-Background.png" },
            { id: "singlePlayer", src: "images/Textures/Menu/SinglePlayer.png" },
            { id: "multiPlayer", src: "images/Textures/Menu/MultiPlayer.png" },
            { id: "instructionImage", src: "images/Textures/Menu/Instructions.png" }
        ];
        preload.loadManifest(manifest);
    }
	
	function prepareMenu()
    {
	    background = new Image();
		background.image = preload.getResult("backgroundImage");
		background.bitmap = new createjs.Bitmap(background.image);
		background.bitmap.scaleX = Main.SCALE_X;
		background.bitmap.scaleY = Main.SCALE_Y;
        stage.addChild(background.bitmap);

		BT_1Player = new Image();
		BT_1Player.image = preload.getResult("singlePlayer");
		BT_1Player.bitmap = new createjs.Bitmap(BT_1Player.image);
		BT_1Player.bitmap.scaleX = Main.SCALE_X;
		BT_1Player.bitmap.scaleY = Main.SCALE_Y;
		BT_1Player.setX((background.image.width * Main.SCALE_X / 2) - ((BT_1Player.image.width * Main.SCALE_X)/ 2));
		BT_1Player.setY((background.image.height * Main.SCALE_Y / 2) + 90);
		stage.addChild(BT_1Player.bitmap);

        BT_2Player = new Image();
		BT_2Player.image = preload.getResult("multiPlayer");
		BT_2Player.bitmap = new createjs.Bitmap(BT_2Player.image);
		BT_2Player.bitmap.scaleX = Main.SCALE_X;
		BT_2Player.bitmap.scaleY = Main.SCALE_Y;
		BT_2Player.setX((background.image.width * Main.SCALE_X / 2) - ((BT_2Player.image.width * Main.SCALE_X)/ 2));
		BT_2Player.setY((background.image.height * Main.SCALE_Y / 2) + 220);
        stage.addChild( BT_2Player.bitmap);
		
        BT_instruction = new Image();
		BT_instruction.image = preload.getResult("instructionImage");
		BT_instruction.bitmap = new createjs.Bitmap(BT_instruction.image);
		BT_instruction.bitmap.scaleX = Main.SCALE_X;
		BT_instruction.bitmap.scaleY = Main.SCALE_Y;
		BT_instruction.setX ((background.image.width * Main.SCALE_X / 2) - ((BT_instruction.image.width * Main.SCALE_X) / 2));
		BT_instruction.setY ((background.image.height * Main.SCALE_Y / 2) + 350);
        stage.addChild(BT_instruction.bitmap);
		
        ImgLoad = new Image();
		ImgLoad.image = preload.getResult("singlePlayer");
		ImgLoad.bitmap = new createjs.Bitmap(ImgLoad.image);
		ImgLoad.bitmap.scaleX = Main.SCALE_X;
		ImgLoad.bitmap.scaleY = Main.SCALE_Y;
		ImgLoad.setX((background.image.width * Main.SCALE_X / 2) - ((ImgLoad.image.width * Main.SCALE_X)/ 2));
		ImgLoad.setY((background.image.height * Main.SCALE_Y / 2));
		


        canvas.addEventListener("MSPointerUp", TestBouton, false);
        
        stage.update();
	}
	
	function InButton(event, button)
	{
	    return (event.x > button.borderLeft && event.x < button.borderRight && event.y < button.borderBottom && event.y > button.borderTop);
	}

	function TestBouton(event)
	{
	    if (InButton(event, BT_1Player))
	    {
	        clickJouer(1); 
	    }
        if (InButton(event, BT_2Player))
        {
	        clickJouer(2); 
	    }
	    if (InButton(event, BT_instruction))
	    {
	        clickInstruction(); 
	    }
	}

	function clickJouer(nbJoueur)
	{
	    
	    canvas.removeEventListener("MSPointerUp", TestBouton, false);
	    
	    var game = new Game(nbJoueur);
		game.initializeGame();
	}
	
	function clickInstruction()
	{
	    
	    canvas.removeEventListener("MSPointerUp", TestBouton, false);
	    stage.clear();
		var instructionWindow = new InstructionsWindow();
		instructionWindow.initializeInstructionsWindow();
	}
}

Main.SCALE_X = window.innerWidth / 800;
Main.SCALE_Y = window.innerHeight / 480;