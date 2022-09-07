require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 4001;

// Database configuration
mongoose.connect(
    process.env.DB_URI,
    {
        maxPoolSize:50,
        wtimeoutMS:2500,
        useNewUrlParser:true,
        useUnifiedTopology:true,

    })
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', ()=> console.log('Connected to the Mongo DB database'));

// Middlewares
app.use(express.urlencoded({extented: false}));
app.use(express.json());

app.use(session({
    secret: 'My Secret Key',
    saveUninitialized:true,
    resave:false,
}));

app.use((req, res, next) =>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static("uploads"));
app.use(express.static("public"));

// Set template engine
app.set('view engine', 'ejs');

// route prefix
app.use("", require("./routes/shvAdminGDRoute"));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});