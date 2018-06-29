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
    
    function getAllDinings(res, mysql, context, complete){
        mysql.pool.query("SELECT diningID, name, service, cuisine FROM dining ORDER BY name", function(error, results, fields){
            
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            
            context.dinings  = results;
            complete();
        });
    }
    
    function getDining(res, mysql, context, id, complete) {
        var sql = "SELECT diningID, name FROM dining WHERE diningID = ?";
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
    
    function getListOfAllParkDinings(res, mysql, context, complete){
        var sql = "SELECT d.name AS d_name, p.name AS park_name, pd.parkID AS pd_parkID, pd.diningID AS pd_diningID FROM park_dining pd INNER JOIN dining d ON d.diningID = pd.diningID INNER JOIN park p ON p.parkID = pd.parkID ORDER BY d_name";    
        
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.parkDinings = results;
            complete();
        });
    }
    
    function getParkFromDiningID(res, mysql, context, id, complete){
        var sql = "SELECT pd.diningID AS pd_diningID, pd.parkID AS pd_parkID, d.name AS d_name FROM dining d INNER JOIN park_dining pd ON pd.diningID = d.diningID INNER JOIN park p ON p.parkID = pd.parkID WHERE d.diningID = ?";
        var inserts = [id];
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.parkFromDiningID = results;
            complete();
        });
    }
    
    function getParkDiningID(res, mysql, context, id, complete){
        var sql = "SELECT d.name AS d_name, p.name AS park_name, pd.parkID AS pd_parkID, pd.diningID AS pd_diningID FROM park_dining pd INNER JOIN dining d ON d.diningID = ? INNER JOIN park p ON p.parkID = ? ORDER BY d_name";    
        
        var inserts = [id[0], id[1]];
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.parkDiningID = results;
            complete();
        });
    }
    
    function getAllParksWithSelectedID(res, mysql, context, id, complete){
        var sql = "SELECT parkID, name FROM park ORDER BY parkID = ? DESC, name";
        var inserts = [id];
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.parkOptions = results;
            complete();
        });
    }
    
     /* Display park and dining services*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["deleteparkdining.js"];
        
        var mysql = req.app.get('mysql');
        
        // Menu
        getAllParks(res, mysql, context, complete);
        getAllDinings(res, mysql, context, complete);
        
        // Display List
        getListOfAllParkDinings(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('park_dining', context);
            }
        }
    });

    /* Display dining services for a park - (For update) */

    router.get('/:did/:pid', function(req, res){
        callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["selectpark.js", "updateparkdining.js", "deleteparkdining.js"];
        
        var mysql = req.app.get('mysql');
        // Drop-down Menu for Parks
        getAllParksWithSelectedID(res, mysql, context, req.params.pid, complete);
        
        id = [req.params.did, req.params.pid];
        getParkDiningID(res, mysql, context, id, complete)
        
        getParkFromDiningID(res, mysql, context, req.params.pid, complete)
        getDining(res, mysql, context, req.params.did, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('pd-update', context);
            }
        }
    });

    /* Adds a park_dining */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO park_dining (parkID, diningID) VALUES(?, ?)";
        var inserts = [req.body.parkID, req.body.diningID];
        
        sql = mysql.pool.query(sql,inserts,function(error,  results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/park_dining');
            }
        });
    });

    /* Update dining service's park location */
    
    router.put('/:did/:pid/:opid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE park_dining SET parkID = ?, diningID = ? WHERE parkID = ? AND diningID = ?";
        var inserts = [req.params.pid, req.params.did, req.params.opid, req.params.did];
        
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

    /* Delete a dining service from a park */

    router.delete('/:pid/:did', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM park_dining WHERE parkID = ? AND diningID = ?";
        var inserts = [req.params.pid, req.params.did];
        
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