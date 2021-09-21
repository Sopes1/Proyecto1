const express = require("express")
const router = express.Router()
const mysqlController = require('../controllers/mysql')
const mongoController = require('../controllers/mongo')

// MYSQL ROUTES
router.get('/mysql/all',mysqlController.getAll)

//MONGO ROUTES
router.get('/mongo/all',mongoController.getAll)
router.get('/mongo/totalnoticias',mongoController.totalNoticias)
router.get('/mongo/totales',mongoController.totales)


module.exports = router