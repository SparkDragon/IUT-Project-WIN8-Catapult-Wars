function StagesWindow(players)
{
    AbstractWindow.call(this);

    var background;
    var BT_lvl1;
    var BT_lvl2;
	var BT_lvl3;
	var BT_back;
	
    this.preload;
    this.canvas;
    this.context;
    this.stage;

	var nbPlayer = (typeof players === "undefined") ? 1 : players;
	
	this.initializeChoice = function()
    {
		try
		{
			canvas = document.getElementById("gameCanvas");
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			context = canvas.getContext("2d");
			stage = new createjs.Stage(canvas);

			preload = new createjs.LoadQueue();
			preload.addEventListener("complete", prepareChoice);
			var manifest = [
				{ id: "backgroundImage", src: "images/Textures/Menu/Catapult-Wars-Background.png" },
				{ id: "lvl1", src: "images/Textures/Menu/icon1.png" },
				{ id: "lvl2", src: "images/Textures/Menu/icon2.png" },
				{ id: "lvl3", src: "images/Textures/Menu/icon3.png" },
				{ id: "retourImage", src: "images/Textures/Menu/back.png" }
			];
			preload.loadManifest(manifest);
		}
		catch(e)
		{
			new Console(e, true);
		}
    }
	
	function prepareChoice()
    {
		try
		{
			background = new Image();
			background.image = preload.getResult("backgroundImage");
			background.bitmap = new createjs.Bitmap(background.image);
			background.bitmap.scaleX = Main.SCALE_X;
			background.bitmap.scaleY = Main.SCALE_Y;
			stage.addChild(background.bitmap);

			BT_lvl1 = new Image();
			BT_lvl1.image = preload.getResult("lvl1");
			BT_lvl1.bitmap = new createjs.Bitmap(BT_lvl1.image);
			BT_lvl1.bitmap.scaleX = Main.SCALE_X;
			BT_lvl1.bitmap.scaleY = Main.SCALE_Y;
			BT_lvl1.setX((background.image.width * Main.SCALE_X / 2) - ((BT_lvl1.image.width * Main.SCALE_X)/ 2) - 300);
			BT_lvl1.setY((background.image.height * Main.SCALE_Y / 2) + 90);
			stage.addChild(BT_lvl1.bitmap);

			BT_lvl2 = new Image();
			BT_lvl2.image = preload.getResult("lvl2");
			BT_lvl2.bitmap = new createjs.Bitmap(BT_lvl2.image);
			BT_lvl2.bitmap.scaleX = Main.SCALE_X;
			BT_lvl2.bitmap.scaleY = Main.SCALE_Y;
			BT_lvl2.setX((background.image.width * Main.SCALE_X / 2) - ((BT_lvl2.image.width * Main.SCALE_X)/ 2));
			BT_lvl2.setY((background.image.height * Main.SCALE_Y / 2) + 90);
			stage.addChild(BT_lvl2.bitmap);
			
			BT_lvl3 = new Image();
			BT_lvl3.image = preload.getResult("lvl3");
			BT_lvl3.bitmap = new createjs.Bitmap(BT_lvl3.image);
			BT_lvl3.bitmap.scaleX = Main.SCALE_X;
			BT_lvl3.bitmap.scaleY = Main.SCALE_Y;
			BT_lvl3.setX((background.image.width * Main.SCALE_X / 2) - ((BT_lvl3.image.width * Main.SCALE_X)/ 2) + 300);
			BT_lvl3.setY((background.image.height * Main.SCALE_Y / 2) + 90);
			stage.addChild(BT_lvl3.bitmap);
			
			BT_back = new Image();
			BT_back.image = preload.getResult("retourImage");
			BT_back.bitmap = new createjs.Bitmap(BT_back.image);
			BT_back.bitmap.scaleX = InstructionsWindow.SCALE_X;
			BT_back.bitmap.scaleY = InstructionsWindow.SCALE_Y;
			BT_back.setX ((background.image.width * InstructionsWindow.SCALE_X / 2) - ((BT_back.image.width * InstructionsWindow.SCALE_X) / 2));
			BT_back.setY ((background.image.height * InstructionsWindow.SCALE_Y / 2) + 340);
			stage.addChild(BT_back.bitmap);


			canvas.addEventListener("MSPointerUp", TestBouton, false);
			
			stage.update();
		}
		catch(e)
		{
			new Console(e, true);
		}
	}
	
	function InButton(event, button)
	{
	    return (event.x > button.borderLeft && event.x < button.borderRight && event.y < button.borderBottom && event.y > button.borderTop);
	}

	function TestBouton(event)
	{
	    if (InButton(event, BT_lvl1))
	    {
	        clickJouer(nbPlayer, 5, 1); 
	    }
        if (InButton(event, BT_lvl2))
	    {
	        clickJouer(nbPlayer, 0, 2); 
	    }
		if (InButton(event, BT_lvl3))
	    {
	        clickJouer(nbPlayer,0, 3); 
	    }
		if (InButton(event, BT_back))
	    {
	        clickRetour(); 
	    }
	}
	
	function clickRetour()
	{
		try
		{
			context.clearRect(0, 0, canvas.width, canvas.height);
			stage.clear();
			canvas.removeEventListener("MSPointerUp", TestBouton, false);
			Main.instance = new Main();
			Main.instance.initializeMenu();
		}
		catch(e)
		{
			new Console(e, true);
		}
	}
	
	function clickJouer(nbJoueur, clouds, stage)
	{
	    try
		{
			canvas.removeEventListener("MSPointerUp", TestBouton, false);
	        Game.instance = new Game(nbJoueur, clouds, stage);
		    Game.instance.initializeGame();
		}
		catch(e)
		{
			new Console(e, true);
		}
	}
}