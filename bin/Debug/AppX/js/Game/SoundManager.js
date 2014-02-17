function SoundManager()
{
    this.sounds = {
        "fire": {
            "sound" : createSound("fire"),
            "path" : getPath("fire")
        },
        "hit": {
            "sound" : createSound("hit"),
            "path" : getPath("hit")
        },
        "explode": {
            "sound" : createSound("explode"),
            "path" : getPath("explode")
        },
        "lose": {
            "sound" : createSound("lose"),
            "path" : getPath("lose")
        },
        "aim": {
            "sound" : createSound("aim"),
            "path" : getPath("aim")
        },
        "win": {
            "sound" : createSound("win"),
            "path" : getPath("win")
        }
    };

    function getPath(name)
    {
        var path;
        switch(name)
        {
            case "fire":
                path = "/sounds/CatapultFire.wav";
                break;
            case "hit":
                path = "/sounds/BoulderHit.wav";
                break;
            case "explode":
                path = "/sounds/CatapultExplosion.wav";
                break;
            case "lose":
                path = "/sounds/Lose.wav";
                break;
            case "aim":
                path = "/sounds/RopeStretch.wav";
                break;
            case "win":
                path = "/sounds/Win.wav";
                break;
        }
        return path;
    }

    function createSound (name)
    {
        var sound = document.createElement("audio");
        if (sound == null)
            throw new Error("Erreur lors de la création du son");
        sound.src = getPath(name);
        sound.autoplay = false;
        return sound;
    }

    this.playSound = function (name)
    {
        this.sounds[name]["sound"] = createSound(name);
        this.sounds[name]["sound"].play();
    }

    this.stopSound = function (name)
    {
        if (this.sounds[name]["sound"] != null)
            this.sounds[name]["sound"].pause();
    }
}

SoundManager.instance;

SoundManager.getInstance = function()
{
    if (SoundManager.instance == null)
        SoundManager.instance = new SoundManager();
    return SoundManager.instance;
}