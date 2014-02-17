function Ammo(image)
{
    Image.call(this, image);

    var shotVelocity;
    var shotFlying = false;
    var aimPower = 1;
	
	this.bitmap.scaleX = Game.SCALE_X;
	this.bitmap.scaleY = Game.SCALE_Y;
	this.bitmap.visible = false;
	
	// Return true if keep moving
	this.move = function()
	{
		// Shot in the air
	    this.bitmap.x += shotVelocity.x;
		this.bitmap.y += shotVelocity.y;
		shotVelocity.y += Ammo.GRAVITY;  // Apply gravityeach time

		if (this.bitmap.y + this.bitmap.image.height >= Game.GROUND_Y ||
			this.bitmap.x <= 0 ||
			this.bitmap.x + this.bitmap.image.width >= window.innerWidth)
		{
			// Missed
		    this.endShot();
			return false;
		}
		return true;
	}

	this.isShotFlying = function()
	{
	    return shotFlying;
	}

	this.initializeShot = function(player, vector, player)
	{
	    this.bitmap.x = player.borderBack + player.bitmap.image.width * player.bitmap.scaleX / 2;
	    this.bitmap.y = player.borderTop;
	    
	    shotVelocity = vector;   // vector is from the input events
	    this.fireShot();
	    
	}

    // Start a shot
	this.fireShot = function()
	{
	    this.bitmap.visible = true;
	    shotFlying = true;
	}

	this.endShot = function()
	{
	    shotFlying = false;   // Stop shot
	    this.bitmap.visible = false; // Hide shot
    }
}

Ammo.MAX_SHOT_POWER = 10;
Ammo.GRAVITY = 0.07;
