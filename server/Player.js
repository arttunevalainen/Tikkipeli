


class Player {

    constuctor(name) {
        this.name = name;
        this.code = "";
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



}


module.exports = Player;