import http from 'node:http';
// const http = require("node:http")
import { nanoid } from 'nanoid'
const PORT = 3000;
const HOST = "localhost";
// let Count = 0;
const data = [];
const dataWithOutDeleted = [];

//nanoid
function DataRepresentation(){
  dataWithOutDeleted.length = 0
  data.forEach(element => {
    if(element.deleted != true)
    {
      const newItemNonDelete = {
        id: element.id, // str
        text: element.text,
        isMarked: element.isMarked,
      };
      dataWithOutDeleted.push(newItemNonDelete);
    }
  });
}


const HTTP_STATUS = {
  NOT_FOUND: 404,
  OK_MESSAGE: 200,
  BAD_REQUEST: 400 
};

const server = http.createServer((req, res) => {

  const { url, method } = req;
  const [controller, IdFromUrl] = url.split("/").filter((part) => part);
  const JsonID = nanoid()

  function IdEmptyOrNot(){
    if(IdFromUrl==undefined)
    {
      return true;
    }
    else{
      return false;
    }
  }
  switch (
    controller // Do we really need it ?
  ) {
    case "mainpage":
      switch (method + IdEmptyOrNot()) {
        case "GET" + true:
          DataRepresentation()
          res.writeHead(HTTP_STATUS.OK_MESSAGE, { "Content-Type": "application/json" });
          res.end(JSON.stringify(dataWithOutDeleted));
          break;
        case "POST" + true:
          req.on("data", function (chunk) {
            try {
              const rawData = JSON.parse(chunk.toString());

              const newItem = {
                id: JsonID, // str
                text: rawData.text,
                isMarked: rawData.isMarked,
                deleted: false
              };
              if(rawData.text==""||rawData.text==null)
              {
                throw new Error("Вы ввели пустую строку"); 
              }
              data.push(newItem);

              res.writeHead(HTTP_STATUS.OK_MESSAGE, { "Content-Type": "application/json" });
              res.end(JSON.stringify(newItem));
            } catch (error) {
              res.writeHead(HTTP_STATUS.BAD_REQUEST, { "Content-Type": "application/json" });
              res.end(JSON.stringify(error.message));
            }
          });
          break;
        case "DELETE"+false:
          data.forEach((element) => {
            if (element.id == IdFromUrl) {
              element.deleted = true
            }
          });
          DataRepresentation()
          // data.splice(IdFromUrl-1, 1)
          res.writeHead(HTTP_STATUS.OK_MESSAGE, { "Content-Type": "application/json" });
          res.end(JSON.stringify(dataWithOutDeleted));
          break;
        case "PUT"+false:
          req.on("data", function (chunk) {
            try{
            const rawData = JSON.parse(chunk.toString());

            data.forEach((element) => {
              if (element.id == IdFromUrl) {
                element.text = rawData.text;
                element.isMarked = rawData.isMarked;
              }
            });
            if(rawData.text==""||rawData.text==null)
            {
              throw new Error("Вы ввели пустую строку"); 
            }
            DataRepresentation()
            res.writeHead(HTTP_STATUS.OK_MESSAGE, { "Content-Type": "application/json" });
            res.end(JSON.stringify(dataWithOutDeleted));
          } catch (error) {
            res.writeHead(HTTP_STATUS.BAD_REQUEST, { "Content-Type": "application/json" });
            res.end(JSON.stringify(error.message));
          }
          });
          break;
          default: {
            res.writeHead(HTTP_STATUS.NOT_FOUND, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify(
                "Not Found"
              )
            );
      }
      break;
    }
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});