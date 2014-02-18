function AbstractCatapult(image, nbLives, position)
{
    Image.call(this,image);
	
    this.lives = nbLives;
	this.position = (typeof position === 'undefined') ? "left" : position;

    this.bitmap.scaleX = (this.position == "left") ?  Game.SCALE_X : -Game.SCALE_X;
    this.bitmap.scaleY = Game.SCALE_Y;

    this.bitmap.x = (this.position == "left") ? Game.MARGIN : window.innerWidth - Game.MARGIN;
    this.bitmap.y = Game.GROUND_Y - image.height * Game.SCALE_Y;

    if (this.position == "left")
    {
        this.typeOfCatapult = "redCatapult";
        this.borderLeft = this.bitmap.x;
        this.borderRight = this.bitmap.x + this.bitmap.image.width * this.bitmap.scaleX;
    }
    else
    {
        this.typeOfCatapult = "blueCatapult";
        this.borderRight = this.bitmap.x;
        this.borderLeft = this.bitmap.x + this.bitmap.image.width * this.bitmap.scaleX;
    }

    this.borderTop = this.bitmap.y;
    this.borderBottom = this.bitmap.y + this.bitmap.image.height * this.bitmap.scaleY;
    this.borderFront = (this.position == "left") ? this.borderRight : this.borderLeft;
    this.borderBack = (this.position == "left") ? this.borderLeft : this.borderRight;

    this.isAiming = false;
    this.aimStart;
    this.aimVector;

    this.aimStep = (this.borderBottom - this.borderTop)/19;
    this.currentFrame = 19;
    this.isShooting = false;
    this.replaced = true;

    this.initAim = function()
    {
        SoundManager.getInstance().playSound("aim");

        this.aimStart = new createjs.Point(
            ((this.borderBack + this.borderFront) / 2),
            this.borderTop
        );

        if (this.aimStart == null)
            throw new Error("Erreur lors de la création du point de départ");
        this.isAiming = true;
    }

    this.startShot = function(aimCurrent)
    {
        SoundManager.getInstance().stopSound("aim");
        if (typeof aimCurrent === "undefined")
            throw new Error("Erreur lors de la création du point");
        this.aimVector = this.calculateAim(this.aimStart, aimCurrent, Ammo.MAX_SHOT_POWER);
        if (this.aimVector == null)
            throw new Error("Erreur lors de la création du calcul du vecteur");
        return this.aimVector;
    }

    this.calculateAim = function(start, end, maxShotPower)
    {
        var aim = new createjs.Point((start.x - end.x) / 12, (start.y - end.y) / 12);
        if (this.position == "left")       
        {
            aim.x = Math.min(maxShotPower, aim.x);    // Cap velocity
            aim.x = Math.max(0, aim.x); // Fire forward only
        }
        else     
        {
            aim.x = Math.min(0, aim.x);    // Cap velocity
        }

        if (aim == null)
            throw new Error("Erreur lors de la création du point");
        aim.y = Math.max(-maxShotPower, aim.y);   // Cap velocity
        aim.y = Math.min(0, aim.y); // Fire u only
        return aim;
    }

    this.calculatePoint = function(y)
    {
        var rayon = this.borderBottom - this.borderTop;
        var a = this.borderLeft + (this.borderRight - this.borderLeft);
        var b = this.borderBottom;
        var x = Math.ceil(Math.sqrt(Math.pow(rayon, 2) - Math.pow((y - b), 2)) + a);
        if (this.position == "left")
            var point = new createjs.Point(- x, y);
        else
        {
            var point = new createjs.Point(x, y);
        }
        return point;
    }

    this.getLives = function()
    {
        return this.lives;
    }

    this.loseLife = function (nbLives)
    {
        this.lives -= nbLives
        if (this.lives < 0)
            this.lives = 0;
    }

    this.nextAnimationToShoot = function()
    {
        if (this.currentFrame < 19)
        {
            this.currentFrame++;
            this.refresh();
            return false;
        }
        else
        {
            this.isShooting = false;
            return this.aimVector;
        }
    }

    this.replaceAnimationAfterShot = function()
    {
        if (this.currentFrame > 17)
        {
            this.currentFrame--;
            this.refresh();
            return false;
        }
        else
        {
            this.replaced = true;
            return true;
        }
    }

    this.refresh = function()
    {
        this.bitmap.image = preload.getResult(this.typeOfCatapult + this.currentFrame);
    }
}