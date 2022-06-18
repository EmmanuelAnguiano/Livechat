let connection = require("../../db/mysql");

module.exports = {
    home: (req, res) => {
        if(req.session.userid){
            res.render('home');
        }else{
            res.redirect('/');
        }
    },
    getRooms: (req, res) =>{
        let sql = 'SELECT * FROM telematica4c.chatrooms';
            connection.query(sql, function(err, resp){
                if(resp.length){
                    res.send(resp);
                }else{
                    res.send(false);
                }
            });
    }, 
    addRoom: (req, res) => {
        let sql = "INSERT INTO telematica4c.chatrooms ( nombre ) VALUES ('" + req.body.name +"')";
    
        connection.query(sql, function(err, resp){
            res.send(resp);
        });
    }
};