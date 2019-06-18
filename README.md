YelpCamp
========

A small demo App for register and look for campgrounds

Introduction
------------

You can see the live web site here: [YelpCamp](https://yelp-camp-v0.herokuapp.com "YelpCamp")
(hosted on [Heroku](https://heroku.com "Heroku Web Site")).  
I made this small app in order to practice my skills in Web technologies and point out my abilities.  
Check Usage for more details.

Technologies Used
-----------------

This web site have been created using mainly [Node.js](https://nodejs.org/en/ "Node.js")
and the [Express](https://expressjs.com/ "Express") minimalist framework.  
The authentication part is handle with [PassportJs](http://www.passportjs.org/ "PassportJs"),  I also used a non relationnal database: [MongoDB](https://www.mongodb.com/ "MongoDB").  
Finally, all geolocations and maps come from the [Google Map API](https://cloud.google.com/maps-platform/?hl=fr "Google Map API").

You can inspect the [package.json's](https://github.com/Roildan/YelpCamp/blob/master/package.json "package.json")
file to check all the [npm](https://www.npmjs.com/ "NPM") modules used.  

Usage
-----

As the [License](https://github.com/Roildan/YelpCamp/blob/master/LICENSE "License")'s file stipulate, you are free to use and modify all the content as long as you mention the author and don't accomplish that with a commercial purpose.

If you wish you run the app on your own server, will have to install [Node.js](https://nodejs.org/en/ "Node.js") and all the modules (see [package.json's](https://github.com/Roildan/YelpCamp/blob/master/package.json "package.json")) with [npm](https://www.npmjs.com/ "NPM").  
You should also setup the following environment variables:
  - **MONGODB_URI:**      *The URL of your Mongo DataBase.*
  - **PORT:**             *Port used (`3000` on Live Version).*
  - **IP:**               *Your IP address.*
  - **GEOCODER_API_KEY:** *Your Geocoder API Key from [Google Map API](https://developers.google.com/maps/documentation/geocoding/start "Geocoder API Guide").*
  - **ADMIN_CODE:**       *The Admin Code for creating admin users in SignUp (`admin` on Live Version).*

### User's Table (Live Version) ###
| Username  | Password | Status    |
| --------- | -------- | --------- |
| Roildan   | password | **Admin** |
| Linux     | password | **Admin** |
| Franck    | pass     | **/**     |
| Franck    | pass     | **/**     |
| Franck    | pass     | **/**     |
| Franck    | pass     | **/**     |

