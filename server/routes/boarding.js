const express = require('express')
const router = express.Router()
const boardingController = require('../controllers/boardingController')

//Routes
router.get('/', boardingController.view)
router.post('/', boardingController.find)
router.get('/addBoarding', boardingController.form)
router.post('/addBoarding', boardingController.create)
router.get('/editBoarding/:id', boardingController.edit)
router.post('/editBoarding/:id', boardingController.update)
router.get('/viewGate/:id', boardingController.viewGate)
router.get('/:id',boardingController.remove)

//export module
module.exports = router