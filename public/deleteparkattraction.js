function deleteParkAttraction(pid, aid){
    
    $.ajax({
        url: '/park_attraction/' + pid + '/' + aid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};