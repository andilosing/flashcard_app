const express = require("express")
const session = require("express-session")
const bcrypt = require("bcrypt")
const SQLiteStore = require("connect-sqlite3")(session)

const cors = require("cors")

const indexRouter = require("./routers/index-router")
const flashcardsRouter = require("./routers/flashcards-router")
const learningStackRouter = require("./routers/learningStack-router")
const deeplRouter = require("./routers/deepl-router")
const db = require("./db")

const userService = require("./services/user-service")

const app = express()

app.use(
    session({
        secret: "sjfsk",
        resave: false,
        saveUninitialized: true, // change this to true
        cookie: {
            secure: false,
            httpOnly: true, // add this line
            maxAge: 24 * 60 * 60 * 1000 // 1 Tag in Millisekunden
        },
        store: new SQLiteStore
}))

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your React app domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies in cross-origin requests
}))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static("public"))

const autMiddleware = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.status(404).send("Bitte melden sie sich zuerst an!")
    }
    next()
}

//app.use("/", indexRouter)
app.use("/learning-stack",autMiddleware, learningStackRouter)
app.use("/flashcards", autMiddleware, flashcardsRouter)
app.use("/translate", deeplRouter)

app.post("/createAccount", async (req, res, next) => {
    try {
        const {username, password} = req.body
        const saltRounds = 10;

        if(!username || !password){
            return res.status(401).send('Benutzername oder Passwort ist leer!');
            
        }
    
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        
        const user = await userService.createUser(username, hashedPassword)
        res.json(user)
    } catch (error) {
        next(error)
    }
   
});






app.post("/login", async (req, res, next) => {
   try{
    
    if(req.session.isLoggedIn){
        
        return res.send("Du bist bereits eingeloggt!")
    } 


    const {username, password} = req.body
    const user =  await userService.getUser(username)

    if(!user || !bcrypt.compareSync(password, user.password)){
        return res.status(401).send('Benutzername oder Passwort ist ungültig');
    }
    req.session.userId = user.userId;
    req.session.isLoggedIn = true 


    
     res.status(200).send(`Willkommen ${user.username}!`); 
   } catch(error){
    next(error)
   }


})

app.post("/logout", async (req, res, next) => {
    try {
      
      if (req.session.isLoggedIn) {
      
        req.session.destroy((err) => {
          if (err) {
          
            return res.status(500).send("Fehler beim Ausloggen.");
          } else {
            return res.status(200).send("Erfolgreich ausgeloggt!");
          }
        });
      } else {
        return res.status(401).send("You are not Logged in!");
      }
    } catch (error) {
      next(error);
    }
  });




app.listen(8080, () => console.log("Server läuft auf Port 8080"))
