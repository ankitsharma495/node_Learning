const express = require('express');
const app = express();
const {PORT} = require('./config');
const apirouter = require('./routes');

app.use('/api', apirouter);


app.listen(PORT , ()=>{
    console.log("started server");
})

