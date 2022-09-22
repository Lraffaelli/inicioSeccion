const bar = '../views/welcomeBar.hbs'
const error= '../views/otro.hbs'


function render(template, id){
    return fetch(template)
    .then(respuesta => respuesta.text())
    .then(plantilla => {
      const template = Handlebars.compile(plantilla)
      const html = template({welcomeBar})
      return document.getElementById(id).innerHTML= html
    })
  }

render(bar,'welcomeBar')

