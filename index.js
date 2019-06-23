const http = require('http');
const express = require('express');
const app = express();
const PORT = 3012;
const {
    getBeacon, 
    setBeacon,
    } = require('./controllers/locationdata');

const Phone = require('./models/phone');

const WebSocket = require('ws');
const server = http.createServer(app); 
const wss = new WebSocket.Server({
    path: '/ws',
    server // piggyback the websocket server onto our http server
});
wss.on('connection', async (ws) => {
    console.log(" ");
    console.log("connected");
    ws.on('message', message => {
    console.log(`Received message => ${message}`);
    });

    // ws.send('ho!');

    const coords = await getBeacon();
    const users = await Phone.getAllUsers();
    console.log(users);
    console.log(typeof users);
    ws.send(JSON.stringify(
        {
            message : "Test successful.",
            type : "GET",
            coordinates : coords,
            users : users,
        }
    ));



});

app.use(express.json()); // Required for passing JSON to `req.body`
app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res)=> {
    const coords = await getBeacon();
    res.json({
        message : "Test successful.",
        type : "GET",
        coordinates : coords
    });
});
app.post('/', async (req, res)=> {
    console.log(req.body);
    // res.setHeader("cows","moo");
    const {latitude, longitude, } = req.body;
    const coords = await setBeacon(latitude, longitude);
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