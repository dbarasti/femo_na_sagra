var express = require("express");
var wwwhisper = require('connect-wwwhisper');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session");
var flash = require("connect-flash");
var path = require("path");
var Ordine = require("./models/burger_order");
var Incasso = require("./models/burger_stats")
var Bevande = require("./models/beverages_stats");
var Bar = require("./models/beverages_order");

var routes = require("./routes");

var app = express();

mongoose.Promise = global.Promise;

//mongo local
/*
mongoose.connect( "mongodb://localhost:27017", { //27017
  useMongoClient: true,
});
*/


mongoose.connect("mongodb://heroku_55rqs31t:alfunmd16dnnisd4rf0398fp5d@ds155934.mlab.com:55934/heroku_55rqs31t", { 
  useMongoClient: true,
});

//mongoose.connect("mongodb://heroku_55rqs31t:alfunmd16dnnisd4rf0398fp5d@ds155934.mlab.com:55934/heroku_55rqs31t?useMongoClient");

// DA RIPRISTINARE!
//app.use(wwwhisper());

app.set("port", process.env.PORT || 8000);

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");    

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.use(routes);


app.listen(app.get("port"), function(){
	console.log("server started on port " + app.get("port"));
});

/*
app.listen(("3000"), function(){
    console.log("server running on port 3000");
});
*/
