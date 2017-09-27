"use strict";

var express = require("express");
var requestengine = require("request");

var app = express();
var accesstoken = "",
    authorizationcode = "";
var result = {},
    responseresult;





app.use("/", express.static(__dirname + "/../www")); 



app.set("port", process.env.PORT || 3000); 

var ForgeSDK = require("forge-apis");
var CLIENT_ID = "REDACTED",
    CLIENT_SECRET = "REDACTED",
    REDIRECT_URL = "http://localhost:3000/api/forge/callback/oauth";


var autoRefresh = true;




app.get("/api/forge/callback/oauth", function(request, response) {
    authorizationcode = request.query.code;
    

    requestengine({
        uri: "https://developer.api.autodesk.com/authentication/v1/gettoken",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"

        },

        form: {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: "authorization_code",
            code: authorizationcode,
            redirect_uri: REDIRECT_URL
        },
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10
    }, function(error, response, body) {
        

    });

    response.writeHead(301, {
        Location: "http://localhost:3000"
    });
    response.end();

});

app.post("/", function(request, response) {
    
    console.log(Date.now());
    
    responseresult = response;


    var oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(CLIENT_ID, CLIENT_SECRET, [
        "data:read",
        "account:read"
    ], false);

    oAuth2TwoLegged.authenticate().then(function(credentials) {
        

        accesstoken = credentials.access_token;
        requestengine({
            uri: "https://developer.api.autodesk.com/hq/v1/accounts/" + request.query.accountid + "/projects",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + accesstoken

            },
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        }, function(error, response, body) {

            result["projects"] = body;

            
            requestengine({
                uri: "https://developer.api.autodesk.com/hq/v1/accounts/" + request.query.accountid + "/companies",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + accesstoken

                },
                timeout: 10000,
                followRedirect: true,
                maxRedirects: 10
            }, function(error, response, body) {

                result["companies"] = body;

                
                requestengine({
                    uri: "https://developer.api.autodesk.com/hq/v1/accounts/" + request.query.accountid + "/users",
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + accesstoken

                    },
                    timeout: 10000,
                    followRedirect: true,
                    maxRedirects: 10
                }, function(error, response, body) {

                    result["users"] = body;

                    
                    requestengine({
                        uri: "https://developer.api.autodesk.com/hq/v1/accounts/" + request.query.accountid + "/business_units_structure",
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer " + accesstoken

                        },
                        timeout: 10000,
                        followRedirect: true,
                        maxRedirects: 10
                    }, function(error, response, body) {



                        result["business_units_structure"] = body;

                        
                        responseresult.send(result);




                    });



                });



            });



        });




    }, function(err) {
        console.error(err);
    });




});




module.exports = app;