const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname + "/public" });
});

app.get("/take-photo", (req, res) => {
    res.sendFile("takephoto.html", { root: __dirname + "/public" });
});

const directoryPath = path.join(__dirname, '/public/faces');

const faces = [];

fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 
        faces.push(file);
    });
});

app.get("/loadfaces", (req, res) => {
    res.status(200).send(faces);
    
});



const port = process.env.PORT || 8000
app.listen(port, () => console.log(`running at port ${port}`));
