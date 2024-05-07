import express from 'express';
import { Client } from 'basic-ftp';

const app = express();

const sendDataRoute = require('./routes/sendData');
const checkFolderRoute = require('./routes/checkFolder')

app.use("/sendData/:address&:user&:password", sendDataRoute);
app.use("/checkFolder/:address&user&:password&:folderPath", checkFolderRoute)

app.listen(3000, (err) => {
    if (!err) {
    console.log("[*]Server is listening on port 3000")
    } else {
        console.log("An error has occured!")
    }
});
