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
    
     function getAllCharacters(res, mysql, context, complete){
        mysql.pool.query("SELECT characterID, name FROM `character` ORDER BY name", function(error, results, fields){
            
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            
            context.characters  = results;
            complete();
        });
    }
    
    function getListOfAllParkCharacters(res, mysql, context, complete){
        var sql = "SELECT c.name AS c_name, p.name AS park_name, pc.parkID AS pc_parkID, pc.characterID AS pc_characterID FROM park_character pc INNER JOIN `character` AS c ON c.characterID = pc.characterID INNER JOIN park p ON p.parkID = pc.parkID ORDER BY c_name";
        
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.parkCharacters = results;
            complete();
        });
    }
    
    function getAllCharactersForOnePark(res, mysql, context, id, complete){
        var sql = "SELECT pc.characterID AS pc_characterID, pc.parkID AS pc_parkID, c.name AS c_name FROM `character` c INNER JOIN park_character pc ON pc.characterID = c.characterID INNER JOIN park p ON p.parkID = pc.parkID WHERE p.parkID = ? ORDER BY c_name";
        var inserts = [id];
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.singleParkCharacters = results;
            complete();
        });
    }
    
     /* Display park and characters*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["deleteparkcharacter.js"];
        
        var mysql = req.app.get('mysql');
        
        // Menu
        getAllParks(res, mysql, context, complete);
        getAllCharacters(res, mysql, context, complete);
        
        // Display List
        getListOfAllParkCharacters(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('park_character', context);
            }
        }
    });

    /* Display all characters for one park - (For update) */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["updateparkcharacter.js"];
        context.jsscripts = ["deleteparkcharacter.js"];
        
        var mysql = req.app.get('mysql');
        getPark(res, mysql, context, req.params.id, complete);
        getAllCharacters(res, mysql, context, complete);
        getAllCharactersForOnePark(res, mysql, context,   req.params.id, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('pc-update', context);
            }
        }
    });

    /* Add a character for a park */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO park_character (parkID, characterID) VALUES(?, ?)";
        var inserts = [req.body.parkID, req.body.characterID];
        
        sql = mysql.pool.query(sql,inserts,function(error,  results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/park_character');
            }
        });
    });

    /* Update Characters within a Park */

    router.put('/:pid/:cid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE park_character SET characterID = ? WHERE parkID = ?";
        var inserts = [req.params.cid, req.params.pid];
        
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
    
    /* Delete a character from a Park */

    router.delete('/:pid/:cid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM park_character WHERE parkID = ? AND characterID = ?";
        var inserts = [req.params.pid, req.params.cid];
        
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