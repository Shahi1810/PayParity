const express = require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate = require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');
const ExpressError=require('./utils/ExpressError')
const methodOverride=require('method-override');
const passport=require('passport');
const LocalStrategy=require("passport-local");
const User=require('./models/user')


const userRoutes=require('./routes/users');
const blogRoutes=require('./routes/blogs');
const commentRoutes=require('./routes/comments');

mongoose.connect('mongodb://127.0.0.1:27017/payParity',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db =mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database Connected")
});

const app=express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig={
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:  true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    console.log(req.session)
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.get('/fakeUser',async(req,res)=>{
    const user=new User({email:'divy@gmail.com', username:'shahi'});
    const newUser=await User.register(user,'chicken');
    res.send(newUser);
})

app.use('/',userRoutes)
app.use('/blogs',blogRoutes)
app.use('/blogs/:id/comments',commentRoutes)

app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/PayParity',(req,res)=>{
    res.render('PayParity')
})

app.get('/resources', (req,res)=>{
    res.render('resources')
})

app.get('/analytics',(req,res)=>{
    res.render('analytics')
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('page not found', 404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message='Oh no, Something went wrong!'
    res.status(statusCode).render('error',{err});
})

app.listen(3000,()=>{
    console.log('serving on port 3000')
})