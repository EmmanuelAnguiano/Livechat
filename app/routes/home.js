//Controlador y administrador de rutas
let router = require('express').Router();
let homeControlador = require('../controllers/home');

//GET
router.get('/', (req,res) =>{
    homeControlador.home(req, res);
});

router.post('/getRooms', function(req, res){
    homeControlador.getRooms(req, res);
});

router.post('/addRoom', function(req, res){
    homeControlador.addRoom(req, res);
});

module.exports = router;