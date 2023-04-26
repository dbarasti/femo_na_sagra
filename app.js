var express = require("express");
require('dotenv').config()
var bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
var mongoose = require("mongoose");
var session = require("express-session");
var flash = require("connect-flash");
var path = require("path");
var wwwhisper = require('connect-wwwhisper');


var routes = require("./routes");

var app = express();

mongoose.Promise = global.Promise;

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

app.set("port", process.env.PORT || 8000);

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");    

app.use(wwwhisper(false));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


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

function gracefulshutdown() {
  console.log("Shutting down");
  app.close(() => {
      console.log("HTTP server closed.");
      
      // When server has stopped accepting 
      // connections exit the process with
      // exit status 0        
      process.exit(0); 
  });
}

process.on("SIGTERM", gracefulshutdown);