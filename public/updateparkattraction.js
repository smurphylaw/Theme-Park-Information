function updateParkAttraction(pid, aid){
    $.ajax({
        url: '/park_attraction/' + pid + '/' + aid,
        type: 'PUT',
        data: $('#pa-update').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};