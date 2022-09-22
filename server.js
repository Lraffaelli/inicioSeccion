const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const handlebars = require("express-handlebars")
const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local');
const mongoose=require('mongoose')
//import * as model from './models/usuarios'
const app = express()


//------------------------------------DB---------------------------------

const usuarios=[]
CRUD()
async function CRUD(){
    try {
        const URL = 'mongodb+srv://Lraffaelli:Emiliano1701@cluster0.cggdgpo.mongodb.net/test'
     const rta = await mongoose.connect(URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true    
    })
    console.log('Base de datos conectada correctamente!!')

    

    } catch (err) {
        throw new Error(`Error de conexión a la base de datos ${err}`)
    }
}



// ------------Passport----------------------------
passport.use('register', new LocalStrategy({
    passReqToCallback:true
},(req,username, password,done)=>{
    const{direccion}=req.body

    const usuario = usuarios.find(usuario =>usuario.username == username)

    if(usuario){
        return done('Usuario registrado')
    }

    const user={
        username,
        password,
        direccion
    }
    usuarios.push(user)

    return done(null,user)
}))


passport.use('login',new LocalStrategy((username, password, done)=>{
    const user= usuarios.find(usuario =>usuario.username == username)
    if (!user) {
        return done(null, false)
      }
    
      if (user.password != password) {
        return done(null, false)
      }
    
      
      return done(null, user)
}))

passport.serializeUser(function (user, done) {
    done(null, user.username);
  });
  
  passport.deserializeUser(function (username, done) {
    const usuario = usuarios.find(usuario => usuario.username == username)
    done(null, usuario);
  });

//------------------------------------------------------------------cookies
app.use(cookieParser())
//----------------------------------------Handlebars settings
app.engine('hbs', handlebars.engine({
    extname: ".hbs",
    defaultLayout: 'index.html'    
  })
  );
  
  app.set("view engine", "hbs");
  app.set("views", "./public/views");

// ------------------------------------------------------Setting de la session
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false
}))

// ----------------------------------------------------------Middlewares
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

//-----------------------------------------Auth
function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/login')
    }
  }


/* app.get('/con-session/:name', (req, res)=>{
    const{name}=req.params
    
    if(req.session.contador){
        req.session.contador++
        res.send(`${name} usted ha visitado el sitio ${req.session.contador} veces`)
    }else{
        req.session.contador = 1
        res.send(`Bienvenido ${name}`)
    }
}); */

/* ------------------------registro--------------------------------- */
app.get('/registro', (req, res) => {
    res.sendFile(__dirname + '/public/views/registro.html')
  })

app.post('/registro',passport.authenticate('register',{failureRedirect:'/failregistro', successRedirect: '/'})) 

app.get('/failregistro', (req,res)=>{
    res.render('registro-error')
})
  
 /*  app.post('/registro', (req, res) => {
  
    const { username, password, direccion } = req.body
  
    const usuario = usuarios.find(usuario => usuario.username == username)
    if (usuario) {
      return res.render('register-error');
    }
  
    usuarios.push({ username, password, direccion })
    console.log(usuarios)
    res.redirect('/login')
  }) */

/* ------------------------LOGIN--------------------------------- */
app.get('/login',(req,res)=>{
    res.sendFile(__dirname+'/public/views/login.html')
})

app.post('/login',passport.authenticate('login',{failureRedirect:'/faillogin',successRedirect:'/welcome'}))

app.get('/faillogin',(req,res)=>{
    res.render('login-error')
})

/* app.post('/login',(req,res)=>{
    
    const{username,password}=req.body
    console.log(username)
    console.log(password)
    const usuario = usuarios.find(usuario => usuario.username == username && usuario.password == password)
  if (!usuario) {
    return res.render('login-error');
  }
    req.session.user = username
    req.session.admin = true
    //res.send('login success!!')
    return res.render(`welcomeBar`)
}) */

/* app.get('/privado', auth, (req, res) => {
    res.send('si estas viendo esto es porque ya te logueaste!')
   }) */
   
/* ------------------------LOGOUT--------------------------------- */
app.get('/logout',(req, res)=>{
    req.session.destroy(err =>{
        if(!err){
            res.send('Logout exitoso!!!')
        }else{
            res.send({status:'Logout ERROR', body:err})
        }
    })
})
// welcome
app.get('/welcome', isAuth, (req, res) => {
    if (!req.user.contador) {
      req.user.contador = 0
    }
    req.user.contador++
  
    res.render('welcomeBar', {
      data: usuarios.find(usuario => usuario.username == req.user.username)
      
    });
  })
// INICIO
app.get('/', (req, res) => {
    if (req.session.nombre) {
      res.redirect('/')
    } else {
      res.redirect('/login')
    }
  })

const PORT= process.env.port || 8080
const server= app.listen(PORT, () => {
    console.log(
      `Servidor escuchando en el puerto ${server.address().port}`
    );
  });