import express from 'express';
import { Client } from 'basic-ftp';

const address = 'eu-central-1.sftpcloud.io';
const user = '9bf46f771b9941698c88544264493a31';
const password = 'p0L5RScxWB7aKpcHOHrnfDyAq3vbaqJE';

const Data = async (addr, user, password) => {
    const client = new Client();
    var data;
    client.ftp.verbose = false;
    try {
        await client.access({
            host: addr,
            user: user,
            password: password,
            secure: false
        })
        data = (await client.list()).length;
        client.close()
        return data;
    } catch (err) {
        return err;
    }    
}

const getData = async (addr, user, password) => {
    const result = await Data(addr, user, password);
    return result;
}

const app = express();

app.get('/sendData', function(req, res) {
    getData(address, user, password).then(count => {
        const data = {
            NumberOfFiles: count
        };
        res.json(data);
    })
   
});

app.use(express.json()); 
app.post('/getData', (req, res)=>{ 
    const {name} = req.body; 
      
    res.send(`Welcome ${name}`); 
}) 
app.listen(3000, (err) => {
    if (!err) {
    console.log("[*]Server is listening on port 3000")
    } else {
        console.log("An error has occured!")
    }
});