function Game(players, nbClouds, background)
{
    var p1Lives;	// Nb lives for player 1 (text)
    var p1Name;		// Name for player 1
    var p2Lives;	// Nb lives for player 2 (text)
    var p2Name;		// Name for player 2
    var background;	// Background of the stage
    var p1LivesI;	// Frame containing  informations about lives remaining for player 1
    var p2LivesI;	// Frame containing  informations about lives remaining for player 2
    var heart;		// Heart picture for player 1
    var heart2;		// Heart picture for player 2
    var back;		// Back button picture
    var clouds;		// Clouds
    var playerTurn = 1;			// Who's turn is it ?
    var playerFire = false;		// Does player 1 is firing ?
    var nbPlayer = (typeof players === "undefined") ? 1 : players;	// player number
    var backgroundNum = (typeof background === "undefined") ? 1 : background;	// Background number (associated with stage)
    var ammo;	// The only ammo
    var player1;	// Player 1
    var player2;	// Player 2
    preload = new createjs.LoadQueue();
    this.canvas;	// The canvas
    this.context;	// The canvas context
    this.stage;		// The stage (CreateJS object)
    var arrow1;     // Red arrow
    var arrow2;     // Blue arrow
    var sensArrow = -1;
    var minArrow;
    var maxArrow;

    function getCurrentPlayer()	// Return current player
    {
		try
		{
			if (playerTurn == 1)	// We must return player 1
				return player1;
			else					// We must return player 2
				return player2;
		}
		catch(e)
		{
			createjs.Ticker.setPaused(true);
			new Console("Erreur lors de la récupération du joueur actuel : " + e, true);
		}
    }

    function getNextPlayer()	// Return next player
    {
		try
		{
			if (playerTurn == 1)	// We must return player 2
				return player2;
			else					// We must return player 1
				return player1;
		}
		catch(e)
		{
			createjs.Ticker.setPaused(true);
			new Console("Erreur lors de la récupération du prochain joueur : " + e, true);
		}
    }

    function startGame()	// Start the game when initialized
    {
		try
		{
		    createjs.Ticker.setInterval(18);
			createjs.Ticker.addListener(Gameloop);
		}
		catch(e)
		{
			createjs.Ticker.setPaused(true);
			new Console("Erreur lors du démarrage du jeu : " + e, true);
		}
    }

    this.initializeGame = function()	// Initialize the game
    {
		try
		{
			this.canvas = document.getElementById("gameCanvas");
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			context = this.canvas.getContext("2d");
			this.stage = new createjs.Stage(this.canvas);
			clouds = new Clouds(nbClouds);
		}
		catch(e)
		{
		    new Console("Erreur lors de l'initialisation du jeu : " + e, true);
		    return false;
		}

		try	// About preload
		{
		    switch (backgroundNum) {
		        case 2:
		            var background = "images/Textures/Backgrounds/gameplay_screen2.png";
		            break;
		        case 3:
		            var background = "images/Textures/Backgrounds/gameplay_screen3.png";
		            break;
		        default:
		            var background = "images/Textures/Backgrounds/gameplay_screen1.png";
		            break;
		    }
			preload.addEventListener("complete", prepareGame);
			var manifest = [
				{ id: "screenImage", src: background },
				{ id: "redImage", src: "images/Textures/Catapults/Red/redIdle/redIdle.png" },
				{ id: "blueImage", src: "images/Textures/Catapults/Blue/blueIdle/blueIdle.png" },
				{ id: "ammoImage", src: "images/Textures/Ammo/rock_ammo.png" },
				{ id: "winImage", src: "images/Textures/Backgrounds/victory.png" },
				{ id: "loseImage", src: "images/Textures/Backgrounds/defeat.png" },
				{ id: "player1wins", src: "images/Textures/Backgrounds/player1wins.png" },
				{ id: "player2wins", src: "images/Textures/Backgrounds/player2wins.png" },
				{ id: "blueFire", src: "images/Textures/Catapults/Blue/blueFire/blueCatapult_fire.png" },
				{ id: "redFire", src: "images/Textures/Catapults/Red/redFire/redCatapult_fire.png" },
                { id: "blueDestroy", src: "images/Textures/Catapults/Blue/blueDestroyed/blueCatapult_destroyed.png" },
				{ id: "redDestroy", src: "images/Textures/Catapults/Red/redDestroyed/redCatapult_destroyed.png" },
				{ id: "c1Image", src: "images/Textures/Backgrounds/cloud1.png" },
				{ id: "c2Image", src: "images/Textures/Backgrounds/cloud2.png" },
				{ id: "c3Image", src: "images/Textures/Backgrounds/cloud3.png" },
				{ id: "c4Image", src: "images/Textures/Backgrounds/cloud4.png" },
				{ id: "p1Live", src: "images/Textures/Backgrounds/hudBackground.png" },
				{ id: "heart", src: "images/Textures/Backgrounds/coeur.gif" },
                { id: "backButton", src:"images/Textures/HUD/backbutton.png" },
				{ id: "redTurn", src: "images/Textures/Catapults/Red/RedTurn.png" },
                { id: "blueTurn", src: "images/Textures/Catapults/Blue/BlueTurn.png" },

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
			new Console("Erreur lors du chargement des sons/images : " + e, true);
		}
    }
	
	function startEventListeners()	// Start every event listeners
	{
		try
		{
			this.canvas.addEventListener("MSPointerUp", onPointerUp, false);
			this.canvas.addEventListener("MSPointerMove", onPointerMove, false);
			this.canvas.addEventListener("MSPointerDown", onPointerDown, false);
		}
		catch(e)
		{
			createjs.Ticker.setPaused(true);
			new Console("Erreur lors du démarrage des event listeners : " + e, true);
		}
	}
	
	function stopEventListeners()	// Stop every event listeners
	{
		try
		{
			this.canvas.removeEventListener("MSPointerUp", onPointerUp, false);
			this.canvas.removeEventListener("MSPointerMove", onPointerMove, false);
			this.canvas.removeEventListener("MSPointerDown", onPointerDown, false);
			this.canvas.removeEventListener("MSPointerUp", onBackButtonPressed, false);
		}
		catch(e)
		{
			createjs.Ticker.setPaused(true);
			new Console("Erreur lors de l'arrêt des event listeners : " + e, true);
		}
	}

    function prepareGame()	// Prepare the game
    {
        try	// Init player 1
		{
            player1 = new CatapultHuman(preload.getResult("redDestroy"),preload.getResult("redImage"), Game.LIVES_PER_PLAYER, "left");
            player1.canShot = true;
		}
		catch(e)
		{
		    new Console("Erreur lors de l'instanciation du joueur 1 : " + e, true);
		    return false;
		}
		
        try	// Init player 2
		{
            if (nbPlayer == 2)
                player2 = new CatapultHuman(preload.getResult("blueDestroy"), preload.getResult("blueImage"), Game.LIVES_PER_PLAYER, "right");
            else
                player2 = new CatapultCPU(preload.getResult("blueDestroy"), preload.getResult("blueImage"), Game.LIVES_PER_PLAYER, "right");
            player2.canShot = false;
			
		}
		catch(e)
		{
		    new Console("Erreur lors de l'instanciation du joueur 2 : " + e, true);
		    return false;
		}
		
		try	// Insert pictures
		{
			//Draw background first (other items appear on top)
			
			background = new Image();
			background.image = preload.getResult("screenImage");
			background.bitmap = new createjs.Bitmap(background.image);
			background.bitmap.scaleX = Game.SCALE_X;
			background.bitmap.scaleY = Game.SCALE_Y;
			this.stage.addChild(background.bitmap);

			//Draw Player 1 Catapult
			this.stage.addChild(player1.bitmap);

			//Draw Player 2 Catapult
			this.stage.addChild(player2.bitmap);

			
            // Player 1 Live board
			p1LivesI = new Image();
			p1LivesI.image = preload.getResult("p1Live");
			p1LivesI.bitmap = new createjs.Bitmap(p1LivesI.image);
			p1LivesI.bitmap.scaleX = Game.SCALE_X;
			p1LivesI.bitmap.scaleY = Game.SCALE_Y;
			p1LivesI.bitmap.x = Game.SCALE_X;
			p1LivesI.bitmap.y = Game.SCALE_Y;
			this.stage.addChild(p1LivesI.bitmap);

            // Player 1 Heart
			heart = new Image();
			heart.image = preload.getResult("heart");
			heart.bitmap = new createjs.Bitmap(heart.image);
			heart.bitmap.scaleX = Game.SCALE_X / 1.5;
			heart.bitmap.scaleY = Game.SCALE_Y / 1.5;
			heart.bitmap.x = p1LivesI.bitmap.x * 40;
			heart.bitmap.y = p1LivesI.bitmap.y * 35;
			this.stage.addChild(heart.bitmap);

            // Player 1 Lives
			p1Lives = new createjs.Text(player1.getLives(), "30px Arial", "red");
			p1Lives.scaleX = Game.SCALE_X;
			p1Lives.scaleY = Game.SCALE_Y;
			p1Lives.x = p1LivesI.bitmap.x * 115;
			p1Lives.y = p1LivesI.bitmap.y * 35;
			this.stage.addChild(p1Lives);

            // Player 1 Name
			p1Name = new createjs.Text("Player 1", "19px Arial", "red");
			p1Name.scaleX = Game.SCALE_X;
			p1Name.scaleY = Game.SCALE_Y;
			p1Name.x = p1LivesI.bitmap.x * 57;
			p1Name.y = p1LivesI.bitmap.y * 4;
			this.stage.addChild(p1Name);

            // Player 2 Live board
			p2LivesI = new Image();
			p2LivesI.image = preload.getResult("p1Live");
			p2LivesI.bitmap = new createjs.Bitmap(p2LivesI.image);
			p2LivesI.bitmap.scaleX = Game.SCALE_X;
			p2LivesI.bitmap.scaleY = Game.SCALE_Y;
			p2LivesI.bitmap.x = this.canvas.width - p2LivesI.image.height * Game.SCALE_X * 2.15;
			p2LivesI.bitmap.y = Game.SCALE_Y;
			this.stage.addChild(p2LivesI.bitmap);

            // Player 2 Heart
			heart2 = new Image();
			heart2.image = preload.getResult("heart");
			heart2.bitmap = new createjs.Bitmap(heart2.image);
			heart2.bitmap.scaleX = Game.SCALE_X / 1.5;
			heart2.bitmap.scaleY = Game.SCALE_Y / 1.5;
			heart2.bitmap.x = p2LivesI.bitmap.x * 1.065;
			heart2.bitmap.y = p2LivesI.bitmap.y * 35;
			this.stage.addChild(heart2.bitmap);

            // Player 2 Lives
			p2Lives = new createjs.Text(player2.getLives(), "30px Arial", "blue");
			p2Lives.scaleX = Game.SCALE_X;
			p2Lives.scaleY = Game.SCALE_Y;
			p2Lives.x = p2LivesI.bitmap.x * 1.185;
			p2Lives.y = p2LivesI.bitmap.y * 35;
			this.stage.addChild(p2Lives);

            // Player 2 Name
			p2Name = new createjs.Text("Player 2", "19px Arial", "blue");
			p2Name.scaleX = Game.SCALE_X;
			p2Name.scaleY = Game.SCALE_Y;
			p2Name.x = p2LivesI.bitmap.x * 1.09;
			p2Name.y = p2LivesI.bitmap.y * 4;
			this.stage.addChild(p2Name);

            //Arrow for player 1
			arrow1 = new Image();
			arrow1.image = preload.getResult("redTurn");
			arrow1.bitmap = new createjs.Bitmap(arrow1.image);
            arrow1.bitmap.scaleX = Game.SCALE_X/2;
			arrow1.bitmap.scaleY = Game.SCALE_Y/2;
			arrow1.bitmap.x = player1.bitmap.x+player1.image.width;
			arrow1.bitmap.y = player1.bitmap.y  - 50 * Game.SCALE_Y;
			this.stage.addChild(arrow1.bitmap);
            arrow1.bitmap.visible =true;
            arrow1.bitmap.alpha = 0.5;

            //Arrow for player 2
			arrow2 = new Image();
			arrow2.image = preload.getResult("blueTurn");
			arrow2.bitmap = new createjs.Bitmap(arrow2.image);
			arrow2.bitmap.scaleX = Game.SCALE_X/2;
			arrow2.bitmap.scaleY = Game.SCALE_Y/2;
			arrow2.bitmap.x = player2.bitmap.x-player2.image.width-arrow2.image.width;
			arrow2.bitmap.y = player2.bitmap.y  - 50 * Game.SCALE_Y;
			this.stage.addChild(arrow2.bitmap);
			arrow2.bitmap.visible = false;
			arrow2.bitmap.alpha = 0.5;

			maxArrow = arrow2.bitmap.y;
			minArrow = maxArrow - 40;

			ammo = new Ammo(preload.getResult("ammoImage"));

			//Add the boulder, but hide for now
			this.stage.addChild(ammo.bitmap);

			back = new Image();
			back.image = preload.getResult("backButton");
			back.bitmap = new createjs.Bitmap(back.image);
			back.bitmap.scaleX = Game.SCALE_X;
			back.bitmap.scaleY = Game.SCALE_Y;
			back.setX(Game.SCALE_X);
			back.setY(window.innerHeight - back.image.height * Game.SCALE_Y);
			back.bitmap.alpha = 0.7;
			this.stage.addChild(back.bitmap);
		}
		catch(e)
		{
		    new Console("Erreur lors de l'ajout des images dans le stage : " + e, true);
		    return false;
		}

		try	// Init clouds
		{
			// Clouds
			var image1 = preload.getResult("c1Image");
			var image2 = preload.getResult("c2Image");
			var image3 = preload.getResult("c3Image");
			var image4 = preload.getResult("c4Image");
			clouds.initializeClouds([image1, image2, image3, image4]);
		}
		catch(e)
		{
		    new Console("Erreur lors de l'ajout des nuages : " + e, true);
		    return false;
		}
		
		try	// Start the game
		{
			this.stage.update();
			startGame();
			startEventListeners();
        }
        catch (e) 
		{
            new Console("Erreur lors du démarrage du jeu : " + e, true);
            return false;
        }
    }

    function moveArrow()
    {
        try
        {
            if (arrow1.bitmap.y <=minArrow)
            {
                sensArrow = 1;
            }
            else if(arrow1.bitmap.y >= maxArrow)
            {
                sensArrow = -1;
            }
            arrow1.bitmap.y += sensArrow;
            arrow2.bitmap.y += sensArrow;
        }
        catch(e)
        {
            createjs.Ticker.setPaused(true);
			new Console("Erreur lors du déplacement des fleches : " + e, true);
        }
    }

    function drawArrow(numPlayer)
    {
        if (player1.getLives() <= 0 || player2.getLives() <= 0)
        {
            arrow1.bitmap.visible = false;
            arrow2.bitmap.visible = false;
            return;
        }
	    if(numPlayer == 1)
	    {
	        arrow1.bitmap.visible = true;
            arrow2.bitmap.visible = false;
	    }
	    else
	    {
	        if (nbPlayer == 2)
	        {
                arrow2.bitmap.visible = true;
	        }
            arrow1.bitmap.visible = false;
        }
    }

    function onBackButtonPressed()	// Back to menu
    {
		try
		{
			createjs.Ticker.removeAllListeners();
			stopEventListeners();
			Main.instance.prepareMenu();
		}
		catch(e)
		{
			createjs.Ticker.setPaused(true);
			new Console("Erreur lors du click sur le bouton retour : " + e, true);
		}
    }

    function checkButtonPressed(event)	// Did user click on the back button ?
    {
		try
		{
			if (event.x > back.borderLeft && event.x < back.borderRight && event.y < back.borderBottom && event.y > back.borderTop) 
			{
				onBackButtonPressed();
				stopEventListeners();
			}
		}
		catch(e)
		{
			createjs.Ticker.setPaused(true);
			new Console("Erreur lors de la vérification concernant les boutons cliqué : " + e, true);
		}
    }
	
	function onPointerDown(event)	// Executed when user touch the screen
    {
		try
		{
			checkButtonPressed(event);
			if ((player1.getLives() > 0 && player2.getLives() > 0))
			{
				if (!ammo.isShotFlying() && !getCurrentPlayer().isAiming && !getCurrentPlayer().shotInit)	// The ammo is in the air --> Let's move the ammo
				{
					getCurrentPlayer().beginAim(event);
				}
			}
		}
		catch(e)
		{
			createjs.Ticker.setPaused(true);
			new Console("Erreur lors du pointer down : " + e, true);
		}
	}
	
	function onPointerMove(event)	// Executed when the user move his finger on the screen
	{
		try
		{
		    if (!getCurrentPlayer().shotInit)

			    getCurrentPlayer().adjustAim(event);
		}
		catch(e)
		{
			new Console("Erreur lors du pointer move : " + e, true);
		}
	}
	
	function onPointerUp(event)	// Executed when the user take off his finger
	{
		try
		{
			if (getCurrentPlayer().isAiming && !getCurrentPlayer().shotInit)
			{
			    if (getCurrentPlayer().endAim(event))
                {
				    playerFire = false;
                }
			}
		}
		catch(e)
		{
			new Console("Erreur lors du pointer up : " + e, true);
		}
	}

    function checkHit(player)	// Does player is hit ?
    {
		try
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
		catch(e)
		{
			createjs.Ticker.setPaused(true);
			new Console("Erreur lors du check hit : " + e, true);
		}
    }

    function processHit()	// Processing a hit
    {
		try
		{
			SoundManager.getInstance().playSound("explode");
			ammo.endShot();
            
            this.stage.removeChild(getNextPlayer().bitmap);
            getNextPlayer().destructAnimation();
            this.stage.addChild(getNextPlayer().bitmap);
		}
		catch(e)
		{
		    new Console("Erreur lors de l'exécution d'un choc : " + e, true);
		    return false;
		}
    }
	
	function changePlayerTurn()	// Change player turn
    {
		try
		{
			playerTurn = playerTurn%2 +1;    // Change player
			getCurrentPlayer().canShot = true;
            drawArrow(playerTurn);
		}
		catch(e)
		{
			createjs.Ticker.setPaused(true);
			new Console("Erreur lors du changement de joueur : " + e, true);
		}
	}

	this.backToNormal = function()	// Called after a catapult destruction -> User can play after that
	{
		try
		{
			this.stage.removeChild(getNextPlayer().bitmap);
			getNextPlayer().bitmap = getNextPlayer().classicBitmap;
			this.stage.addChild(getNextPlayer().bitmap);
			getNextPlayer().loseLife(1);
			
			changePlayerTurn();
			if ((player1.getLives() <= 0 || player2.getLives() <= 0))
			{
				endGame();
			}
		}
		catch(e)
		{
			createjs.Ticker.setPaused(true);
			new Console("Erreur lors du retour à la normal après destruction d'une catapulte : " + e, true);
		}
    }

    function update() // Move every picture
	{
        moveArrow();
		try
		{
			clouds.update();
			
			if (!getCurrentPlayer().replaced)	// Current player needs to be replaced ?
				getCurrentPlayer().replaceAnimationAfterShot();

			if (ammo.isShotFlying())	// The ammo is in the air --> Let's move the ammo
			{
				if (!ammo.move() && !checkHit(player2) && !checkHit(player1))	// If the ammo stop moving (shot over)
					changePlayerTurn();
				if (playerTurn == 1)	// Player 1 is playing
				{
					if (checkHit(player2))
					{
						// Hit
						p2Lives.text = player2.getLives() -1;
						processHit();
					}
				}
				else if (playerTurn == 2)	// Player 2 is playing
				{
					if (checkHit(player1))
					{
						// Hit
						p1Lives.text = player1.getLives() -1;
						processHit();
					}
				}
			}

			else if (getCurrentPlayer().isShooting)	// Start a shot
			{
				var aimVector = getCurrentPlayer().nextAnimationToShoot();
				if (aimVector)
				{
					getCurrentPlayer().shotInit = false;
					ammo.initializeShot(getCurrentPlayer(), aimVector, getCurrentPlayer());
				}
			}
			
			else if (nbPlayer == 1 && playerTurn == 2)	// CPU has to play
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
		catch(e)
		{
			createjs.Ticker.setPaused(true);
			new Console("Erreur lors du déplacement des images : " + e, true);
		}
    }

    function draw()	// Update the stage
    {
		try
		{
			this.stage.update();
		}
		catch(e)
		{
			createjs.Ticker.setPaused(true);
			new Console("Erreur lors de la mise à jour du stage : " + e, true);
		}
    }

    function endGame()	// Game is over -> Display result
    {
		try
		{
		    this.canvas.addEventListener("MSPointerUp", onBackButtonPressed, false);
			createjs.Ticker.removeAllListeners(); // Stop the game loop

			// Show win/lose graphic
			var endGameImage;
			if (player1.getLives() <= 0) {
			    if (nbPlayer == 1) {
			        endGameImage = preload.getResult("loseImage");
			        SoundManager.getInstance().playSound("lose");
			    }
			    else {
			        endGameImage = preload.getResult("player2wins");
			        SoundManager.getInstance().playSound("win");
			    }
			}
			else if (player2.getLives() <= 0) {
			    if (nbPlayer == 1)
			        endGameImage = preload.getResult("winImage");
			    else
			        endGameImage = preload.getResult("player1wins");

			    SoundManager.getInstance().playSound("win");
			}
			else
			    return;

			var endGameBitmap = new createjs.Bitmap(endGameImage);

			endGameBitmap.x = (this.canvas.width / 2) - (endGameImage.width * Game.SCALE_X / 2);
			endGameBitmap.y = (this.canvas.height / 2) - (endGameImage.height * Game.SCALE_Y / 2);
			endGameBitmap.scaleX = Game.SCALE_X;
			endGameBitmap.scaleY = Game.SCALE_Y;

			this.stage.addChild(endGameBitmap);
			this.stage.update();

			startEventListeners();
		}
		catch(e)
		{
			createjs.Ticker.setPaused(true);
			new Console("Erreur lors de la fin du jeu : " + e, true);
		}
    }

    function Gameloop()	// Main loop of the game
    {
		try
		{
			update();
			draw();
		}
		catch(e)
		{
			createjs.Ticker.setPaused(true);
			new Console("Erreur lors de la boucle principale : " + e, true);
		}
    }
}

Game.SCALE_X = window.innerWidth / 800;
Game.SCALE_Y = window.innerHeight / 480;
Game.MARGIN = 25;
Game.GROUND_Y = 390 * Game.SCALE_Y;
Game.LIVES_PER_PLAYER = 3;
Game.instance;