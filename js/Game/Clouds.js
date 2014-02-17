function Clouds()
{
    var MAX_CLOUDS = 5;
    this.clouds;
    this.sens;

    this.initializeClouds = function(imageTab)
    {
        this.sens = (Math.random() > 0.5) ? 1 : -1;
        this.clouds = new Array();

        for (var i = 0; i < MAX_CLOUDS; ++i)
        {
            var image = imageTab[i % imageTab.length];
            
            this.clouds[i] = new Array();
            this.clouds[i] = {"image" : new Image(image)}; 
           
            this.clouds[i]["image"].bitmap.scaleX = Game.SCALE_X;
            this.clouds[i]["image"].bitmap.scaleY = Game.SCALE_Y;
            this.clouds[i]["image"].bitmap.x = Math.floor((Math.random()*window.innerWidth) + 1);
            this.clouds[i]["image"].bitmap.y = Game.MARGIN * i;

            stage.addChild(this.clouds[i]["image"].bitmap);

            // Set up clouds
            this.clouds[i]["speed"] = (Math.random() * 2 + 0.5) * this.sens;
            
        }
    }

    this.update = function ()
    {
        for (var i = 0; i < MAX_CLOUDS; ++i)
        {
            this.clouds[i]["image"].bitmap.x += this.clouds[i]["speed"];

            if (this.sens > 0)
            {
                if (this.clouds[i]["image"].bitmap.x > window.innerWidth)
                {
                    this.clouds[i]["speed"] = Math.random() * 2 + 0.5;
                    this.clouds[i]["image"].bitmap.x = -this.clouds[i]["image"].bitmap.image.width * this.clouds[i]["image"].bitmap.scaleX;
                }
            }
            else if (this.sens < 0)
            {
                if (this.clouds[i]["image"].bitmap.x < -this.clouds[i]["image"].bitmap.image.width * this.clouds[i]["image"].bitmap.scaleX)
                {
                    this.clouds[i]["speed"] = Math.random() * -2 - 0.5;
                    this.clouds[i]["image"].bitmap.x = window.innerWidth;
                }
            }
        }
    }
}