//Set up a string.format method
require('../assets/js/string_format')

function GetObjectValues(object){
    var values = []
    var keys = Object.keys(object)
    keys.forEach(function(element){
        if(object.hasOwnProperty(element))
        {
            values.push("'" + object[element] + "'")   
        }
    })
    return values
}

module.exports = {
    parse : function(json) {
        var parsedVal = ""
        if(json)
        {
            var _object = typeof(json) === "string" ? JSON.parse(json) : json
            Object.keys(_object).forEach(
                function(table) {
                    var _tableData = _object[table]
                    if(Array.isArray(_tableData) && _tableData.length > 0){
                        var columns = Object.keys(_tableData[0])
                        parsedVal += "INSERT INTO {0} ( {1} ) VALUES ".format(table, columns.join())
                        _tableData.forEach(function(element) {
                            parsedVal += "{1} ({0})".format(GetObjectValues(element), _tableData.indexOf(element) != 0 ? "," : "")
                        });
                        parsedVal += ";\n";
                    }
                })
        }
        return parsedVal
    }
}