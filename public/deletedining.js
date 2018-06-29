function deleteDining(id){
    
    $.ajax({
        url: '/dining/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};