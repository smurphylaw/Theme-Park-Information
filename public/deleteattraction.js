function deleteAttraction(id){
    
    $.ajax({
        url: '/attraction/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};