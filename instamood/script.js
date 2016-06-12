var API_DOMAIN = "https://api.instagram.com/v1";
var RECENT_MEDIA_PATH = "/users/self/media/recent";
// what do you think a variable in all caps means?


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

function handleResponse(response) {
  console.log(response);
  // add stuff here!
  for (var i=0; i < response.data.length; i++)
  {
    var image_link = response.data[i].images.standard_resolution.url;
    // var img = $("<img />").attr('src', image_link)
    var img = $("<img src='" + image_link + "' />");
    $("#list").append(img);
    $("#list").append(response.data[i].caption.text); 
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
  for (var i = 0; i < response.data.length; i++) {
  var date = new Date(parseInt(response.data[i].created_time) * 1000);
  var dayOfTheWeek = date.getDay();
  weekDays[dayOfTheWeek]++; 
  }
  var largest = Math.max.apply(Math, weekDays);
  if (largest === 0){
    $(".active").append("Sunday")
  }
  else if (largest === 1){
    $(".active").append("Monday")
  }
  else if (largest === 2){
    $(".active").append("Tuesday")
  }
  else if (largest === 3){
    $(".active").append("Wednesday")
  }
  else if (largest === 4){
    $(".active").append("Thursday")
  }
  else if (largest === 5){
    $(".active").append("Friday")
  }
  else if (largest === 6){
    $(".active").append("Saturday")
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















