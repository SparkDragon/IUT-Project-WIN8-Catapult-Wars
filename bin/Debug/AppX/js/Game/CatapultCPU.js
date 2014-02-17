function CatapultCPU(image, nbLives)
{
    AbstractCatapult.call(this, image, nbLives);

    this.bitmap.regX = image.width;
    this.bitmap.scaleX = -Game.SCALE_X;
    this.bitmap.scaleY = Game.SCALE_Y;
    this.bitmap.x = canvas.width - Game.MARGIN - (image.width * Game.SCALE_X);
    this.bitmap.y = Game.GROUND_Y - image.height * Game.SCALE_Y;
}