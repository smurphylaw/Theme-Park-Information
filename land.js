module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getLands(res, mysql, context, complete){
        var sql = "SELECT landID, name FROM land ORDER BY name";

        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            
            context.lands = results;            
            complete();
        });
    }


    function getLand(res, mysql, context, id, complete){
        var sql = "SELECT landID, name FROM land WHERE landID = ?";
        var inserts = [id];
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            
            context.land = results[0];
            complete();
        });
    }

    /*Display all lands. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["deleteland.js"];
        
        var mysql = req.app.get('mysql');
        getLands(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                
            }
            res.render('land', context);
        }
        
        
    });

    /* Display one land - (For update) */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["updateland.js"];
        
        var mysql = req.app.get('mysql');
        getLand(res, mysql, context, req.params.id, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                
            }
            res.render('land-update', context);

        }
    });

    /* Adds a land */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO land (name) VALUES(?)";
        var inserts = [req.body.name];
        
        sql = mysql.pool.query(sql,inserts,function(error,  results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/land');
            }
        });
    });

    /* Update Land */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE land SET name = ? WHERE landID = ?";
        var inserts = [req.body.name, req.params.id];
        
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

    /* Delete a land */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM land WHERE landID = ?";
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