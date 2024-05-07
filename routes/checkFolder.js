import express from "express";

const router = express.Router();

import { Client } from 'basic-ftp';


const CheckFolder = async (addr, user, password, folderPath) => {
    const client = new Client();
    
    client.ftp.verbose = false;
    try {
        await client.access({
            host: addr,
            user: user,
            password: password,
            secure: false
        })
        const response = await client.cd(folderPath);
        return response.code
    } catch (err) {
        return err.code;
    }    
}

const getFolderData = async (addr, user, password, folderPath) => {
    const result = await CheckFolder(addr, user, password, folderPath);
    return result;
}

router.get('/checkFolder/:address&user&:password&:folderPath', function(req, res) {
    getFolderData(req.params.address, req.params.user, req.params.password, req.params.folderPath).then(code => {
        console.log(`Checking folder ${folderPath}: ${code}`);
        res.send(code);
    })
})

module.exports=router;