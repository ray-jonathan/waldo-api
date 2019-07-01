const db = require('./conn');
// const moment = require('moment');
const axios = require('axios');

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
        .then(result => new Beacon(result.id, result.team, result.latitude, result.longitude, result.last_update));
    }
    static setCoordinatesById(id, lat, lng){
        return db.one(`update flags set latitude=$2, longitude=$3 where id=$1 returning *`,[id, lat, lng])
        .then(result => new Beacon(result.id, result.team, result.latitude, result.longitude, result.last_update));
    }


}

module.exports = Beacon;

