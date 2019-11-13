const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
var base64Img = require('base64-img');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname + "/public" });
});

app.get("/take-photo", (req, res) => {
    res.sendFile("takephoto.html", { root: __dirname + "/public" });
});

app.post('/upload', (req, res) => {
    if (req.body) {
        //res.json(req.body);
        let img = req.body.photo;

        // var base64Data = img.replace(/^data:image\/\w+;base64,/, "");
        // fs.writeFile(__dirname + "/public/faces/yahia.png", base64Data, 'base64', function (err) {
        //     console.log(err);
        // });
        
    //    var data = img.replace(/^data:image\/\w+;base64,/, "");
        // var data = img.split(';base64,').pop();
        // res.json(data);
        // var buf = Buffer.from(data, 'base64');
        // fs.writeFileSync(__dirname + "/public/faces/qq.png", data, {encoding: 'base64'}, (err, result) => {if (err) console.log('error', err)});

        base64Img.img(img, __dirname + "/public/faces/", '1', function(err, filepath) {});
    }
    else throw 'error';
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
