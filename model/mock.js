var mongoose = require('./mogodb.js')
var mock_extensions = require('../assets/js/mock_extensions')
var json_to_sql_parser = require('../utils/json_to_sql_parser.js')

var validadorDados = [mock_extensions.validadarDados, "O formato informado para os dados não é válido!"]
var validadorVersao = [mock_extensions.validadarVersao, "A versão informada não está em um formato correto!"]

var mockSchema = new mongoose.Schema({
    identificador : { type : String, required : true}
    , descricao : String
    , tags : [String]
    , versao : String
    , dados : { type : String, validate : validadorDados }
})

mockSchema.pre('save', function(next){
    var err = undefined
    try{
        mock_extensions.ensureTags(this)
    }catch(ex){
        err = new Error(ex.message)
    }
    if(next)
    {
        next(err);
    }
})

mockSchema.pre('update', function(next){
    var err = undefined
    try{
        mock_extensions.ensureTags(this.getUpdate().$set)
    }catch(ex){
        err = new Error(ex.message)
    }
    if(next)
    {
        next(err);
    }
})

mockSchema.methods.parseByFormat = function(format){
    if(format === "json")    
    {
        return JSON.parse(this.dados)
    }
    else if(format === "sql")
    {
        return json_to_sql_parser.parse(this.dados)
    }
    else
    {
        return this;
    }
}

var mockModel = mongoose.model('Mock', mockSchema)
module.exports = mockModel
