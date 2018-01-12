


class Player {

    constructor(name) {
        this.name = name;
        this.code = "";

        this.hand;
        this.points = 0;
        this.starter = false;
        this.changedCards = false;
    }

    makeid() {
        let player = this;

        return new Promise(function(resolve, reject) {
            let text = "";
            let possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        
            for (let i = 0; i < 6; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            player.code = text;
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    }

    cardPlayed(card) {
        let player = this;

        return new Promise(function(resolve, reject) {
            player.hand.cardPlayed(card).then((status) => {
                resolve(status);
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    toString() {
        return this.name + " " + this.code;
    }
}


module.exports = Player;