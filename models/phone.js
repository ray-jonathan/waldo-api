const db = require('./conn');

class Phone {
    constructor(id, name, picture, latitude, longitude, last_update){
        this.id = id;
        this.name = name;
        this.picture = picture;
        this.latitude = latitude;
        this.longitude = longitude;
        this.lastUpdate = last_update;
    }
    static getAllUsers(){
        return db.any(`select * from users
        `)
        .then(resultsArray => resultsArray.map(result => {
            return new Phone(result.id, result.name, result.picture, result.latitude, result.longitude, result.lastUpdate);
        }))
        .then(r => {

            // console.log("results: ", r);
            return r;
        });
    }

    static setUserById(id, latitude, longitude){
        return db.one(`UPDATE users set latitude=$2, longitude=$3 where id=$1 returning *`, [id, latitude, longitude])
        .then(result => new Phone(result.id, result.name, result.picture, result.latitude, result.longitude, result.lastUpdate));
    }

    static async newUser(id, name, picture){
        const team = await this.getTeamsAssignment();
        console.log(`${name} is on Team ${team}.`);
        return db.one(`insert into users (id, name, picture, team) values ($1, $2, $3, $4) returning *`, [id, name, picture, team])
        .then(result => new Phone(result.id, result.name, result.picture, result.latitude, result.longitude, result.lastUpdate))
        .then(user => console.log("user: ", user) && user);
    }

    static async getTeamsAssignment(){
        console.log('getTeamsCount');
        const data = await db.any(`select * from users`);
        console.log(data);
        let team1 = 0;
        let team2 = 0;
        data.forEach(user => {
            if (user.team == 1){
                team1++;
            }
            if (user.team == 2){
                team2++;
            }
        });
        const teamCount= {team1, team2,};
        console.log('teamCount: ', teamCount);
        let getTeamsAssignment = 2;
        if(team1 <= team2){
            getTeamsAssignment = 1;
        }
        return getTeamsAssignment;
    }

}

module.exports = Phone;
