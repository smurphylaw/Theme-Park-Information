function updateDining(id){
    $.ajax({
        url: '/dining/' + id,
        type: 'PUT',
        data: $('#dining-update').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};