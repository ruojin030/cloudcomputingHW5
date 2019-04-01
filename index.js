var express = require('express')
var cassandra = require('cassandra-driver');
var bodyParser = require('body-parser');

var app = express()
var jsonParser = bodyParser.json()
const client = new cassandra.Client({ contactPoints: ['130.245.171.151'], localDataCenter: 'datacenter1', keyspace: 'hw5' });
client.connect(function (err) {
    if(err){
        console.log(err)
    }
});

///deposit { filename: (type=text), contents: (type=file) }
app.post('/deposit', jsonParser,function(req,res){
    var filename = req.body.filename
    var contents = req.body.contents
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


const port = 3000



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
module.exports = app;