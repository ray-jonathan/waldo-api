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
    clientTracking:true,
    server,
});
wss.on('connection', (ws) => {
    console.log(" ");
    console.log("connected");
    ws.on('message', async (message) => {
        console.log("incoming socket say...");
        const messageJSON = JSON.parse(message);
        console.log(messageJSON);
        if(messageJSON.type === "user"){
            console.log("WS: USER CASE");
            console.log("userFill: ");
            const userFill = await Phone.setUserById(messageJSON.user.id, messageJSON.user.latitude, messageJSON.user.longitude);
            // we'll want send the userFill object back so that the users have the name and picture of the player
            // if (client !== ws && client.readyState === WebSocket.OPEN){
            let numOfClients = 0;
            wss.clients.forEach(async client => {
                console.log("Client's ready state: ",client.readyState);
                if (client !== ws && client.readyState === WebSocket.OPEN){
                    numOfClients ++;
                    client.send(JSON.stringify({
                            type: "user",
                            user: {
                                [userFill.id] : {
                                    name: userFill.name,
                                    picture: userFill.picture,                
                                    latitude: userFill.latitude,
                                    longitude: userFill.longitude,
                                }
                            }
                    }));
                }
            });
            console.log(`Updated user information sent to ${numOfClients} phones.`);
        }
        else if (messageJSON.type === "flag"){
            console.log("WS: Flag CASE");
            if (messageJSON.decoy === false){
                const phoneFill = await Beacon.setCoordinatesById(messageJSON.flag.id, messageJSON.flag.latitude, messageJSON.flag.longitude);
                console.log("phoneFill: ");
                console.log(phoneFill);
                let numOfClients = 0;
                wss.clients.forEach(async client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN){
                        numOfClients ++;
                        client.send(JSON.stringify({
                            type: "flag",
                            flag: {
                                [messageJSON.flag.id] : {
                                    latitude: messageJSON.flag.latitude,
                                    longitude: messageJSON.flag.longitude,
                                }
                            },
                        }));    
                    }
                });
                console.log(`Updated flag information sent to ${numOfClients} phones.`);
            }
            else if ( messageJSON.decoy === true){
                console.log("decoy enabled, sending dummy coordinates");
                let numOfClients = 0;
                wss.clients.forEach(async client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN){
                        numOfClients ++;
                        client.send(JSON.stringify({
                            type: "flag",
                            flag: {
                                [messageJSON.flag.id] : {
                                    latitude: messageJSON.flag.latitude,
                                    longitude: messageJSON.flag.longitude,
                                }
                            },
                            decoy: true,
                        }));    
                    }
                });
                console.log(`Updated flag information sent to ${numOfClients} phones.`);
            }
        }
        else{
            console.log(" ");
            console.log("It wasn't a flag or a phone??");
        }
        // switch(messageJSON.type){
        //     case("user"):
        //         console.log("WS: USER CASE");
        //         const userFill = await Phone.setUserById(messageJSON.user.id, messageJSON.user.latitude, messageJSON.user.longitude)
        //         // we'll want send the userFill object back so that the users have the name and picture of the player
        //         ws.send(JSON.stringify({
        //             type: "user",
        //             user: {
        //                 [userFill.id] : {
        //                     name: userFill.name,
        //                     picture: userFill.picture,                
        //                     latitude: userFill.latitude,
        //                     longitude: userFill.longitude,
        //                 }
        //             }
        //         }));
        //         break;
        //     case('flag'):
        //         console.log("WS: Flag CASE");
        //         const phoneFill = await Beacon.setCoordinatesById(messageJSON.flag.id, messageJSON.flag.latitude, messageJSON.flag.longitude)
        //         console.log("phoneFill: ");
        //         console.log(phoneFill);
        //         ws.send("************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************")
        //         ws.send(JSON.stringify({
        //             type: "flag",
        //             flag: {
        //                 [messageJSON.flag.id] : {
        //                     latitude: messageJSON.flag.latitude,
        //                     longitude: messageJSON.flag.longitude,
        //                 }
        //             }
        //         }), {}, () => {console.log("flag info sent to phones");});
        //         // console.log("flag info sent to phones");
        //         break;
        //     default: 
        //         break;
        // }        
    
    });
});

app.use(express.json()); // Required for passing JSON to `req.body`
app.use(express.urlencoded({extended: true}));

app.post('/generate-user', async (req, res)=> {
    console.log('/generate-user path');
    const body = JSON.parse(req.body);
    console.log(body);
    const {id, name, picture} = body;
    console.log(id);
    console.log(name);
    console.log(picture);
});

app.get('/', async (req, res)=> {
    console.log("'GET' request");
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
    console.log(`'POST' from flag id: ${req.body.id}`);
    const {latitude, longitude, id, } = req.body;
    const url = 'wss://waldo.jonathan-ray.com/ws';
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
        latitude,
        longitude,
});
});

// app.listen(PORT, ()=> {
server.listen(PORT, ()=> {
    console.log(`Running on port ${PORT}.`);
});







