function updateParkCharacter(pid, cid){
    $.ajax({
        url: '/park_character/' + pid + '/' + cid,
        type: 'PUT',
        data: $('#pc-update').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};