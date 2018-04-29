
  // Initialize firebase
  var config = {
      apiKey: "AIzaSyBho5NnMK8tRweFk9fp-GMNk-6RmdVDZ_Q",
      authDomain: "train-mgeddes.firebaseapp.com",
      databaseURL: "https://train-mgeddes.firebaseio.com",
      projectId: "train-mgeddes",
      storageBucket: "train-mgeddes.appspot.com",
      messagingSenderId: "605583180511"
    };

    firebase.initializeApp(config);


  // Initialize variables
  var database = firebase.database();

  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = "";


  // Submit user input to be saved to database
  $(".btn").on("click", function(event) {
    event.preventDefault();

    trainName = $("#trainnameinput").val().trim();
    destination = $("#destinationinput").val().trim();
    firstTrainTime = $("#traintimeinput").val().trim();
    frequency = $("#frequencyinput").val().trim();

    database.ref().push({
        trainname: trainName,
        destination: destination,
        firsttraintime: firstTrainTime,
        frequency: frequency,
    });
  });


  // Calculate time until next train and next train arrival time
  database.ref().on("child_added", function(childSnapshot) {

    var tFrequency = childSnapshot.val().frequency;
    var firstTime = childSnapshot.val().firsttraintime;
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % tFrequency;
    var tMinutesTillTrain = tFrequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    // displays information
    $("tbody").append("<tr><td>" + childSnapshot.val().trainname +
    "</td><td>" + childSnapshot.val().destination +
    "</td><td>" + childSnapshot.val().frequency +
    "</td><td>" + moment(nextTrain).format("hh:mm") +
    "</td><td>" + tMinutesTillTrain +
    "</td></tr>");
})