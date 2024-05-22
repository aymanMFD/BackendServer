import { Client } from 'basic-ftp';

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
        console.log("Connected to ", folderPath);
        return response.code
    } catch (err) {
        return err.code;
    }    
}