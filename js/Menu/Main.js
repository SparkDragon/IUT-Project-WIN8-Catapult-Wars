function Main()
{
    AbstractWindow.call(this);

    var background;
    this.canvas;
    this.context;

    this.initialize = function()
    {
        canvas = document.getElementById("menuCanvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context = canvas.getContext("2d");

        //soundManager = new SoundManager();


        preload = new createjs.LoadQueue();
        preload.addEventListener("complete", prepareMenu);
        var manifest = [
            { id: "backgroundImage", src: "images/Textures/Backgrounds/title_screen.png" },
        ];
        preload.loadManifest(manifest);
    }

    function prepareMenu()
    {
        background = new Image();
		background.image = preload.getResult("backgroundImage");
		background.bitmap = new createjs.Bitmap(background.image);
		background.bitmap.scaleX = Game.SCALE_X;
		background.bitmap.scaleY = Game.SCALE_Y;
        canvas.addChild(background.bitmap);
    }
}