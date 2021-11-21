const { ESRCH } = require("constants");
const http = require("http");
const fs = require("fs");
const { default: axios } = require("axios");
const port = 8080;
const server =http.createServer((req,response)=>{
    console.log(req.url)
    if(req.url == "/"){
        
        if (fs.existsSync("index.html")){
            console.log("File exists")
        } else{

        let text = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
        <h1> Hello World </h1>
            
        </body>
        </html>`
        fs.writeFileSync("./index.html", text, err =>{
            if (err){
                console.error(err)
                return
            }

        });
        
        
        console.log("file created");
    }     
    let htmlfile = fs.readFileSync("./index.html");
    response.writeHead(200 , {"content-type":"text/html"});
        response.write(htmlfile)
        response.end();
    } 
    else if( req.url == "/books"){
        response.writeHead(200 , {"content-type":"application/JSON"});
        axios.get("https://api.itbook.store/1.0/search/mongodb")
        .then((apidata)=>{
            response.write(JSON.stringify(apidata.data.books));
            response.end();
        })
        .catch((err)=>{
            console.log(err)
        })
        
    }else if (req.url == "/video"){
       
       fs.readFile("./videoTobeDisplayed.mp4", (err,datsa)=>{
           if(!err){
            response.writeHead(200, {"content-type": "video/mp4"});
            response.write(datsa);
            response.end();
           }
       });
    

    }else {
        response.writeHead(404, {"constent-type" : "text/html"});
        response.write(`404 page not found`);
        response.end();
    }

   

})

server.listen(port , (err) =>{
    if(err){
        console.log(`something is wrong`)
    }else {
        console.log(`server started running in port 8080.`)
    }
})

