function updateParkLand(pid, lid){
    $.ajax({
        url: '/park_land/' + pid + '/' + lid,
        type: 'PUT',
        data: $('#pl-update').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};