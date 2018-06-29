function deleteParkCharacter(pid, cid) {
    $.ajax({
        url: '/park_character/' + pid + '/' + cid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};