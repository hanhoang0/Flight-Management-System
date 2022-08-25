const express = require('express')
const router = express.Router()
const airplaneController = require('../controllers/airplaneController')

//Routes
router.get('/', airplaneController.view)
router.post('/', airplaneController.find)
router.get('/addAirplane', airplaneController.form)
router.post('/addAirplane', airplaneController.create)
router.get('/editAirplane/:id', airplaneController.edit)
router.post('/editAirplane/:id', airplaneController.update)
router.get('/viewMaintenance/:id', airplaneController.viewMaintenance)
router.get('/viewService/:id', airplaneController.viewService)
//router.get('/:id',airplaneController.remove)

//export module
module.exports = router