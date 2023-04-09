const http = require('node:http');

PORT = 3000;
HOST = 'localhost';
let Count = 0;
const data = [];

const server = http.createServer((req, res) => {
    
    const {url, method} = req;
    const [controller, IdFromUrl] = url.split('/').filter(part => part)
    

    // console.log({url})
    // console.log({method})

    // console.log(urls)


    switch(controller)
    {
        case "mainpage":
            switch(method)
            {
                case "GET":
                    if(IdFromUrl!=undefined)
                    {
                        res.writeHead(404, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify("Запрос типа GET может быть только .../mainpage и ничего после"));
                        return;
                    }
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(data));
                    break;
                case "POST":
                    if(IdFromUrl!=undefined)
                    {
                        res.writeHead(404, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify("Запрос типа POST может быть только .../mainpage и ничего после"));
                        return;
                    }
                    
                    req.on("data", function(chunk){
                        try {
                        const rawData = JSON.parse(chunk.toString());

                        const newItem = {
                            id: ++Count,
                            text: rawData.text,
                            isMarked: rawData.isMarked
                        }

                        data.push(newItem)
                        
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(newItem));
                    } catch (error) {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(error.message));
                    }
                    })
                    
                    
                    break;
                    case "DELETE":
                        data.forEach((element,index) => {
                            if (element.id==IdFromUrl) {
                                data.splice(index,1)
                            }
                        });
                        // data.splice(IdFromUrl-1, 1)
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(data));
                    break;
                    case "PUT":
                        req.on("data", function(chunk){
                            const rawData = JSON.parse(chunk.toString());
    
                            data.forEach(element => {
                                if (element.id==IdFromUrl) {
                                    element.text = rawData.text;
                                    element.isMarked = rawData.isMarked;
                                }
                            });
                            
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(data));
                        })
                        break;
            }
            break;
    }
});



server.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});