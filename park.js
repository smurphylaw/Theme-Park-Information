module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getLands(res, mysql, context, complete){
        mysql.pool.query("SELECT landID, name FROM land ORDER BY name", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.lands  = results;
            complete();
        });
    }
    
    function getParks(res, mysql, context, complete){
        var sql = "SELECT parkID, name, city, state, country FROM park ORDER BY name";

        
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            
            context.parks = results;            
            complete();
        });
    }


    function getPark(res, mysql, context, id, complete){
        var sql = "SELECT parkID, name, city, state, country FROM park WHERE parkID = ?";
        var inserts = [id];
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.park = results[0];
            complete();
        });
    }

    /*Display all parks. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["deletepark.js"];
        
        var mysql = req.app.get('mysql');
        getParks(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 2){

            }
            res.render('park', context);
        }
    });

    /* Display one park - (For update) */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["updatepark.js"];
        
        var mysql = req.app.get('mysql');
        getPark(res, mysql, context, req.params.id, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                
            }
            res.render('park-update', context);

        }
    });

    /* Adds a park */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO park (name, city, state, country) VALUES(?, ?, ?, ?)";
        var inserts = [req.body.name, req.body.city, req.body.state, req.body.country];
        
        sql = mysql.pool.query(sql,inserts,function(error,  results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/park');
            }
        });
    });

    /* Update Park */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE park SET name = ?, city = ?, state = ?, country = ? WHERE parkID = ?";
        var inserts = [req.body.name, req.body.city, req.body.state, req.body.country, req.params.id];
        
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

    /* Delete a park */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM park WHERE parkID = ?";
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