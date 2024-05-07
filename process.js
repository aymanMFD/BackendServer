import { Client } from 'basic-ftp';

example();

async function example() {
    const client = new Client()
    client.ftp.verbose = false
    try {
        await client.access({
            host: "ftp.scene.org",
            user: "ftp",
            password: "password",
            secure: false
        })
        
        const x = await client.cd("/incoming/apply1212")
        console.log(x.code);;
        // console.log(await client.list())
    }
    catch(err) {
        console.log(err.code)
    }
    client.close()
}