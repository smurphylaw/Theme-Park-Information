module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getAttractions(res, mysql, context, complete){
        var sql = "SELECT attractionID, name, type FROM attraction ORDER BY name";
        
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            
            context.attractions = results;            
            complete();
        });
    }


    function getAttraction(res, mysql, context, id, complete){
        var sql = "SELECT attractionID, name, type FROM attraction WHERE attractionID = ?";
        var inserts = [id];
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            
            context.attraction = results[0];
            complete();
        });
    }

    /*Display all attractions. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["deleteattraction.js"];
        
        var mysql = req.app.get('mysql');
        getAttractions(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 2){

            }
            res.render('attraction', context);
        }
        
        
    });

    /* Display one attraction - (For update) */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["updateattraction.js"];
        
        var mysql = req.app.get('mysql');
        getAttraction(res, mysql, context, req.params.id, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                
            }
            res.render('attraction-update', context);

        }
    });

    /* Adds an attraction */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO attraction (name, type) VALUES(?, ?)";
        var inserts = [req.body.name, req.body.type];
        
        sql = mysql.pool.query(sql,inserts,function(error,  results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/attraction');
            }
        });
    });

    /* Update Attraction */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE attraction SET name = ?, type = ? WHERE attractionID = ?";
        var inserts = [req.body.name, req.body.type, req.params.id];
        
        sql = mysql.pool.query(sql,inserts,function(error,  results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Delete an attraction */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM attraction WHERE attractionID = ?";
        var inserts = [req.params.id];
        
        sql = mysql.pool.query(sql, inserts,    function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();