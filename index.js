var express = require('express')
var cassandra = require('cassandra-driver');
const multer = require("multer");
var fs = require('file-system');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var storage = multer.memoryStorage()
var upload = multer({ dest: 'uploads/',storage: storage})

var app = express()
const client = new cassandra.Client({ contactPoints: ['localhost'], localDataCenter: 'datacenter1', keyspace: 'hw5' });

app.post('/deposit',upload.single('contents'),function(req,res){
    console.log(req.file.buffer)
   // fs.readFile(req.file.buffer, function(err, buffer){
        //if(err){console.log(err)}
        const query = "INSERT INTO imgs(filename,contents) VALUES(?, ?)"
        var params = [req.body.filename,req.file.buffer];
        client.execute(query, params, { prepare: true });
        res.send("OK");
    //})
    
})
app.get('/retrieve',jsonParser,function(req,res){
    var filename = req.body.filename
    console.log(filename)
    const query = "SELECT contents FROM imgs WHERE filename = ?"
    var params = [filename]
    client.execute(query,params,{prepare :true}, function (err, result) {
        if(err) return console.log(err);
        var contents = result.first();
        var data = contents.contents
        //data = fs.readFile(contents.contents);
        var type = filename.split('.')[1]
        var ct = 'image/'+type
        //The row is an Object with column names as property keys. 
        res.writeHead(200, {'Content-Type': ct})
        res.send(data)
      });
})


const port = 80



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
module.exports = app;