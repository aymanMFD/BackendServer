import express from "express";

const router = express.Router();

import { Client } from 'basic-ftp';

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


router.get('/sendData/:address&:user&:password', function(req, res) {
    
    getData(req.params.address, req.params.user, req.params.password).then(count => {
        const data = {
            NumberOfFiles: count
        };
        
        res.json(data);
        console.log("Number of Files found: ", data.NumberOfFiles)
    })
    
   
});

module.exports=router;