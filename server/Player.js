


class Player {

    constructor(name) {
        this.name = name;
        this.code = "";
        this.lobbyReady = false;
    }

    makeid() {

        var player = this;

        return new Promise(function(resolve, reject) {
            var text = "";
            var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        
            for (var i = 0; i < 6; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            player.code = text;
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    }

    toString() {
        return this.name + " " + this.code;
    }
}


module.exports = Player;