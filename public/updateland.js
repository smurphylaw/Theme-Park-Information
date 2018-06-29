function updateLand(id){
    $.ajax({
        url: '/land/' + id,
        type: 'PUT',
        data: $('#land-update').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};