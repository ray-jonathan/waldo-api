const http = require('http');
const express = require('express');
const app = express();
const PORT = 3012;
const {
    getBeacon, 
    setBeacon,
    } = require('./controllers/locationdata');

const WebSocket = require('ws')
const server = http.createServer(app); 
const wss = new WebSocket.Server({
    path: '/ws',
    server // piggyback the websocket server onto our http server
});
wss.on('connection', ws => {
    console.log(" ");
    console.log("connected");
    ws.on('message', message => {
    console.log(`Received message => ${message}`);
    });

    ws.send('ho!');

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
    wss.emit('news', { hello: 'world' });
    wss.send({ bonjour: 'monde' });
    wss.send(JSON.stringify({ stringy: 'wingy' }));
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