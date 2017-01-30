// possible apis:
// google, flickr, yahoo

// data to return:
// url, thumbnail, summary?

// insert query+date into db

var mongo = require('mongodb').MongoClient
const request = require('request')
var express = require('express')
var app = express()
var http = require('http') //remove

var flickrAPIKey = "api_key=<private>"
//var flickrAPIKey = process.env.FLICKR_API_KEY
var flickrURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&sort=relevance&" + flickrAPIKey + "&format=json&nojsoncallback=1"

app.get('/', function(req, res){
    res.sendFile(__dirname + '/html/index.html')
})

app.get('/api/imagesearch/:id', function(req, res) {
    var str = req.params.id
    var param = "&text=" + str
    
    //handle offset
    
    //format https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
    request(flickrURL+param, function (err, data, body) {
        if (err) throw err
        else if (data.statusCode === 200) {
            const json = JSON.parse(body)
            //process data
            res.send(json)
        }
        else {
            console.log("error")
            res.send('error')
        }
    })
})

app.get('/api/latest/imagesearch/', function(req, res) {
    //send list of latest queries
})

app.get('*', function(req, res){
    res.redirect('/')
})

app.listen(process.env.PORT)