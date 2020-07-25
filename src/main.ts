import * as https from "https";
import * as process from "process";
import * as querystring from "querystring";
import md5 = require("md5");
import {appId, secret} from "./privite";

export const translate = (word:string) => {
    let from
    let to
    if(/[a-zA-Z]/.test(word[0])){
        // en=>zh
        from='en'
        to='zh'
    }else{
        //zh=>en
        from='zh'
        to='en'
    }
    const salt = Math.random()
    const sign = md5(appId + word + salt + secret)
    const query: string = querystring.stringify({
        q: word,
        from: from,
        to: to,
        appid: appId,
        salt: salt,
        sign: sign
    })
    const options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?'+query,
        method: 'GET'
    };

    const request = https.request(options, (response) => {
        let chunks:Buffer[]=[]
        response.on('data', (chunk) => {
            chunks.push(chunk)
        });
        response.on('end',()=>{
            const string=Buffer.concat(chunks).toString()
            type BaiDuResult={
                from:string
                to:string
                trans_result:[
                    {
                        src:string
                        dst:string
                    }
                ]
                error_code?:string
                error_msg?:string
            }
            const object:BaiDuResult=JSON.parse(string)
            if(object.error_code){
                console.error(object.error_msg)
                process.exit(2)
            }else {
                console.log(object.trans_result[0].dst)
                process.exit(0)
            }
            // console.log(object.trans_result.forEach(item=>item.dst))
        })
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
}