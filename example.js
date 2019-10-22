const http = require('http');
const fs = require('fs');
const WebSocket = require("ws");
const firmata = require('firmata');


let board = new firmata.Board("/dev/ttyACM0", () => {
    board.pinMode(13, board.MODES.OUTPUT);
    board.pinMode(2, board.MODES.INPUT);
});


fs.readFile("./example04.html", (err, html) => {
    if(!err){
        const server = http.createServer( (req, res) => { 
         	res.writeHeader(200, {"Content-Type": "text/html"}); 
         	res.write(html); 
         	res.end(); 
        }).listen(8080, "192.168.1.223", () => {
    	  console.log("Server running ...");
        });       
    }else{
        console.log("Something's not right !");
    }
});

const wss = new WebSocket.Server({port: 8888});

    wss.on("connection", ws => {
        board.digitalRead(2, (value) => {
          if(value == 0){
              //Turn the led off
              board.digitalWrite(13, board.LOW);
            //   ws.send("OFF");
          }else if(value == 1){
              //Button pushed, Turn the led on 
              board.digitalWrite(13, board.HIGH);
              ws.send("ON", (err) => {
                  console.log("Could not send ! " + err);
              });
          }
        });    
    });


