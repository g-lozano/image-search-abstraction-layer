// possible apis:
// google, flickr, yahoo

// data to return:
// url, thumbnail, summary?

var mongo = require('mongodb').MongoClient
var express = require('express')
var app = express()

app.get('/api/imagesearch/:id', function(req, res){
    //
})

app.get('/api/latest/imagesearch/', function(req, res){
    //send list of latest queries
})

app.listen(process.env.PORT)