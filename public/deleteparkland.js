function deleteParkLand(pid, lid){    
    $.ajax({
        url: '/park_land/' + pid + '/' + lid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};