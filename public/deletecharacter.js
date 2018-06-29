function deleteCharacter(id){
    
    $.ajax({
        url: '/character/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};