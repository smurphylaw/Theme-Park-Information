function updateCharacter(id){
    $.ajax({
        url: '/character/' + id,
        type: 'PUT',
        data: $('#character-update').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};