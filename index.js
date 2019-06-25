const http = require('http');
const express = require('express');
const app = express();
const PORT = 3012;
const Phone = require('./models/phone');
const Beacon = require('./models/beacon');
const WebSocket = require('ws');
const server = http.createServer(app); 
const wss = new WebSocket.Server({
    path: '/ws',
    server // piggyback the websocket server onto our http server
});
wss.on('connection', async (ws) => {
    console.log(" ");
    console.log("connected");
    ws.on('message', async (message) => {
        console.log("message is...");
        const messageJSON = JSON.parse(message);
        console.log(messageJSON);
        // BONUS: send all coords to all users except the one who sent this message
        switch(messageJSON.type){
            case("flag"):
                console.log("WS: Flag CASE");
                await Beacon.setCoordinates(messageJSON.flag.latitude, messageJSON.flag.longitude)
                ws.send(JSON.stringify({
                    type: "flag",
                    flag: {
                        [messageJSON.flag.id] : {
                            latitude: messageJSON.flag.latitude,
                            longitude: messageJSON.flag.longitude,
                        }
                    }
                }));
                break;
            case("user"):
                console.log("WS: USER CASE");
                const userFill = await Phone.setUserById(1, messageJSON.user.latitude, messageJSON.user.longitude)
                console.log("userFill: ");
                console.log(userFill);
                // we'll want send the userFill object back so that the users have the name and picture of the player
                ws.send(JSON.stringify({
                    type: "user",
                    user: {
                        [messageJSON.user.id] : {
                            // name: messageJSON.user.name,
                            // pic: messageJSON.user.picture,                
                            latitude: messageJSON.user.latitude,
                            longitude: messageJSON.user.longitude,
                        }
                    }
                }));
                break;
            default: 
                break;
        }
    });
});

app.use(express.json()); // Required for passing JSON to `req.body`
app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res)=> {
    const flag = await Beacon.getBeaconById(1);
    const usersArray = await Phone.getAllUsers();
    const users = {};
    usersArray.forEach(user => {
        users[user.id] = {
            name: user.name,
            pic: user.picture,
            latitude: user.latitude,
            longitude: user.longitude,
        };
    });
    res.json({
        flag: {
            [flag.id]: {
                latitude: flag.latitude,
                longitude: flag.longitude,
            }
        },
        users, //sending back an Array of userObjects
    });
});


app.post('/', async (req, res)=> {
    console.log(req.body);
    const {latitude, longitude, id, } = req.body;
    const url = 'ws://waldo.jonathan-ray.com/ws';
    const connection = new WebSocket(url);
    connection.onopen = () => {
        connection.send(JSON.stringify({
            type: "flag",
            flag: {
                id,
                latitude,
                longitude,
            }
        }));
        connection.terminate();
    };
    res.json({
        message : "Test successful",
        type : "POST",
        coordinates : coords
    });
});

// app.listen(PORT, ()=> {
server.listen(PORT, ()=> {
    console.log(`Running on port ${PORT}.`);
});