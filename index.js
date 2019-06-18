const express = require('express');
const app = express();
const PORT = 3012;
const {getBeacon} = require('./controllers/locationdata');

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