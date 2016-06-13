var API_DOMAIN = "https://api.instagram.com/v1";
var RECENT_MEDIA_PATH = "/users/self/media/recent";

$(document).ready(function() {
  var token = window.location.hash;
  if (!token) {
    window.location.replace("./login.html");
  }
  token = token.replace("#", "?"); // Prepare for query parameter
  var mediaUrl = API_DOMAIN + RECENT_MEDIA_PATH + token;

  $.ajax({
    method: "GET",
    url: mediaUrl,
    dataType: "jsonp",
    success: handleResponse,
    error: function() {
      alert("there has been an error...")
    }
  })
});

var SentimentCounter=0;
var positive=0;
function getSentiment(text){   
  $.ajax({
    method: "GET",
    url:"https://twinword-sentiment-analysis.p.mashape.com/analyze/",
    headers:{"X-Mashape-Key": "PbStp7XTqcmshozwb4sA09AZRaTEp1qKVYHjsnE0LcKWj66qWd",
    "Accept": "application/json",
    },
    data: "text=" + text,
    // $.each(data, function(i,text:response.data[i].caption.text));
    success: analyzeSentiment,
  });
}

function analyzeSentiment(result) {
  positive=positive+result.score;
  $(".photos"+SentimentCounter).append("<div></div>"+ "positivity: " + result.score);
  $(".photos"+SentimentCounter).append("<div></div>"+ "type: " + result.type);
  SentimentCounter++;
  $(".sentiment").text(positive);
}

function handleResponse(response) {
  for (var i=0; i < response.data.length; i++) {
    var image_link = response.data[i].images.standard_resolution.url;
    var img = $("<div>"+"<img src='" + image_link + "' />" + response.data[i].caption.text +"</div>").addClass("photos"+i);
    $("#list").append(img);
    getSentiment(response.data[i].caption.text);
  }

  ego(response);
  popularity(response);
  averageWords(response);
  time(response);
  thirst(response);
}

function ego(response) {
  var liked = 0;
  var unliked = 0;
  for (var i=0; i < response.data.length; i++) {
    if (response.data[i].user_has_liked === false) {
      unliked++
    }
    else if (response.data[i].user_has_liked === true) {
      liked ++;
    }
  }
  var percent = (liked/response.data.length)*100;
  $(".ego").text(percent);
}

function popularity(response) {
  var likes = 0;
  for (var i=0; i < response.data.length; i++) {
    likes = likes + response.data[i].likes.count;
  }
  var avg = likes/response.data.length;
  $(".popularity").text(avg);
}

function averageWords(response){
  var words = 0;
  for (var i=0; i < response.data.length; i++) {
    var splitWords = response.data[i].caption.text.split(" ");
    words = words + splitWords.length;
  }
  var avgWords = words/response.data.length;
  $(".brevity").text(avgWords);
}

function time(response){
  var weekDays = [0, 0, 0, 0, 0, 0, 0]
  var weekNames = ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  for (var i = 0; i < response.data.length; i++) {
  var date = new Date(parseInt(response.data[i].created_time) * 1000);
  var dayOfTheWeek = date.getDay();
  weekDays[dayOfTheWeek]++; 
  }
  var largest = Math.max.apply(Math, weekDays);
  var largestNum;
  for (var i = 0; i < 7 ; i++){
    if(weekDays[i] === largest) {
      $(".active").append(weekNames[i])
    }
  }
}

function thirst(response){
  var hashtags = 0;
  for (var i=0; i < response.data.length; i++){
    hashtags = hashtags + response.data[i].tags.length;
  }
  var avgTags = hashtags/response.data.length;
  $(".visibility").append(avgTags);
}
