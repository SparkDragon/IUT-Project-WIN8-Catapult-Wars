function AbstractCatapult(image, nbLives)
{
    Image.call(this,image);
	
    this.lives = nbLives;

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
}