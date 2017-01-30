//
var mongo = require('mongodb').MongoClient
var request = require('request')
var express = require('express')
var app = express()

var flickrAPIKey = process.env.FLICKR_API_KEY
var mongodbURL = process.env.MONGOLAB_URI
var flickrURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&sort=relevance&format=json&nojsoncallback=1&per_page=10&" + flickrAPIKey

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/html/index.html')
})

app.get('/api/imagesearch/:id', function(req, res) {
    var str = req.params.id
    var offset = Number(req.query.offset)

    var param = "&text=" + str
    if (offset)
        param += "&page=" + offset

    request(flickrURL + param, function(err, data, body) {
        if (err) throw err
        else if (data.statusCode === 200) {

            var when = new Date();

            var info = {
                term: str,
                when: when
            }

            mongo.connect(mongodbURL, function(err, db) {
                if (err) throw err
                var collection = db.collection('image-search-terms')
                collection.insert(info, function(err, data) {
                    if (err) throw err
                    db.close()
                })
            })

            var json = JSON.parse(body) //returns array
            var photos = json.photos.photo
            var sendData = []

            photos.forEach(function(photo) {
                var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg"
                var page = "https://www.flickr.com/photos/" + photo.owner + "/" + photo.id
                var temp = {
                    title: photo.title,
                    url: url,
                    page: page
                }
                sendData.push(temp)
            })

            res.send(sendData)
        }
        else {
            res.send({
                error: 'error'
            })
        }
    })
})

app.get('/api/latest/imagesearch/', function(req, res) {

    mongo.connect(mongodbURL, function(err, db) {
        if (err) throw err
        var collection = db.collection('image-search-terms')
        collection.find({}, {
            _id: 0
        }).sort({
            $natural: -1
        }).limit(10).toArray(function(err, data) {
            if (err) throw err
            else {
                res.send(data)
            }
            db.close()
        })
    })
})

app.get('*', function(req, res) {
    res.redirect('/')
})

app.listen(process.env.PORT)
