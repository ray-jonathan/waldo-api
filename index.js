const express = require('express');
const app = express();
const PORT = 3012;
const {
    getBeacon, 
    setBeacon,
    } = require('./controllers/locationdata');

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

app.listen(PORT, ()=> {
    console.log(`Running on port ${PORT}.`);
});