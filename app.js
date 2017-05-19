var express = require('express')
var body_parser = require('body-parser')
var properties = require('./properties')
var favicon = require('serve-favicon')

var app = express()

app.set('views', './views')
app.set('view engine', 'pug')

//Path para os arquivos js e css customizados
app.use('/assets', express.static(__dirname + '/assets'))
//Path para os scripts do bootstrap
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'))
//Path para os scripts Jquery
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'))
//Path oara os scripts axios
app.use('/axios', express.static(__dirname + '/node_modules/axios/dist'))

//Converte dados do request
app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended : false}))

//set o favicon
app.use(favicon(__dirname + '/assets/img/flask.ico'));

//Preenche as rotas
require('./routes/routes.js')(app)

//Inicial o servidor
var server = app.listen(properties.port, function(){
    console.log('Express server listening on port ' + server.address().port);
})