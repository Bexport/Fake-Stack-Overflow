// Application server
// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.


// import necessary libraries and create a new instance
const exp = require("express");
const cors = require("cors");
const mong = require("mongoose");
const sesh = require("express-session");
const webApp = exp();
const local = 8000;

webApp.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
webApp.use(exp.json());
webApp.use(sesh({
    secret: "private_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, 
        maxAge: 60000
    }
}));

// Maybe I don't need to use routes
//set up routers and mount them under specific urls
const questionsRouter = require("./routes/questionsRoute.js");
const answersRouter = require("./routes/answersRoute.js");
const tagsRouter = require("./routes/tagsRoute.js");
const usersRouter = require("./routes/usersRoute.js");
const commentsRouter = require("./routes/commentsRoute.js");

webApp.use("/questions", questionsRouter);
webApp.use("/answers", answersRouter);
webApp.use("/tags", tagsRouter);
webApp.use("/users", usersRouter);
webApp.use("/comments", commentsRouter);


// establish connection to mongodb
const dbURI = "mongodb://127.0.0.1:27017/fake_so"; // Replace with your MongoDB server URL and database name
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mong.connect(dbURI,dbOptions).then(()=>{
    console.log("DB connection");
    const server = webApp.listen(local, ()=>{
        console.log(`PORT ${local}`);
    });
    
    // when ctrl+c is pressed to stop server, disconnect db and put out message
    process.on("SIGINT", ()=>{
        mong.connection.close(()=>{
            server.close(()=>{
                process.exit(0);
            })
            console.log("Server closed. Database instance disconnected.")
        });
    });
});