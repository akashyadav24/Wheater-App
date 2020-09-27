const http = require('http');
const fs = require("fs");
const request = require('request');
const { error } = require('console');

const HomeFile = fs.readFileSync("home.html", "utf-8");

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
    if (req.url == "/") {
        request(
            " http://api.openweathermap.org/data/2.5/weather?q=Pune&appid=be11434ec4d029854c7b9e6a300dafc3")

        .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            var temp=((arrData[0].main.temp)-273);
           // console.log(temp.toFixed(2));
           const realTimeData =arrData.map((val) => replaceVal(HomeFile, val)).join("")
           res.write(realTimeData);
        })
        .on("end", function (err){
            if(err) return console.log("connection closed due to erroe",err);

            res.end();
        });
}
})

server.listen(8000, "127.0.0.1");
