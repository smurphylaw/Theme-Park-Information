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
    
    function getAllLands(res, mysql, context, complete){
        mysql.pool.query("SELECT landID, name FROM land ORDER BY name", function(error, results, fields){
            
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            
            context.lands  = results;
            complete();
        });
    }
    
    function getListOfAllParkLands(res, mysql, context, complete){
        var sql = "SELECT l.name AS land_name, p.name AS park_name, pl.parkID AS pl_parkID, pl.landID AS pl_landID FROM park_land pl INNER JOIN land l ON l.landID = pl.landID INNER JOIN park p ON p.parkID = pl.parkID ORDER BY land_name";
        
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.parksAndLandsList = results;
            complete();
        });
    }
    
    function getAllLandsForOnePark(res, mysql, context, id, complete){
        var sql = "SELECT pl.landID AS pl_landID, pl.parkID AS pl_parkID, l.name AS land_name FROM land l INNER JOIN park_land pl ON pl.landID = l.landID INNER JOIN park p ON p.parkID = pl.parkID WHERE p.parkID = ? ORDER BY l.name";
        var inserts = [id];
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.singleParkLands = results;
            complete();
        });
    }
    
     /* Display park and lands*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["deleteparkland.js"];
        
        var mysql = req.app.get('mysql');
        
        // Menu
        getAllParks(res, mysql, context, complete);
        getAllLands(res, mysql, context, complete);
        
        // Display List
        getListOfAllParkLands(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('park_land', context);
            }
        }
    });

    /* Display all theme lands for one park - (For update) */
    
    router.get('/:id', function(req, res){
        callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["updateparkland.js"];
        context.jsscripts = ["deleteparkland.js"];
        
        var mysql = req.app.get('mysql');
        
        // Menu
        getPark(res, mysql, context, req.params.id, complete)
        getAllLands(res, mysql, context, complete);
        
        // Display List
        getAllLandsForOnePark(res, mysql, context,   req.params.id, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('pl-update', context);
            }
        }
    });

    /* Add a theme land to a park */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO park_land (parkID, landID) VALUES(?, ?)";
        var inserts = [req.body.parkID, req.body.landID];
        
        sql = mysql.pool.query(sql,inserts,function(error,  results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/park_land');
            }
        });
    });

    /* Update Theme Land in a Park */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE park_land SET landID = ? WHERE parkID = ?";
        var inserts = [req.body.landID, req.body.parkID];
        
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

    /* Delete a theme land from park */

    router.delete('/:pid/:lid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM park_land WHERE parkID = ? AND landID = ?";
        var inserts = [req.params.pid, req.params.lid];
        
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