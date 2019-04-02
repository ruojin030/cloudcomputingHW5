var express = require('express')
var cassandra = require('cassandra-driver');
const multer = require("multer");
var fs = require('file-system');
var storage = multer.memoryStorage()
var upload = multer({ dest: 'uploads/',storage: storage})

var app = express()
const client = new cassandra.Client({ contactPoints: ['localhost'], localDataCenter: 'datacenter1', keyspace: 'hw5' });

app.post('/deposit',upload.single('contents'),function(req,res){
    fs.readFile(req.file.buffer, function(err, buffer){
        if(err){console.log(err)}
        const query = "INSERT INTO imgs(filename,contents) VALUES(?, ?)"
        var params = [req.body.filename,buffer];
        client.execute(query, params, { prepare: true });
        res.send("OK");
    })
    
})
app.get('/retrieve',upload.none(),function(req,res){
    var filename = req.body.filename
    const query = "SELECT contents FROM imgs WHERE filename = ?"
    client.execute(query,filename, function (err, result) {
        if(err) return res.send("err")
        var contents = result[0];
        var type = contents.mimetype;

        //The row is an Object with column names as property keys. 
        res.writeHead(200, {'Content-Type': 'image/...' })
      });
})


const port = 80



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
module.exports = app;