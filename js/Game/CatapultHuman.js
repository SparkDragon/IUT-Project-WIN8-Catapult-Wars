function CatapultHuman (image, nbLives, position)
{
    AbstractCatapult.call(this, image, nbLives);

    this.position = (typeof (position) === 'undefined') ? "left" : position;

    this.bitmap.scaleX = (this.position == "left") ?  Game.SCALE_X : -Game.SCALE_X;
    this.bitmap.scaleY = Game.SCALE_Y;

    this.bitmap.x = (this.position == "left") ? Game.MARGIN : window.innerWidth - Game.MARGIN;
    this.bitmap.y = Game.GROUND_Y - image.height * Game.SCALE_Y;

    if (this.position == "left")
    {
        this.borderLeft = this.bitmap.x;
        this.borderRight = this.bitmap.x + this.bitmap.image.width * this.bitmap.scaleX;
    }
    else
    {
        this.borderRight = this.bitmap.x;
        this.borderLeft = this.bitmap.x + this.bitmap.image.width * this.bitmap.scaleX;
    }

    this.borderTop = this.bitmap.y;
    this.borderBottom = this.bitmap.y + this.bitmap.image.height * this.bitmap.scaleY;
    this.borderFront = (this.position == "left") ? this.borderRight : this.borderLeft;
    this.borderBack = (this.position == "left") ? this.borderLeft : this.borderRight;

    this.isAiming = false;
    var aimStart;
    var aimVector;

    // Trigger by MSPointerDown event
    this.beginAim = function (event)
    {
        if (!this.isAiming)
        {
            if (this.position == "left")
            {
                if (event.x > this.borderBack && event.x < this.borderFront
                    && event.y < this.borderBottom && event.y > this.borderTop)
                {
                    this.initAim();
                }
            }
            else
            {
                if (event.x > this.borderFront && event.x < this.borderBack
                    && event.y < this.borderBottom && event.y > this.borderTop)
                {
                    Debug.writeln('ok2');
                    this.initAim();
                }
            }
        }
    }

    // Triggered by MSPointerMove event
    this.adjustAim = function (event)
    {
        if (this.isAiming)
        {
            if (event.x < aimStart.x && event.y > aimStart.y)
            {
                var aimCurrent = new createjs.Point(event.x, event.y);
                if (aimCurrent == null)
                    throw new Error("Erreur lors de la création du point");
                aimVector = calculateAim(aimStart, aimCurrent, Ammo.MAX_SHOT_POWER);
                if (aimVector == null)
                    throw new Error("Erreur lors de la création du calcul du vecteur");
                return true;
            }
        }
    }

    // Triggered by MSPointerUp event
    this.endAim = function (event)
    {
        if (this.isAiming)
        {
            this.isAiming = false;
            if (this.position == "left")       // Player 1
            {
                if (event.x < aimStart.x && event.y > aimStart.y)
                    return startShot(event.x,event.y);

            }
            else       // Player 2
            {
                if (event.x > aimStart.x && event.y > aimStart.y)
                    return startShot(event.x, event.y);
            }
            return false;  
        }
    }

    this.initAim = function()
    {
        SoundManager.getInstance().playSound("aim");

        aimStart = new createjs.Point(
            ((this.borderBack + this.borderFront) / 2),
            this.borderTop
        );

        if (aimStart == null)
            throw new Error("Erreur lors de la création du point de départ");
        this.isAiming = true;
    }

    function startShot(x,y)
    {
        SoundManager.getInstance().stopSound("aim");
        var aimCurrent = new createjs.Point(x, y);
        if (aimCurrent == null)
            throw new Error("Erreur lors de la création du point");
        aimVector = calculateAim(aimStart, aimCurrent, Ammo.MAX_SHOT_POWER);
        if (aimVector == null)
            throw new Error("Erreur lors de la création du calcul du vecteur");
        return aimVector;
    }

    function calculateAim(start, end, maxShotPower)
    {
        // NOTE: This only works for player 1...
        if (this.position == "left")       
        {
            var aim = new createjs.Point((end.x - start.x) / 12, (start.y - end.y) / 12);   // Player 1
            aim.x = Math.min(maxShotPower, aim.x);    // Cap velocity
            aim.x = Math.max(0, aim.x); // Fire forward only
        }
        else 
            var aim = new createjs.Point((start.x - end.x) / 12, (start.y - end.y) / 12);   // Player 2

        if (aim == null)
            throw new Error("Erreur lors de la création du point");
        aim.y = Math.max(-maxShotPower, aim.y);   // Cap velocity
        aim.y = Math.min(0, aim.y); // Fire u only
        return aim;
    }
}