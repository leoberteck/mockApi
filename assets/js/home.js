var locals = {
    page : 0
    , limit : 50
    , hasNext : true
    , getSkip : function() { return this.page * this.limit }
    , api_list_url : "/api/mock/"
    , rowTemplate : 
`<tr data-id='{0}' class='datarow' >
    <td>{0}</td>
    <td>{1}</td>
    <td>{2}</td>
    <td><button class='btn btn-info edit'><span class='glyphicon glyphicon-edit'></span></button></td>
    <td><button class='btn remove'><span class='glyphicon glyphicon-trash'></span></button></td>
</tr>`
    , typingTimer : undefined
    , searchdDelay : 1000
    , currentFilter : undefined
}

var findTr = function (event) {
    var target = event.srcElement || event.target
    var $target = $(target)
    var $tr = $target.parents('tr')
    return $tr
}

function loadMocks() {
    var $search = $('#search')
    var filter = $search.val()
    if(filter){
        filter = filter.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');       
    }
    
    if(locals.currentFilter != filter)
    {
        locals.page = 0;
        locals.hasNext = true;
        locals.currentFilter = filter
        $('#mocksTable tr.datarow').remove()
    }

    if(locals.hasNext)
    {
        $search.prop('disabled', true)
        axios.get(
            '/api/mock/list/' 
            + locals.getSkip() 
            + '/' 
            + locals.limit 
            + (filter ? '?filter=' + filter : ''))
            .then(function(response){
                locals.page++
                locals.hasNext = response.length == locals.limit
                addTableRows(response.data)
            }, function(err){
                showError(err.message)
            }).then(function(){ $search.prop('disabled', false) })
    }
}

function addTableRows(elements) {
    var rows = []
    elements = Array.isArray(elements) ? elements : [elements]
    for(var index in elements)
    {
        var element = elements[index]
        rows.push(locals.rowTemplate.format(
            element._id
            , element.identificador
            , element.versao || "qualquer"
        ))
    }
    $('#mocksTable tr:last').after(rows.join(""))
}

function showError(errorMessage){

}

function showSuccess(successMessage){

}

function removeItem(event){
    if(confirm("Deseja realmente excluir este item?"))
    {
        var $tr = findTr(event)
        var id = $tr.attr('data-id')
        axios.delete('/api/mock/' + id)
        .then(function(response){
            $tr.fadeOut(400, function(){
                $tr.remove();
            })
            showSuccess(response.data)
        }, function(err){
            showError(err.message)
        })
    }
}

$(document).ready(function(){
    $('#mocksTable').on('click', 'button.remove', removeItem)
    $('#search').keyup(function (event) {
        clearTimeout(locals.typingTimer)
        if (event.which == 13) {
            loadMocks()
        }
        else {
            locals.typingTimer = setTimeout(loadMocks, locals.searchdDelay)
        }
    });
    loadMocks()
})