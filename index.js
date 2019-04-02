var express = require('express')
var cassandra = require('cassandra-driver');
const multer = require("multer");
var Blob = require('blob');

var upload = multer({ dest: 'uploads/' })

var app = express()
const client = new cassandra.Client({ contactPoints: ['localhost'], localDataCenter: 'datacenter1', keyspace: 'hw5' });

app.post('/deposit',upload.single('contents'),function(req,res){
    console.log(req.file.buffer)
    var filename = req.body.filename
    var contents = req.file
    var fileBuffer = Buffer.from(contents)
    console.log(typeof fileBuffer)
    const query = "INSERT INTO imgs(filename,contents) VALUES(?, ?)"
    var params = [req.body.filename,Buffer.from(req.file)];
    client.execute(query, params, { prepare: true });
    res.send("OK");
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