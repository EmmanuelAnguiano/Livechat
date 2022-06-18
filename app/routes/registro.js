let router = require('express').Router();
let registroControlador = require('../controllers/registro');
let session = require("express-session");

router.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
    })
);

//GET
router.get("/", (req, res) => {
    registroControlador.index(req, res);
});

router.post("/registroUser", (req, res) => {
    registroControlador.registroUser(req, res);
});


module.exports = router;