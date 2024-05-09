import express from 'express';
import { Client } from 'basic-ftp';

const Data = async (addr, user, password, port, folders) => {
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
        let folderCount = {};
        let fileCountInFolder = 0;
        for (let i = 0; i < (folders.paths).length; i++) {
            await client.cd(folders.paths[i]);
            fileCountInFolder = (await client.list()).length;
            folderCount[folders.paths[i]] = fileCountInFolder;
            await client.cd("/");
        }
        // The total number of files in the server
        folderCount["NumberOfFiles"] = data;
        console.log(folderCount)
        client.close()
        return folderCount;
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
        
        return response.code
    } catch (err) {
        return err.code;
    }    
}

const NewConnection = async (addr, user, password, port) => {
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

        return true;

    } catch(err) {
        console.log(`Unable to establist connection with ${addr}`);
        return false;
    }
}

const getFolderData = async (addr, user, password, folderPath, port) => {
    const result = await CheckFolder(addr, user, password, folderPath, port);
    return result;
}

const getData = async (addr, user, password, port, folders) => {
    const result = await Data(addr, user, password, port, folders);
    return result;
}

const getNewConnection = async (addr, user, password, port) => {
    const result = await NewConnection(addr, user, password, port);
    return result;
}
const app = express();
const router = express.Router();

router.get('/sendData/:address&:user&:password&:port&:folders', function(req, res) {
    
    getData(req.params.address, req.params.user, req.params.password, req.params.port, JSON.parse(req.params.folders)).then(folderCount => {
                
        res.json(folderCount);
        console.log(`${req.params.address} total files is: ${folderCount.NumberOfFiles}`)
    })
    
   
});

router.get('/checkFolder/:address&:user&:password&:port&:folderPath', function(req, res) {
    getFolderData(req.params.address, req.params.user, req.params.password, req.params.folderPath, req.params.port).then(ans => {
        console.log(`Connected to ${req.params.folderPath}: ${ans}`);
        const data = {
            code: ans
        }
        res.json(data);
    })
})

router.get('/checkConnection/:address&:user&:password&:port', function(req, res) {
    getNewConnection(req.params.address, req.params.user, req.params.password, req.params.port).then(code => {
        console.log(`Connection code with ${req.params.address}: ${code}`);
        const data = {
            code: code
        }
        res.json(data);
    })
})

app.use('/', router);

app.listen(5050, (err) => {
    if (!err) {
    console.log("[*]Server is listening on port 5050")
    } else {
        console.log("An error has occured!")
    }
});