function updateParkDining(pid, did, opid){

    $.ajax({
        url: '/park_dining/' + did + '/' + pid + '/' + opid,
        type: 'PUT',
        data: $('#pd-update').serialize(),
        success: function(result){
            
        }
    })
};