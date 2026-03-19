const express = require('express');
const app = express();
const {serverConfig} = require('./config');
const apirouter = require('./routes');

app.use('/api', apirouter);


app.listen(serverConfig.PORT , ()=>{
    console.log("started server");
})

