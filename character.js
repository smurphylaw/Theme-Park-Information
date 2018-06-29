module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCharacters(res, mysql, context, complete){
        var sql = "SELECT characterID, name, startTime, endTime FROM `character` ORDER BY name";
        
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            
            context.characters = results;            
            complete();
        });
    }


    function getCharacter(res, mysql, context, id, complete){
        var sql = "SELECT characterID, name, startTime, endTime FROM `character` WHERE characterID = ?";
        var inserts = [id];
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            
            context.character = results[0];
            complete();
        });
    }

    /*Display all characaters. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["deletecharacter.js"];
        
        var mysql = req.app.get('mysql');
        getCharacters(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                
            }
            res.render('character', context);
        }
        
        
    });

    /* Display one character - (For update) */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        
        var context = {};
        context.jsscripts = ["updatecharacter.js"];
        
        var mysql = req.app.get('mysql');
        getCharacter(res, mysql, context, req.params.id, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                
            }
            res.render('character-update', context);

        }
    });

    /* Adds a character */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO `character` (name, startTime, endTime) VALUES(?, ?, ?)";
        var inserts = [req.body.name, req.body.startTime, req.body.endTime];
        
        sql = mysql.pool.query(sql,inserts,function(error,  results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/character');
            }
        });
    });

    /* Update Character */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE `character` SET name = ?, startTime = ?, endTime = ? WHERE characterID = ?";
        var inserts = [req.body.name, req.body.startTime, req.body.endTime,  req.params.id];
        
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

    /* Delete a character */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM `character` WHERE characterID = ?";
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