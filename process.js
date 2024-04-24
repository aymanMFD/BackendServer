import { Client } from 'basic-ftp';


export async function Data() {
    const client = new Client();
    console.log("here");
    var data;
    client.ftp.verbose = true;
    try {
        await client.access({
            host: 'eu-central-1.sftpcloud.io',
            user: '15841b448d3f441991e7146685ccc56e',
            password: 'OSTZvGZJXptuppcjNLnNo7JDrm7Hg7Ng',
            secure: false
        })
        console.log("Connection successful");
        data = (await client.list()).length;
        client.close()
        console.log(data);
        return data;
    } catch (err) {
        return err;
    }

    return data
    
}
