module.exports = function(){
    var express = require('express');
    var router = express.Router();

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
    
    function getCharacter(res, mysql, context, id, complete){
        var sql = "SELECT characterID, name FROM `character` WHERE characterID = ? ORDER BY name";
        var inserts = [id];
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            
            context.character  = results;
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

            context.parkCharactersFilter = results;
            complete();
        });
    }
    
    function getAllParksForOneCharacter(res, mysql, context, id, complete){
        var sql = "SELECT c.name AS c_name, p.name AS park_name, pc.parkID AS pc_parkID, pc.characterID AS pc_characterID FROM park_character pc INNER JOIN `character` AS c ON c.characterID = pc.characterID INNER JOIN park p ON p.parkID = pc.parkID WHERE c.characterID = ? ORDER BY c_name";
        var inserts = [id];
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.parkCharactersFilter = results;
            complete();
        });
    }
    
    function getCharactersWithSelectedID(res, mysql, context, id, complete){
        var sql = "SELECT characterID, name FROM `character` ORDER BY characterID = ? DESC, name";
        var inserts = [id];
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.characters = results;
            complete();
        });
    }
    
     /* Display list of parks based on character selected*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        
        var context = {};
        var mysql = req.app.get('mysql');
        
        // Menu
        getAllCharacters(res, mysql, context, complete);
        
        // Display List
        getListOfAllParkCharacters(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('park_character_filter', context);
            }
        }
    });

    /* Display list of parks for one character */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        
        var context = {};
        
        var mysql = req.app.get('mysql');
        
        getAllCharacters(res, mysql, context, complete);
        getAllParksForOneCharacter(res, mysql, context, req.params.id, complete);
        
        getCharactersWithSelectedID(res, mysql, context, req.params.id, complete)
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('pc_filter', context);
            }
        }
    });

    return router;
}();