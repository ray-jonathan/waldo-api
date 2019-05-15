const express = require('express');
const app = express();
const PORT = 3012;

app.get('/', (req, res)=> {
    res.json({
        message : "Test successful.",
        type : "GET"
    });
});
app.post('/', (req, res)=> {
    console.log(req);
    res.json({
        message : "Test successful",
        type : "POST"
    });
});

app.listen(PORT, ()=> {
    console.log(`Running on port ${PORT}.`);
});