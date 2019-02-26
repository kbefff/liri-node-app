var axios = require("axios");
// add code to read and set any environment variables with the dotenv package

require('dotenv').config();
var Spotify = require('node-spotify-api');
var moment = require('moment');
var fs = require("fs");

//  add the code required to import the `keys.js` file and store it in a variable
var keys = require("./keys.js");
// access your keys information
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var nodeArgs = process.argv;
var media = "";

for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        media = media + "+" + nodeArgs[i];
    } else {
        media += nodeArgs[i];
    }
}


var runCommand = function () {
    if (command === "spotify-this-song") {
        if (media === "") {
            media = "the song ace of base";
        }
        spotify.search({
            type: 'track',
            query: media,
            limit: 1
        }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Song title: " + data.tracks.items[0].name);
            console.log("Preview link: " + data.tracks.items[0].external_urls.spotify);
            console.log("Album: " + data.tracks.items[0].album.name);
        });
    } else if (command === "movie-this") {
        if (media === "") {
            media = "Mr. Nobody";
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + media + "&y=&plot=short&apikey=trilogy";

        axios.get(queryUrl).then(
            function (response) {
                console.log("Title: " + response.data.Title);
                console.log("Release Year: " + response.data.Year);
                console.log("IMDB Rating: " + response.data.Ratings[0].Value);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                console.log("Country Produced: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
                // console.log(response.data);
            }
        );
    } else if (command === "concert-this") {
        var queryUrl = "https://rest.bandsintown.com/artists/" + media + "/events?app_id=codingbootcamp";

        axios.get(queryUrl).then(
            function (response) {

                var eventTime = response.data[0].datetime;

                console.log("Venue: " + response.data[0].venue.name);
                console.log("Venue Location: " + response.data[0].venue.city);
                console.log("Date of Event: " + moment(eventTime).format("MM/DD/YYYY"));
            }
        );
    } else if (command === "do-what-it-says") {

        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }
            var dataArr = data.split(",");

            command = dataArr[0];
            media = dataArr[1];
            runCommand();
        });

    }

}


runCommand();