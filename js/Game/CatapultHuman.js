function CatapultHuman (image, nbLives, position)
{
    AbstractCatapult.call(this, image, nbLives, position);


    // Trigger by MSPointerDown event
    this.beginAim = function (event)
    {
        if (!this.isAiming)
        {
			if (event.x > this.borderLeft && event.x < this.borderRight
				&& event.y < this.borderBottom && event.y > this.borderTop)
			{
				this.initAim();
			}
        }
    }

    // Triggered by MSPointerMove event
    this.adjustAim = function (event)
    {
        if (this.isAiming)
        {
            if (this.position == "left" && event.x < this.aimStart.x && event.y > this.aimStart.y && event.y < this.borderBottom )
            {
                this.currentFrame = 19 - Math.ceil((event.y - this.borderTop) / this.aimStep) + 1;
                this.refresh()
            }
            else if (this.position == "right" && event.x > this.aimStart.x && event.y > this.aimStart.y && event.y < this.borderBottom )
            {
                this.currentFrame = 19 - Math.ceil((event.y - this.borderTop) / this.aimStep) + 1;
                this.refresh()
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
                if (event.x < this.aimStart.x && event.y > this.aimStart.y)
                {
                    this.replaced = false;
                    this.isShooting = true;
                    this.startShot(this.calculatePoint(event.y));
                    this.refresh();
                    return true;
                }
            }
            else       // Player 2
            {
                if (event.x > this.aimStart.x && event.y > this.aimStart.y)
                {
                    this.replaced = false;
                    this.isShooting = true;
                    this.startShot(this.calculatePoint(event.y));
                    this.refresh();
                    return true;
                }
            }
            this.currentFrame = 17;
            return false;  
        }
    }
}