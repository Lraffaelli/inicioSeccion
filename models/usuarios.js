const mongoose= require('mongoose')

const usuariosCollection = 'usuarios'

const UsuarioSchema= new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    direccion: { type: String, required: true },
})

export const usuarios = mongoose.model(usuariosCollection,UsuarioSchema)