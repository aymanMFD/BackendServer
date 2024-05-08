import express from 'express';
import { Client } from 'basic-ftp';

const Data = async (addr, user, password, port) => {
    const client = new Client();
    var data;
    client.ftp.verbose = false;
    try {
        await client.access({
            host: addr,
            user: user,
            password: password,
            secure: false,
            port: port
        })
        data = (await client.list()).length;
        client.close()
        return data;
    } catch (err) {
        return err;
    }    
}

const CheckFolder = async (addr, user, password, folderPath, port) => {
    const client = new Client();
    
    client.ftp.verbose = false;
    try {
        await client.access({
            host: addr,
            user: user,
            password: password,
            secure: false,
            port: port
        })
        const response = await client.cd(folderPath);
        console.log("THIS IS THE LOG: ", response.code)
        return response.code
    } catch (err) {
        return err.code;
    }    
}

const getFolderData = async (addr, user, password, folderPath, port) => {
    const result = await CheckFolder(addr, user, password, folderPath, port);
    return result;
}

const getData = async (addr, user, password, port) => {
    const result = await Data(addr, user, password, port);
    return result;
}

const app = express();
const router = express.Router();

router.get('/sendData/:address&:user&:password&:port', function(req, res) {
    
    getData(req.params.address, req.params.user, req.params.password, req.params.port).then(count => {
        const data = {
            NumberOfFiles: count
        };
        
        res.json(data);
        console.log("Number of Files found: ", data.NumberOfFiles)
    })
    
   
});

router.get('/checkFolder/:address&:user&:password&:folderPath&:port', function(req, res) {
    getFolderData(req.params.address, req.params.user, req.params.password, req.params.folderPath, req.params.port).then(code => {
        console.log(`Checking folder ${req.params.folderPath}: ${code}`);
        const data = {
            code: code
        }
        res.json(data);
    })
})

app.use('/', router);

app.listen(3000, (err) => {
    if (!err) {
    console.log("[*]Server is listening on port 3000")
    } else {
        console.log("An error has occured!")
    }
});