const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https"); 


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));                      // allows us to use static files on our server... all in one public file


app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");           // request the home route("/") from our server
});


app.post("/", function(req, res){
    let firstName = req.body.fName;                     // fetch first name input data from the signup page
    let lastName = req.body.lName;
    let email = req.body.email;

    const data = {                                      // create a data object from signup page to send to mailchimp api
        members: [                                      // required object for api interaction
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);              // compress data to send to api and display on mailchimp site

    
    const url = "https://us21.api.mailchimp.com/3.0/lists/e44793dce5"; // url = "https://(usx).api.mailchimp.com/3.0/(lists/{list_id})"  usx - # at the end of the api key(region)
    const options = {                                   // post request and authorization w/ api key
        method: "POST",
        auth: "sheriff:adbf96aac8bc5ed87c7c8828a337ed9f-us21",
    }

    const request = https.request(url, options, function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");  // success page if data submitted successfully
        } else {
            res.sendFile(__dirname + "/failure.html");  // display failure page if error occurs
        }

        response.on("data", function(data){             // console.log data retrieved
            console.log(JSON.parse(data));
        })
    })
    
    request.write(jsonData);                            // write completed data to website
    request.end();
});

app.post("/success", function(req, res){                // redirect from success page back to home page
    res.redirect("/");
});

app.post("/failure", function(req, res){                // redirect from failure page back to home page
    res.redirect("/");
});



app.listen(port, function(){                            // display message if port is running correctly
    console.log("server is running on port 3000");
});