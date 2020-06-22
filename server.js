const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require('cors')
const app = express();
const authentication = require("./routes/api/authentication.routes");
const users = require("./routes/api/users.routes");
const profile = require("./routes/api/profile.routes");

const conversation = require("./routes/api/conversation.routes");


app.use(express.static('uploads'));

app.use(cors({credentials: true}));
const url='http://localhost:3000'
app.options(url, cors())


const http=require("http").Server(app)

 const io=require("socket.io")(http,{
  secure:true,

reconnect: true,

rejectUnauthorized : false

})

io.set('origins', '*:*');
io.on("connection",(socket)=>{
  console.log("SOCKET")
})

const sendMsg=(msg)=>{
  io.sockets.emit(msg)
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", url);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", url);
  next();
});

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));



// Routes

app.use('/conv', conversation(io));
// Routes
app.use('/auth', authentication);
app.use('/profil', profile);
app.use('/user', users);

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);



const port = process.env.PORT || 5000;


http.listen(port, () => console.log(`Server up and running on port ${port} !`));

module.exports={
  sendMsg
}
