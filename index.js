const express = require('express');
const app = express();
const PORT = 3012;
const bodyParser = require('body-parser');
const {getCoordinates} = require('./controllers/locationdata');

app.use(bodyParser.json());

app.get('/', (req, res)=> {
    getCoordinates();
    res.json({
        message : "Test successful.",
        type : "GET",
        coordinates : {
            lat : 33.99322576251758,
            lng: -84.75294486198766, 
        }
    });
});
app.post('/', (req, res)=> {
    console.log(req.body);
    res.setHeader("cows","moo");
    res.json({
        message : "Test successful",
        type : "POST"
    });
});

app.listen(PORT, ()=> {
    console.log(`Running on port ${PORT}.`);
});