let connection = require("../../db/mysql");
const md5 = require('md5');

module.exports = {

    index: (req, res) => {
        res.render('index');
    },

    auth: (req, res) => {
        if(req.body.sesion == ""){
        let pass = md5(req.body.pass)
        
        var sql = 'SELECT id, username, email FROM telematica4c.users WHERE email = "' + req.body.email +'" AND pass = "' + pass +'"';
        
        connection.query(sql , function(err, resp, fields){
            if(resp.length){
                req.session.loggedin = true;
                req.session.userid = resp[0].id;
                req.session.username = resp[0].username;
                req.session.correo = resp[0].email;
                res.redirect('/home');
            }else{
                res.redirect('/404');
            }
        });
        
    }else{
        res.redirect('/registro');
        res.end();
    }

    }
}