import express from 'express';

import { Client } from 'basic-ftp';

Data();

async function Data() {
    const client = new Client();

    const app = express();

    var data;
    client.ftp.verbose = false;
    try {
        await client.access({
            host: 'eu-central-1.sftpcloud.io',
            user: '4b1dffe9cdbc4ac1959a6562c36d5702',
            password: '2LJpMWbNpUlEqMybaUYCMJitnyVKVzgM',
            secure: false
        })
        console.log("Connection successful");
        data = (await client.list()).length;
        client.close()
    } catch (err) {
        console.log(err);
    }

    app.get('/api/data', function(req, res) {
        const count = data;
        console.log(count);
        const data1 = {
            message: count
        };
        res.json(data1);
    });

    app.listen(3000, () => {console.log("Server is listening on port 3000")});
}


