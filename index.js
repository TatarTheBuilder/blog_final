const flash = require('connect-flash')
const logoutController = require('./controllers/logout')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const authMiddleware = require('./middleware/authMiddleware')
const expressSession = require('express-session')
const loginUserController = require('./controllers/loginUser')
const loginController = require('./controllers/login')
const storeUserController = require('./controllers/storeUser')
const newUserController = require('./controllers/newUser')
const validateMiddleware = require("./middleware/validationMiddleware")
const homeController = require('./controllers/home')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const newPostController = require('./controllers/newPost')
const express = require('express')
const app = new express()
const ejs = require('ejs')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const session = require('express-session')
const port = 5000

global.loggedIn = null;

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())
app.use('/posts/store',validateMiddleware)

app.set('trust proxy', 1)
app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: true,
  cookie: { 
    maxAge: 120000,
    secure: true,
    httpOnly: true,
    sameSite: 'none'
  },
  resave: false
}))

app.use("*", (req, res, next) => {
	loggedIn = req.session.userId;
	next()
});

app.use(flash());

app.set('view engine','ejs')

mongoose.connect('mongodb+srv://BobTheAdmin:7575@cluster0.gwsapkd.mongodb.net/my_database', {useNewUrlParser: true} )

app.listen(process.env.PORT || port, ()=>{
  console.log('App listening on port 4000')
})


app.get('/',homeController)

app.get('/post/:id',getPostController)

app.get('/posts/new', authMiddleware, newPostController)

app.post('/posts/store', authMiddleware, storePostController)

app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController)

app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController)

app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController)

app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController)

app.get('/auth/logout', logoutController)

app.use((req, res) => res.render('notfound'));
