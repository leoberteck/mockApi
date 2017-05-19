module.exports = function(app){
    //FrontEnd routes
    app.get('/', function(req, res){
        res.render('home');
    })
    app.get('/compose/:id', function(req, res){
        res.status(501).send("Not Implemented!");
    })

    //Api routes
    require('./mock_api_routes')(app)
}