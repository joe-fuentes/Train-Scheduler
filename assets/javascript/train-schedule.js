/* global firebase moment */

// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyDF1NvcKKTTYCIi2L051Yth42JGulgin6A",
  authDomain: "trainstrains-90e1e.firebaseapp.com",
  databaseURL: "https://trainstrains-90e1e.firebaseio.com",
  projectId: "trainstrains-90e1e",
  storageBucket: "trainstrains-90e1e.appspot.com",
  messagingSenderId: "755212611853"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Create button for adding new trains - then update the html + update the database
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#inputTrainName").val().trim();
  var destination = $("#inputDestination").val().trim();
  var trainStartTime = moment($("#inputStartTime").val().trim(), "HHmm").format("X");
  var trainRate = $("#inputTrainRate").val().trim();

  // Creates local "temporary" object for holding train data
  var newtrain = {
    name: trainName,
    destination: destination,
    start: trainStartTime,
    rate: trainRate
  };

  // Uploads train data to the database
  database.ref().push(newtrain);

  // Logs everything to console
  console.log(newtrain.name);
  console.log(newtrain.destination);
  console.log(newtrain.start);
  console.log(newtrain.rate);

  // Alert
  alert("Train's name successfully added");

  // Clears all of the text-boxes
  $("#inputTrainName").val("");
  $("#inputDestination").val("");
  $("#inputStartTime").val("");
  $("#inputTrainRate").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  //console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainRate = childSnapshot.val().rate;
  var currentTime = moment().format("X");

  // 4. Created a way to calculate the time of the train's next arrival...
  currentTimeNumber = parseInt(currentTime);
  trainStartNumber = parseInt(trainStart);
  trainRateNumber = parseInt(trainRate);

  // Using a while loop to keep appending the train's start time with its trip duration.
  while(currentTimeNumber > trainStartNumber){
    trainStartNumber += trainRateNumber*60;
  }

  var trainArrival = trainStartNumber;
  var timeUntilTrainArrives = trainArrival - currentTimeNumber;

  //Then use moment.js formatting to set difference in minutes.
  var nextTrainArrival = moment.unix(trainStartNumber).format("h:mm a").toString();
  var trainMinutesAway = moment.unix(timeUntilTrainArrives).format("m");

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainRate + "</td><td>" + nextTrainArrival + "</td><td>" + trainMinutesAway + "</td></tr>");
});