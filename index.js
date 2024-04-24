import express from 'express';
import { Client } from 'basic-ftp';

async function Data() {
    const client = new Client();
    var data;
    client.ftp.verbose = false;
    try {
        await client.access({
            host: 'eu-central-1.sftpcloud.io',
            user: '1375dcb65a7d4f15816b7f7e2f524d5f',
            password: 'uPK4bVnGQ46m0NnNhHrNBXytKNVbyLoZ',
            secure: false
        })
        data = (await client.list()).length;
        client.close()
        return data;
    } catch (err) {
        return err;
    }    
}

const getData = async () => {
    const result = await Data();
    return result;
}

const app = express();

app.get('/api/data', function(req, res) {
    getData().then(count => {
        const data = {
            NumberOfFiles: count
        };
        res.json(data);
    })
   
});

app.listen(3000, () => {console.log("Server is listening on port 3000")});