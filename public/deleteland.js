function deleteLand(id){
    
    $.ajax({
        url: '/land/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};