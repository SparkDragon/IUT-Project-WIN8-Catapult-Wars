function Game(players)
{
    var title;
    var p1Lives, p1Name;
    var p2Lives, p2Name;
    var background;
    var p1LivesI, p2LivesI;
    var coeur, coeur2;

    var clouds;

    var playerTurn = 1;			// Who's turn is it ?
    var playerFire = false;		// Does player 1 is firing ?
	
    var nbPlayer = (typeof players === "undefined") ? 1 : players;

	this.ammo;
    this.player1;
    this.player2;
	preload = new createjs.LoadQueue();

    this.canvas;
    this.context;
    this.stage;

    function getCurrentPlayer()
    {
        if (playerTurn == 1)
            return this.player1;
        else
            return this.player2;
    }

    function startGame()
    {
		try
		{
			createjs.Ticker.setInterval(window.requestAnimationFrame);
			createjs.Ticker.addListener(Gameloop);
		}
		catch(e)
		{
			createjs.Ticker.setPaused(true);
			new Console(e, true);
		}
    }

    this.initializeGame = function()
    {
		try
		{
			canvas = document.getElementById("gameCanvas");
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			context = canvas.getContext("2d");
			stage = new createjs.Stage(canvas);
			clouds = new Clouds();

			preload.addEventListener("complete", prepareGame);
			var manifest = [
				{ id: "screenImage", src: "images/Textures/Backgrounds/gameplay_screen1.png" },
				{ id: "redImage", src: "images/Textures/Catapults/Red/redIdle/redIdle.png" },
				{ id: "blueImage", src: "images/Textures/Catapults/Blue/blueIdle/blueIdle.png" },
				{ id: "ammoImage", src: "images/Textures/Ammo/rock_ammo.png" },
				{ id: "winImage", src: "images/Textures/Backgrounds/victory.png" },
				{ id: "loseImage", src: "images/Textures/Backgrounds/defeat.png" },
				{ id: "blueFire", src: "images/Textures/Catapults/Blue/blueFire/blueCatapult_fire.png" },
				{ id: "redFire", src: "images/Textures/Catapults/Red/redFire/redCatapult_fire.png" },
				{ id: "c1Image", src: "images/Textures/Backgrounds/cloud1.png" },
				{ id: "c2Image", src: "images/Textures/Backgrounds/cloud2.png" },
				{ id: "c3Image", src: "images/Textures/Backgrounds/cloud3.png" },
				{ id: "c4Image", src: "images/Textures/Backgrounds/cloud4.png" },
				{ id: "p1Live", src: "images/Textures/Backgrounds/hudBackground.png" },
				{ id: "screenTitle", src: "images/Textures/Backgrounds/title_screen2.png" },
				{ id: "coeur", src: "images/Textures/Backgrounds/coeur.gif" },
				
				{ id: "hitSound", src: SoundManager.getInstance().sounds["hit"]["path"]},
				{ id: "explodeSound", src: SoundManager.getInstance().sounds["explode"]["path"]},
				{ id: "fireSound", src: SoundManager.getInstance().sounds["fire"]["path"]},
				{ id: "loseSound", src: SoundManager.getInstance().sounds["lose"]["path"]},
				{ id: "aimSound", src: SoundManager.getInstance().sounds["aim"]["path"]},
				{ id: "winSound", src: SoundManager.getInstance().sounds["win"]["path"]},
			];

			for (var i = 1; i < 20; ++i)
            {
                manifest.push({ id: "redCatapult" + i, src: "images/Textures/Catapults/Red/redAimAnimation/catapult" + i + ".png" });
                manifest.push({ id: "blueCatapult" + i, src: "images/Textures/Catapults/Blue/blueAimAnimation/catapult" + i + ".png" });
            }

			preload.loadManifest(manifest);
		}
		catch(e)
		{
			new Console(e, true);
		}
    }
	
	function startEventListeners()
	{
		canvas.addEventListener("MSPointerUp", endAim, false);
		canvas.addEventListener("MSPointerMove", adjustAim, false);
		canvas.addEventListener("MSPointerDown", beginAim, false);
	}
	
	function stopEventListeners()
	{
		canvas.removeEventListener("MSPointerUp", endAim, false);
		canvas.removeEventListener("MSPointerMove", adjustAim, false);
		canvas.removeEventListener("MSPointerDown", beginAim, false);
	}

    function prepareGame()
    {
        try
		{
            player1 = new CatapultHuman(preload.getResult("redImage"), Game.LIVES_PER_PLAYER, "left");

            if (nbPlayer == 2)
                player2 = new CatapultHuman(preload.getResult("blueImage"), Game.LIVES_PER_PLAYER, "right");
            else
                player2 = new CatapultCPU(preload.getResult("blueImage"), Game.LIVES_PER_PLAYER, "right");

			startEventListeners();

			//Draw background first (other items appear on top)
			
			background = new Image();
			background.image = preload.getResult("screenImage");
			background.bitmap = new createjs.Bitmap(background.image);
			background.bitmap.scaleX = Game.SCALE_X;
			background.bitmap.scaleY = Game.SCALE_Y;
			stage.addChild(background.bitmap);

			//Draw Player 1 Catapult
			stage.addChild(player1.bitmap);

			//Draw Player 2 Catapult
			stage.addChild(player2.bitmap);

			
            // Player 1 Live board
			p1LivesI = new Image();
			p1LivesI.image = preload.getResult("p1Live");
			p1LivesI.bitmap = new createjs.Bitmap(p1LivesI.image);
			p1LivesI.bitmap.scaleX = Game.SCALE_X;
			p1LivesI.bitmap.scaleY = Game.SCALE_Y;
			p1LivesI.bitmap.x = Game.SCALE_X;
			p1LivesI.bitmap.y = Game.SCALE_Y;
			stage.addChild(p1LivesI.bitmap);

            // Player 1 Heart
			coeur = new Image();
			coeur.image = preload.getResult("coeur");
			coeur.bitmap = new createjs.Bitmap(coeur.image);
			coeur.bitmap.scaleX = Game.SCALE_X / 1.5;
			coeur.bitmap.scaleY = Game.SCALE_Y / 1.5;
			coeur.bitmap.x = p1LivesI.bitmap.x * 40;
			coeur.bitmap.y = p1LivesI.bitmap.y * 35;
			stage.addChild(coeur.bitmap);

            // Player 1 Lives
			p1Lives = new createjs.Text(player1.getLives(), "30px Arial", "red");
			p1Lives.scaleX = Game.SCALE_X;
			p1Lives.scaleY = Game.SCALE_Y;
			p1Lives.x = p1LivesI.bitmap.x * 115;
			p1Lives.y = p1LivesI.bitmap.y * 35;
			stage.addChild(p1Lives);

            // Player 1 Name
			p1Name = new createjs.Text("Player 1", "19px Arial", "red");
			p1Name.scaleX = Game.SCALE_X;
			p1Name.scaleY = Game.SCALE_Y;
			p1Name.x = p1LivesI.bitmap.x * 57;
			p1Name.y = p1LivesI.bitmap.y * 4;
			stage.addChild(p1Name);

            // Player 2 Live board
			p2LivesI = new Image();
			p2LivesI.image = preload.getResult("p1Live");
			p2LivesI.bitmap = new createjs.Bitmap(p2LivesI.image);
			p2LivesI.bitmap.scaleX = Game.SCALE_X;
			p2LivesI.bitmap.scaleY = Game.SCALE_Y;
			p2LivesI.bitmap.x = canvas.width - p2LivesI.image.height * Game.SCALE_X * 2.15;
			p2LivesI.bitmap.y = Game.SCALE_Y;
			stage.addChild(p2LivesI.bitmap);

            // Player 2 Heart
			coeur2 = new Image();
			coeur2.image = preload.getResult("coeur");
			coeur2.bitmap = new createjs.Bitmap(coeur2.image);
			coeur2.bitmap.scaleX = Game.SCALE_X / 1.5;
			coeur2.bitmap.scaleY = Game.SCALE_Y / 1.5;
			coeur2.bitmap.x = p2LivesI.bitmap.x * 1.065;
			coeur2.bitmap.y = p2LivesI.bitmap.y * 35;
			stage.addChild(coeur2.bitmap);

            // Player 2 Lives
			p2Lives = new createjs.Text(player2.getLives(), "30px Arial", "blue");
			p2Lives.scaleX = Game.SCALE_X;
			p2Lives.scaleY = Game.SCALE_Y;
			p2Lives.x = p2LivesI.bitmap.x * 1.185;
			p2Lives.y = p2LivesI.bitmap.y * 35;
			stage.addChild(p2Lives);

            // Player 2 Name
			p2Name = new createjs.Text("Player 2", "19px Arial", "blue");
			p2Name.scaleX = Game.SCALE_X;
			p2Name.scaleY = Game.SCALE_Y;
			p2Name.x = p2LivesI.bitmap.x * 1.09;
			p2Name.y = p2LivesI.bitmap.y * 4;
			stage.addChild(p2Name);

            // Game Title
			title = new Image();
			title.image = preload.getResult("screenTitle");
			title.bitmap = new createjs.Bitmap(title.image);
			title.bitmap.scaleX = Game.SCALE_X / 2.5;
			title.bitmap.scaleY = Game.SCALE_Y / 2.5;
			title.bitmap.x = Game.SCALE_X * 275;
			title.bitmap.y = Game.SCALE_Y;
			stage.addChild(title.bitmap);

			ammo = new Ammo(preload.getResult("ammoImage"));

			//Add the boulder, but hide for now
			stage.addChild(ammo.bitmap);

			// Clouds
			var image1 = preload.getResult("c1Image");
			var image2 = preload.getResult("c2Image");
			var image3 = preload.getResult("c3Image");
			var image4 = preload.getResult("c4Image");
			clouds.initializeClouds([image1, image2, image3, image4]);

			stage.update();

			startGame();
        }
        catch (e) {
            new Console(e, true);
        }
    }

	function beginAim(event)
	{
		try
		{
			if (!ammo.isShotFlying())	// The ammo is in the air --> Let's move the ammo
			{
			    getCurrentPlayer().beginAim(event);
			}
		}
		catch(e)
		{
			new Console(e, true);
		}
	}
	
	function adjustAim(event)
	{
		try
		{
			getCurrentPlayer().adjustAim(event);
		}
		catch(e)
		{
			new Console(e, true);
		}
	}
	
	function endAim(event)
	{
		try
		{
			if (getCurrentPlayer().isAiming)
			{
			    if (getCurrentPlayer().endAim(event))
                {
				    playerFire = false;
				    SoundManager.getInstance().playSound("fire");
                }
			}
		}
		catch(e)
		{
			new Console(e, true);
		}
	}

    function checkHit(player)
    {
        // EaselJS hitTest() method doesn't factor in scaling,
        // so we'll use simple bounding box vs center of rock

        // Get center of rock
        var shotX = ammo.bitmap.x + ammo.bitmap.image.width / 2;
        var shotY = ammo.bitmap.y + ammo.bitmap.image.height / 2;

        // return wheter center of rock is in rectangle bounding target player
        return (((shotX >= player.borderLeft) &&
                (shotX <= player.borderRight))
            && ((shotY >= player.borderTop) &&
                (shotY <= player.borderBottom)));
    }

    function processHit()
    {
		try
		{
			SoundManager.getInstance().playSound("hit");
			ammo.endShot();
			changePlayerTurn();

			if ((player1.getLives() <= 0 || player2.getLives() <= 0))
			{
				endGame();
			}
		}
		catch(e)
		{
			new Console(e, true);
		}
    }
	
	function changePlayerTurn()
    {
	    playerTurn = playerTurn%2 +1;    // Change player
		if (nbPlayer == 1)
		{
			if (playerTurn == 2)
			{
				stopEventListeners();
            }
			else
				startEventListeners();
		}
	}

	// Move the ammo or wait the player 1 to fire
    function update()
    {
        clouds.update();
        
        if (!getCurrentPlayer().replaced)
            getCurrentPlayer().replaceAnimationAfterShot();

		if (ammo.isShotFlying())	// The ammo is in the air --> Let's move the ammo
		{
			if (!ammo.move())	// If the ammo stop moving (shot over)
			{
			    changePlayerTurn();
			}
			else if (playerTurn == 1)	// Player 1 is playing
			{
				if (checkHit(player2))
				{
					// Hit
					player2.loseLife(1);
					p2Lives.text = player2.getLives();
					processHit();
				}
			}
			else if (playerTurn == 2)	// Player 2 is playing
			{
				if (checkHit(player1))
				{
					// Hit
					player1.loseLife(1);
					p1Lives.text = player1.getLives();
					processHit();
				}
			}
		}

		else if (getCurrentPlayer().isShooting)
		{
		    var aimVector = getCurrentPlayer().nextAnimationToShoot();
		    if (aimVector)
                ammo.initializeShot(getCurrentPlayer(), aimVector, getCurrentPlayer());
		}
        
        else if (nbPlayer == 1 && playerTurn == 2)
        {
            if (!getCurrentPlayer().isAiming)
                player2.beginAim();
            else
            {
                if (getCurrentPlayer().adjustAim())
                {
		            var aimVector = getCurrentPlayer().nextAnimationToShoot();
		            if (aimVector)
		                ammo.initializeShot(getCurrentPlayer(), aimVector, getCurrentPlayer());
                }
            }
        }
    }

    function draw()
    {
        stage.update();
    }

    function endGame()
    {
		try
		{
			createjs.Ticker.setPaused(true); // Stop the game loop

			// Show win/lose graphic
			var endGameImage;
			if (player1.getLives() <= 0)
			{
				endGameImage = preload.getResult("loseImage");
				SoundManager.getInstance().playSound("lose");
			}
			else if (player2.getLives() <= 0)
			{
				endGameImage = preload.getResult("winImage");
				SoundManager.getInstance().playSound("win");
			}
			var endGameBitmap = new createjs.Bitmap(endGameImage);

			endGameBitmap.x = (canvas.width / 2) - (endGameImage.width * Game.SCALE_X / 2);
			endGameBitmap.y = (canvas.height / 2) - (endGameImage.height * Game.SCALE_Y / 2);
			endGameBitmap.scaleX = Game.SCALE_X;
			endGameBitmap.scaleY = Game.SCALE_Y;

			stage.addChild(endGameBitmap);
			stage.update();
		}
		catch(e)
		{
			new Console(e, true);
		}
    }

    function Gameloop()
    {
		try
		{
			update();
			draw();
		}
		catch(e)
		{
			new Console(e, true);
		}
    }
}

Game.SCALE_X = window.innerWidth / 800;
Game.SCALE_Y = window.innerHeight / 480;
Game.MARGIN = 25;
Game.GROUND_Y = 390 * Game.SCALE_Y;
Game.LIVES_PER_PLAYER = 3;