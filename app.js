//npm init
//npm install express body-parser request dotenv

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  var listId = process.env.LIST_ID;
  var appKey = process.env.APP_KEY;

  var auth = "ravindrasubedi:" + appKey

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  var jsonData = JSON.stringify(data);

  var url = "https://us4.api.mailchimp.com/3.0/lists/" + listId;
  var options = {
    method: "POST",
    auth: auth
  };

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      if(response.statusCode === 200) {
        console.log("Signup successful");
        res.sendFile(__dirname + "/success.html");
      }
      else {
        console.log("Signup error : " + response.statusCode);
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

//process.env.PORT -> Dynamic port when deployed in Heroku
//||3000 -> when run locally
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
