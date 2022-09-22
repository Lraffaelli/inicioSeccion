const express = require('express')
const app = express()


// Middlewares
function auth(req, res, next) {
    if (req.session?.user === 'lucas' && req.session?.admin) {
      return next()
    }
    return res.status(401).send('error de autorización!')
   }


app.get('/con-session/:name', (req, res)=>{
    const{name}=req.params
    
    if(req.session.contador){
        req.session.contador++
        res.send(`${name} usted ha visitado el sitio ${req.session.contador} veces`)
    }else{
        req.session.contador = 1
        res.send(`Bienvenido ${name}`)
    }
});
app.get('/login',(req,res)=>{
    const{username,password}=req.query
    if(username!=='lucas'|| password!=='lucaspass'){
        return res.send('login failed')
    }
    req.session.user = username
    req.session.admin = true
    //res.send('login success!!')
    res.redirect(`/con-session/${username}`)
})

app.get('/privado', auth, (req, res) => {
    res.send('si estas viendo esto es porque ya te logueaste!')
   })
   

app.get('/logout',(req, res)=>{
    req.session.destroy(err =>{
        if(!err){
            res.send('Logout exitoso!!!')
        }else{
            res.send({status:'Logout ERROR', body:err})
        }
    })
})
module.exports = routes