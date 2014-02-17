function Image(image)
{
	this.image = image;
	this.bitmap = new createjs.Bitmap(this.image);
	if (this.bitmap == null)
	    throw new Error("Erreur dans la création de l'image");
}