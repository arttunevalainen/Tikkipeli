


class Player {

    constructor(name) {
        this.name = name;
        this.code = "";

        this.hand;
        this.points = 0;
        this.starter = false;
        this.changedCards = false;

        this.offline = false;
        this.offlinetimer;
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

    offlineTimer() {
        if(this.offlinetimer) {
            clearTimeout(this.offlinetimer);
        }

        this.offlinetimer = setTimeout(this.goOffline, 30000, this);
    }

    goOffline(player) {
        clearTimeout(player.offlinetimer);
        player.offline = true;
        console.log(player.name + " going offline");
    }

    resetOfflineTimer() {
        if(this.offlinetimer) {
            clearTimeout(this.offlinetimer);
        }
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