const express = require('express');
const app = express();
const PORT = 3012;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', (req, res)=> {
    res.json({
        message : "Test successful.",
        type : "GET"
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