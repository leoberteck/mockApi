var MockModel = require('../model/mock.js')
var mongoose = require('../model/mogodb.js')

module.exports = function(app){
    /*
        Descrição : busca paginada de mocks
        Recebe : 
            :skip - especifica quantos registros pular
            :limit - epecifica o número máximo de registros a buscar
            url query parameters :
                filter - filtro textual para busca
        Retorna : 
            Se os parâmetros não forem especificados corretamente -> HTTP_STATUS 400
    */
    app.get('/api/mock/list/:skip/:limit', function(req, res){
        var query = req.query || {}
        var filtro = {}
        var skip = req.params.skip >=0 ? parseInt(req.params.skip) : 0
        var limit = req.params.limit >= 1 && req.params.limit <= 500 ? parseInt(req.params.limit) : 1
        if(query.filter)
        {
            var regex = new RegExp('.*' + query.filter + '.*')
            filtro.$or = [{ identificador : regex }, { tags : { $in : [regex] } }]
        }
        MockModel.find(filtro, {}, { skip : skip, limit : limit })
            .sort({ _id : 1 })
            .exec()
            .then(function(array){
                res.status(200).send(array)
            }, function(err){
                res.status(400).send(err)
            })
    })
    /*
        Descrição : busca um dado de mock pelo id
        Recebe : 
            :id - ObjectId do mock desejado
            :format
                - json = para receber apenas o valor de mock.dados em formato json
                - sql = para receber apenas o valor de mock.dados em formato sql insert
                - undefined = para receber o obejto mock completo em formato json
        Retorna : 
            Se o objeto for encontrado -> HTTP_STATUS = 200 HTTP_BODY = objeto no formato desejado
            Se o obejto não for encontrado -> HTTP_STATUS 404
    */
    app.get('/api/mock/:id/:format?', function(req, res){
        if (req.params.id){
            var format = req.params.format
            MockModel.findById(req.params.id)
            .then(function(document) {
                res.status(200).send(document.parseByFormat(format))
            }, function(err) {
                res.status(404).send(err);
            })
        } else {
            res.status(404).send("Not found");
        }
    })
    /*
        Descrição : cria um novo registro no banco basedo no dados informado no corpo do request
        Recebe : 
            req.body = deve contar com o novo objeto em formato JSON
        Retorna : 
            Se o corpo do request for inválido -> HTTP_STATUS = 400
            OK -> HTTP_STATUS = 200
    */
    app.post('/api/mock', function(req, res){
        if (req.body){
            var newdocument = new MockModel(req.body)
            newdocument.save()
            .then(function(){
                res.status(200).send("OK");
            }, function(err){
                res.status(404).send(err);
            })
        }
        else{
            res.status(400).send("Empty request body")
        }
    })
    /*
        Descrição : cria ou substitui um registro no banco basedo no dados informado no corpo do request
        Recebe : 
            req.body = deve contar com o objeto em formato JSON
            ATENCAO = para substituir um registo o campo _id deve estar preenchido no objeto do corpo do request
        Retorna : 
            Se o corpo do request for inválido -> HTTP_STATUS = 400
            OK -> HTTP_STATUS = 200
    */
    app.put('/api/mock', function(req, res){
        if(req.body)
        {
            req.body._id = req.body._id || new mongoose.mongo.ObjectID()
            
            MockModel.update({ _id : req.body._id }, req.body, { upsert : true, runValidators : true })
            .then(function(document){
                res.status(200).send("OK");
            }, function(err){
                res.status(400).send(err);
            })
        }
        else{
            res.status(400).send("Empty request body")
        }
    })
    /*
        Descrição : modifica o registro no banco apenas com os dados informados no corpo do request
        Recebe : 
            req.body = deve contar com o objeto em formato JSON e com _id preenchido
        Retorna : 
            Se o corpo do request for inválido -> HTTP_STATUS = 400
            Se o _id for inválido ou o registro não for encontrado na base -> HTTP_STATUS = 404
            OK -> HTTP_STATUS = 200
    */
    app.patch('/api/mock', function(req, res){
        if(req.body){
            if(req.body._id)
            {
                MockModel.update({ _id : req.body._id }, req.body)
                .then(function(document){
                    res.status(200).send("OK");
                }, function(err){
                    res.status(400).send(err);
                })   
            }
            else
            {
                res.status(404).send("Not found");
            }
        }else{
            res.status(400).send("Empty request body")
        }
    })
    /*
        Descrição : remove um registro do banco de dados
        Recebe : 
            :id = id do objeto a ser removido
        Retorna : 
            Se o _id for inválido ou o registro não for encontrado na base -> HTTP_STATUS = 404
            OK -> HTTP_STATUS = 200
    */
    app.delete('/api/mock/:id', function(req, res){
        if(req.params.id) 
        {
            MockModel.findByIdAndRemove(req.params.id)
            .then(function(document){
                res.status(200).send("OK");
            }, function(err){
                res.status(404).send(err);
            })
        } 
        else{
            res.status(404).send("Not found");
        }
    })
}