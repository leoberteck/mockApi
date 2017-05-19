
var mockExtensions = {
    validadarDados : function(_dados){
        var dados, isValid = true
        try{
            dados = JSON.parse(_dados)
            if(typeof(dados) === "object" && Object.keys(dados).length > 0)
            {
                for(var property in dados)
                {
                    if(!(dados.hasOwnProperty(property) 
                    && Array.isArray(dados[property]) 
                    && (typeof(dados[property][0]) === "object")))
                    {
                        isValid = false;
                    }
                }   
            }else{ isValid = false }
        }catch(ex){ isValid = false }
        return isValid
    },
    validadarVersao : function(_versao){
        var isValid = true;
        if(typeof(_versao) === "string" )
        {
            var pieces = _versao.split('.')
            if(pieces.length == 3)
            {
                pieces.forEach(function(number){
                    isValid = isValid && !isNaN(number)
                })
            }
            else { isValid = false }
        }
        else { isValid = false }
        return isValid;
    },
    ensureTags : function(mockData)
    {
        if(mockData.dados && (!mockData.tags || mockData.tags.length == 0))
        {
            var _dados = JSON.parse(mockData.dados);
            mockData.tags = Object.keys(_dados)
        }
    }
}

if(module && module.exports){
    module.exports = mockExtensions
}else{
    this.MockExtensions = mockExtensions
}
