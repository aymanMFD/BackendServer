///////////////////////////////////////////////////////////////////////////////////
// URL to API: https://backendserver-b2rl.onrender.com
///////////////////////////////////////////////////////////////////////////////////

import express from 'express';
import { Client } from 'basic-ftp';

const Data = async (addr, user, password, port, folders) => {
    const client = new Client();
    var data;
    client.ftp.verbose = false;

    // establishing connection
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

        // Iterate through the list of folders that are passed through the URL 
        for (let i = 0; i < (folders.paths).length; i++) {

            // Subpaths are shown as '/' and when passed to a URL, it can create a clash as URL considers '/' as another path
            // When passing the folders and subfolders through the URL, in the mobile app itself will convert the '/' to '@'
            let processedFolderPath = folders.paths[i].replaceAll("@", "/"); // Converting the '@' back to '/' to process.

            // 'cd' into the path and then checking how many files there are in the directory
            await client.cd(processedFolderPath);
            fileCountInFolder = (await client.list()).length;
            folderCount[folders.paths[i]] = fileCountInFolder;

            // returning back to the primary directory to then access another folder in the next iteration
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


// This function will only check if a folder exists or not in a server and return an adequate response
const CheckFolder = async (addr, user, password, folderPath, port) => {
    const client = new Client();
    
    client.ftp.verbose = false;
    // establishing connection 
    try {
        await client.access({
            host: addr,
            user: user,
            password: password,
            secure: false,
            port: port
        })
        const response = await client.cd(folderPath); // checking if folder exists by 'cd' in the directory 
        
        return response.code
    } catch (err) {
        return err.code;
    }    
}

// This function will only check if a server exists or not and return an adequate response
const NewConnection = async (addr, user, password, port) => {
    const client = new Client();
    client.ftp.verbose = false;

    // establishing connection
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

// The functions below are only to retrieve the results from their respective functions
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

// this route is used to get the number of files in the servers and respective paths
router.get('/sendData/:address&:user&:password&:port&:folders', function(req, res) {
    
    getData(req.params.address, req.params.user, req.params.password, req.params.port, JSON.parse(req.params.folders)).then(folderCount => {
                
        res.json(folderCount);
        console.log(`${req.params.address} total files is: ${folderCount.NumberOfFiles}`)
    })
    
   
});

// this route is only to check whether a path/folder exists
router.get('/checkFolder/:address&:user&:password&:port&:folderPath', function(req, res) {
    const folders = req.params.folderPath.replaceAll("@", "/");
    getFolderData(req.params.address, req.params.user, req.params.password, folders, req.params.port).then(ans => {
        console.log(`Connected to ${req.params.folderPath}: ${ans}`);
        const data = {
            code: ans
        }
        res.json(data);
    })
})


// this route is only to check whether a ftp server exists
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
