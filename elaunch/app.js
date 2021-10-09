const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const port = 3000;
const path = require("path");
const multer = require('multer');

const users = require('./controllers/userActions');
const admin = require('./controllers/adminActions');
const register = require('./controllers/registerActions')
const reg = require('./controllers/register');
// const chat = require('./chat')
const auth = require('./middleware/auth')
app.use(express.static('assets'));
app.use(express.static('images'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({type: 'application/vnd.api+json'}));
app.use(bodyparser.text()); 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    //res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req, file, cb){
        console.log("filename", new Date().toISOString().replace(/:/g, '-') + file.originalname)
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, true);
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024* 1024 * 5},
    fileFilter: fileFilter      
})


app.use("/usersApi/:action", auth, users);
app.use("/adminApi/:action", admin);
app.use("/registerApi/:action", register);
app.use("/register",  upload.single('profileImage'), reg)



const server = app.listen(port, () => {
    console.log('server started on:', port);
})
