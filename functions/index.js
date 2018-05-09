const functions = require("firebase-functions")
var request = require("request")
var RSVP = require("rsvp")
var requestPromise = RSVP.denodeify(request)

var viewBase = "https://en.m.wikipedia.org/wiki/"
function getArticle(name) {
  return requestPromise(viewBase + name + "?action=render").then(r =>
    r.body.replace(/\/\/en\.wikipedia\.org\/wiki\//g, "/wiki/")
  )
}

exports.fetchPage = functions.https.onRequest((request, response) => {
  response.set("Access-Control-Allow-Origin", "*")
  response.set("Access-Control-Allow-Methods", "GET, POST")
  var name = request.params[0]
  getArticle(name.slice(1))
    .then(html => response.send(html))
    .catch(e => response.send(e))
})
