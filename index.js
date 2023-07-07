const http = require("http");
const fs = require("fs");
const requests = require("requests");
const path = require("path");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    requests('https://api.openweathermap.org/data/2.5/weather?q=Lahore&appid=9b0f16d840bd8a00c24ee143fa5ae0c6')
      .on("data", function (chunk) {
        let objData = JSON.parse(chunk);
        let temperature = (((objData.main.temp) - 273.15).toFixed(2));
        let minTemp = (((objData.main.temp_min) - 273.15).toFixed(2));
        let maxTemp = (((objData.main.temp_max) - 273.15).toFixed(2));
        let country = objData.sys.country;
        let city = objData.name;
        let tempStatus= objData.weather[0].main;

        fs.readFile(path.join(__dirname, "home.html"), "utf-8", (err, data) => {
          data = data.replace("{%tempVal%}", temperature);
          data = data.replace("{%tempMin%}", minTemp);
          data = data.replace("{%tempMax%}", maxTemp);
          data = data.replace("{%country%}", country);
          data = data.replace("{%city%}", city);
          data = data.replace("{%tempStatus%}", tempStatus);

          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        });
      })
      .on("end", function (err) {
        console.log("Connection closed");
      });
  } 
  else if (req.url === "/home.css") {
    const cssPath = path.join(__dirname, "home.css");
    fs.readFile(cssPath, "utf-8", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/css" });
      res.end(data);
    });
  } 

  
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is running on http://127.0.0.1:8000");
});
