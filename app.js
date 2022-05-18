var express = require("express");
require('dotenv').config()
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session");
var flash = require("connect-flash");
var path = require("path");

var routes = require("./routes");

var app = express();

mongoose.Promise = global.Promise;

//mongo local
/*
mongoose.connect( "mongodb://localhost:27017", { //27017
  useMongoClient: true,
});
*/

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@test.812tv.mongodb.net/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

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
