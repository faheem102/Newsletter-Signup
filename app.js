const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
mailchimp.setConfig({
  apiKey: "4b99063508e75fabca517b497e00370d-us11",
  server: "us11",
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const run = async () => {
    const response = await mailchimp.lists.batchListMembers("3e595ca4b2", {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
          },
        },
      ],
    });
    if (response.error_count) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      res.sendFile(__dirname + "/success.html");
    }
  };

  run();
});
app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000");
});
