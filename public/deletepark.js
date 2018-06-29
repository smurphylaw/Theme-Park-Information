function deletePark(id){
    
    $.ajax({
        url: '/park/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};