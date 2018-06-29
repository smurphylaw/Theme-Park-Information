module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getDinings(res, mysql, context, complete){
        var sql = "SELECT diningID, name, service, cuisine FROM dining ORDER BY name";
        
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            
            context.dinings = results;            
            complete();
        });
    }


    function getDining(res, mysql, context, id, complete){
        var sql = "SELECT diningID, name, service, cuisine FROM dining WHERE diningID = ?";
        var inserts = [id];
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            
            context.dining = results[0];
            complete();
        });
    }

    /*Display all dining. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["deletedining.js"];
        
        var mysql = req.app.get('mysql');
        getDinings(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                
            }
            res.render('dining', context);
        }
        
        
    });

    /* Display one dining - (For update) */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["updatedining.js"];
        
        var mysql = req.app.get('mysql');
        getDining(res, mysql, context, req.params.id, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                
            }
            res.render('dining-update', context);

        }
    });

    /* Adds a dining */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO dining (name, service, cuisine) VALUES(?, ?, ?)";
        var inserts = [req.body.name, req.body.service, req.body.cuisine];
        
        sql = mysql.pool.query(sql,inserts,function(error,  results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/dining');
            }
        });
    });

    /* Update Dining */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE dining SET name = ?, service = ?, cuisine = ? WHERE diningID = ?";
        var inserts = [req.body.name, req.body.service, req.body.cuisine, req.params.id];
        
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

    /* Delete a dining */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM dining WHERE diningID = ?";
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