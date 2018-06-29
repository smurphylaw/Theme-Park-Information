function updateAttraction(id){
    $.ajax({
        url: '/attraction/' + id,
        type: 'PUT',
        data: $('#attraction-update').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};