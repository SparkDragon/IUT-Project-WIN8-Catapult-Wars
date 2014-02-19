function Image(image)
{
	this.image = image;
	this.bitmap = new createjs.Bitmap(this.image);
	if (this.bitmap == null)
	    throw new Error("Erreur dans la création de l'image");
    this.setX = function(value)
    {
        this.bitmap.x = value;
        this.borderLeft = this.bitmap.x;
        this.borderRight = this.bitmap.x + this.bitmap.image.width * this.bitmap.scaleX;
    }

    this.setY = function(value)
    {
        this.bitmap.y = value;
        this.borderTop = this.bitmap.y;
        this.borderBottom = this.bitmap.y + this.bitmap.image.height * this.bitmap.scaleY;
    }

	if (typeof x !== "undefined")
	    this.setX(x);

	if (typeof y !== "undefined")
	    this.setY(y);
}