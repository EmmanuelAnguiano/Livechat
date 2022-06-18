let router = require('express').Router();
let loginControlador = require('../controllers/login');
let session = require("express-session");

router.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
    })
);

//GET
router.get('/', (req, res) => {
    loginControlador.index(req, res);
});

//POST
router.post('/auth', (req, res) => {
    loginControlador.auth(req, res);
});

module.exports = router;