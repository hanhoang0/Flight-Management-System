const express = require('express')
const router = express.Router()
const flightController = require('../controllers/flightController')

//Routes
router.get('/', flightController.view)
router.post('/', flightController.find)
router.get('/addFlight', flightController.form)
router.post('/addFlight', flightController.create)
router.get('/editFlight/:id', flightController.edit)
router.post('/editFlight/:id', flightController.update)
router.get('/:id',flightController.remove)

//export module
module.exports = router