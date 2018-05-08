var request = require("request")
var replaceStream = require("replacestream")

var viewBase = "https://en.m.wikipedia.org/wiki/"
var express = require("express")
var compression = require("compression")

const getArticleStream = name => {
  return request(viewBase + name + "?action=render").pipe(
    replaceStream("//en.wikipedia.org/wiki/", "/wiki/")
  )
}

const app = express()

app.set("port", process.env.PORT || 4000)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})

app.get(/(.+)/, compression(), (req, res) => {
  console.log(req.params)
  var name = req.params[0]

  var articleStream = getArticleStream(name.slice(1))

  try {
    res.status(200)
    res.type("html")
    articleStream.pipe(res)
  } catch (err) {
    console.log(err, err.stack)
    res.send(500, "Failed")
  }
})

app.listen(app.get("port"), function() {
  console.log("Server listening at localhost:" + app.get("port"))
})
