function deleteParkDining(pid, did){
    
    $.ajax({
        url: '/park_dining/' + pid + '/' + did,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};