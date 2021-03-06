const http = require('http');
const fs = require("fs");
const request = require('request');
const { error } = require('console');


const HomeFile = fs.readFileSync("index.html", "utf-8");

let port = process.env.PORT || 5000;

const replaceVal = (tempVal, orgval) => {
    let temperature = tempVal.replace("{%tempval%}", (orgval.main.temp-273).toFixed(2));
     temperature = temperature.replace("{%tempmin%}", (orgval.main.temp_min-273).toFixed(2));
     temperature = temperature.replace("{%tempmax%}", (orgval.main.temp_max-273).toFixed(2));
     temperature = temperature.replace("{%location%}", orgval.name);
     temperature = temperature.replace("{%country%}", orgval.sys.country);
     temperature = temperature.replace("{%tempstatus%}", orgval.weather[0].main);
    return temperature;
    
}


const server = http.createServer((req, res) => {
    var city= "Delhi"
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=439d72ba3d8a0a1fc8da79b62e3ef664`
    if (req.url == "/") {
        request(url)

        .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            console.log('arrdata : ' + arrData[0].main)
            var temp1=((arrData[0].main.temp)-273);
            console.log(temp1.toFixed(2));
            const realTimeData =arrData.map((val) => replaceVal(HomeFile, val)).join("")
            res.write(realTimeData);
        })
        .on("end", function (err){
            if(err) return console.log("connection closed due to erroe",err);
            res.end();
        });
}
})

server.listen(port);

