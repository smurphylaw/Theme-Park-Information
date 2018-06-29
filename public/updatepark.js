function updatePark(id){
    $.ajax({
        url: '/park/' + id,
        type: 'PUT',
        data: $('#park-update').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};