﻿function CatapultCPU(destruction, image, nbLives, position)
{
    AbstractCatapult.call(this, destruction, image, nbLives, position);
    this.currentY;
    this.maxY = this.borderBottom;
    this.minY = this.borderTop + this.aimStep * 3;
    this.nextY;

    this.beginAim = function ()
    {
        if (!this.isAiming && this.canShot)
        {
            
            this.initAim();
            this.currentY = this.borderTop;
            this.nextY = Math.ceil(Math.random() * (this.maxY - this.minY) + this.minY);
            this.nextY = Math.max(0, this.nextY);
            this.nextY = Math.min(this.maxY, this.nextY);
        }
    }

    // Triggered by MSPointerMove event
    this.adjustAim = function ()
    {
        if (this.isAiming)
        {
            if (this.currentY >= this.nextY)
                return this.endAim();

            this.currentY += this.aimStep / 2;
            this.currentFrame = 19 - Math.ceil((this.currentY - this.borderTop) / this.aimStep) + 1;
            this.refresh();
            return false;
        }
    }

    this.endAim = function ()
    {
        if (this.isAiming)
        {
            this.isAiming = false;
            this.replaced = false;
            this.isShooting = true;
            this.canShot = false;
            this.startShot(this.calculatePoint(this.nextY));
            return true;
             
        }
    }

    this.drawArrow = function () {}
}