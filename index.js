const express = require('express');
const app = express();
const PORT = 3012;

app.get('*', (req, res)=> {
    res.json({
        message : "Test successful."
    });
});

app.listen(PORT, ()=> {
    console.log(`Running on port ${PORT}.`);
});