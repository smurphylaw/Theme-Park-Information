module.exports = function(){
    var express = require('express');
    var router = express.Router();
    
    function getAllParks(res, mysql, context, complete){
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
    
    
    function getAllAttractions(res, mysql, context, complete){
        mysql.pool.query("SELECT attractionID, name, type FROM attraction ORDER BY name", function(error, results, fields){
            
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            
            context.attractions  = results;
            complete();
        });
    }
    
    function getListOfAllParkAttractions(res, mysql, context, complete){
        var sql = "SELECT a.name AS a_name, p.name AS park_name, pa.parkID AS pa_parkID, pa.attractionID AS pa_attractionID FROM park_attraction pa INNER JOIN attraction a ON a.attractionID = pa.attractionID INNER JOIN park p ON p.parkID = pa.parkID ORDER BY a_name";
        
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.parkAttractions = results;
            complete();
        });
    }
    
    function getAllAttractionsForOnePark(res, mysql, context, id, complete){
        var sql = "SELECT pa.attractionID AS pa_attractionID, pa.parkID AS pa_parkID, a.name AS a_name FROM attraction a INNER JOIN park_attraction pa ON pa.attractionID = a.attractionID INNER JOIN park p ON p.parkID = pa.parkID WHERE p.parkID = ? ORDER BY a_name";
        var inserts = [id];
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.singleParkAttractions = results;
            complete();
        });
    }
    
     /* Display park and attractions*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["deleteparkattraction.js"];
        
        var mysql = req.app.get('mysql');
        
        // Menu
        getAllParks(res, mysql, context, complete);
        getAllAttractions(res, mysql, context, complete);
        
        // Display List
        getListOfAllParkAttractions(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('park_attraction', context);
            }
        }
    });

    /* Display all attractions for one park - (For update) */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["updateparkattraction.js"];
        context.jsscripts = ["deleteparkattraction.js"];
        
        var mysql = req.app.get('mysql');
        getPark(res, mysql, context, req.params.id, complete);
        getAllAttractions(res, mysql, context, complete);

        getAllAttractionsForOnePark(res, mysql, context, req.params.id, complete)
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('pa-update', context);
            }
        }
    });

    /* Add an attraction to a park */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO park_attraction (parkID, attractionID) VALUES(?, ?)";
        var inserts = [req.body.parkID, req.body.attractionID];
        
        sql = mysql.pool.query(sql,inserts,function(error,  results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/park_attraction');
            }
        });
    });

    /* Update Attraction within a Park */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE park_attraction SET attractionID = ? WHERE parkID = ?";
        var inserts = [req.body.attractionID, req.body.parkID];
        
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

    /* Delete a park_attraction */

    router.delete('/:pid/:aid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM park_attraction WHERE parkID = ? AND attractionID = ?";
        var inserts = [req.params.pid, req.params.aid];
        
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