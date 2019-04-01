var express = require('express')
var cassandra = require('cassandra-driver');
var bodyParser = require('body-parser');

var app = express()
var jsonParser = bodyParser.json()
const client = new cassandra.Client({ contactPoints: ['localhost'], localDataCenter: 'datacenter1', keyspace: 'hw5' });


///deposit { filename: (type=text), contents: (type=file) }
app.post('/deposit', jsonParser,function(req,res){
    var filename = req.body.filename
    var contents = req.body.contents
    console.log(req.body)
    const query = "INSERT INTO imgs(filename,contents) VALUES(?, ?)"
    var params = [filename,contents];
    client.execute(query, params, { prepare: true });
    res.send("OK");
})
app.get('/retrieve',jsonParser,function(req,res){
    var filename = req.body.filename
    const query = "SELECT contents FROM imgs WHERE filename = ?"
    client.execute(query,filename, function (err, result) {
        if(err) return res.send("err")
        var contents = result.first();
        //The row is an Object with column names as property keys. 
        res.writeHead(200, {'Content-Type': 'image/...' })
      });
})


const port = 80



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
module.exports = app;