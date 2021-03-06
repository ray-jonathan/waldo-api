const db = require('./conn');

class Beacon {
    constructor(id, team, latitude, longitude, last_update){
        this.id = id;
        this.team = team;
        this.latitude = latitude;
        this.longitude = longitude;
        this.lastUpdate = last_update;
    }

    static getBeaconById(id){
        return db.one(`select * from flags where id=$1`,[id])
        .then(result => {
            const value = new Beacon(result.id, result.team, result.latitude, result.longitude, result.last_update);
            return value;
        })
        .then(result => {
            console.log(result);
            return result;
        });
    }
    static setCoordinatesById(id, lat, lng){
        return db.one(`update flags set latitude=$2, longitude=$3 where id=$1 returning *`,[id, lat, lng])
        .then(result => {
            const value = new Beacon(result.id, result.team, result.latitude, result.longitude, result.last_update);
            return value;
        })
        .then(result => {
            console.log(result);
            return result;
        });
    }


}

module.exports = Beacon;

