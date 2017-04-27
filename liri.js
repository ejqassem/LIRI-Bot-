//======================================================================================
//Global Variable declaration/node package import
var keys = require("./keys.js");
var Twitter = require("twitter");
var spotify = require('spotify');
var request = require('request');
var omdb = require('omdb');
var fs = require('fs');
var userInput = process.argv[3];

//======================================================================================
//Function declarations
function movieThis() {

  omdb.get({ title: userInput}, false, function(err, movie) {
      if(err) {
          return console.error(err);
      }
      if(!movie) {
          return console.log('Mr. Nobody');
      }
      var movieInfo = [];
      // console.log('%s (%d) %d/10', movie.title, movie.year, movie.imdb.rating);
      console.log(movie.title, movie.year, movie.imdb.rating);
      console.log(movie.plot);
      for( var i in movie.actors) {
        console.log(movie.actors[i]);
      }
      for (var i in movie.countries) {
        console.log("This movie was shown in " + movie.countries[i]);
      }
      console.log("The rotten Tomates URL is " + movie.tomato);

      movieInfo.push(movie.title, movie.year, movie.imdb.rating, movie.plot, movie.actors, movie.countries, movie.tomato);
      fs.appendFile("log.txt", movieInfo, function(err) {
        if(err) throw err;
        console.log("The data was appended to 'log.txt'");
      });
  });

}

function getTweets() {
  var client = new Twitter ({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });

  var params = {
    screen_name: 'IanTheGreat7'
  };

  var tweetArray = [];

  // show last 20 tweets and when they were created in terminal window
  client.get('statuses/user_timeline', params, function(error, tweets, response){
    for (var i = 0; i < tweets.length; i++) {
      if(!error) {
        console.log(tweets[i].text);
        console.log(tweets[i].created_at);
        tweetArray.push(tweets[i].text);
      }
      else if (error) {
        console.log(error);
      }
    }
    fs.appendFile("log.txt", tweetArray, function(err) {
      if(err) throw err;
      console.log("The data was appended to 'log.txt'");
    });

  });

}

function spotifyThis() {
// userInput === "song-name", used in server call to grab:
  // Artist
  // The song's name
  // A preview link from spotify
  // The album that the song is from
// If no song is provided, then default display = "The Sign" by Ace of Base
  var songArray = [];
  spotify.search({ type:'track', query: userInput}, function(err, data) {
    if(!err) {
      // console.log(data.tracks.items[0]);
      console.log("The artist is " + data.tracks.items[0].artists[0].name);
      console.log("The song's name is: " + data.tracks.items[0].name);
      console.log("A url to preview this song is: " + data.tracks.items[0].preview_url);
      console.log("The album this track is from " + data.tracks.items[0].album.name);

      songArray.push(data.tracks.items[0].artists[0].name, data.tracks.items[0].name, data.tracks.items[0].preview_url, data.tracks.items[0].album.name);
      fs.appendFile("log.txt", songArray, function(err) {
        if(err) throw err;
        console.log("The data was appended to 'log.txt'");
      });
    }
    else {
      console.log("'The Sign' by Ace of Base");
    }
  });
}

// Main LIRI Code
// =============================================================================================
if (process.argv[2] === "my-tweets") {

  // show last 20 tweets and when they were created in terminal window
  getTweets();

}

else if (process.argv[2] === "spotify-this-song") {

  spotifyThis();

}

else if (process.argv[2] === "movie-this") {

  movieThis();

}

else if (process.argv[2] === "do-what-it-says") {
  console.log('test');

  fs.readFile('./random.txt', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var dataArr = data.split(',');
    // console.log(dataArr);
    // console.log(dataArr[1]);
    userInput = dataArr[1];
    // console.log("userInput is " + userInput);

    if(dataArr[0] === "movie-this") {
      movieThis();
    }

    else if(dataArr[0] === "my-tweets") {
      getTweets();
    }

     if (dataArr[0] === "spotify-this-song") {
      spotifyThis();
    }

  });

}
