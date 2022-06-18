let connection = require("../../db/mysql");
let md5 = require('md5');

module.exports = {
    index: (req, res) => {
        res.render('registro');
    },
    
    registroUser: (req, res) =>{
        let pass = "";

        if(req.body.registro == ''){
            pass = md5(req.body.pass);
            
            if(req.body.username && req.body.email && req.body.pass){
                var sql = 'INSERT INTO telematica4c.users (username, email, pass) VALUES ("'+ req.body.username + '", "'+ req.body.email +'", "'+ pass +'")';
            
                connection.query(sql, function(err, resp){
                    if(resp.affectedRows != 0){
                        res.redirect('/');    
                    }
                });  
            }
        }else{
            res.redirect('/');
        }
    },
    
};