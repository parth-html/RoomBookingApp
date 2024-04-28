const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Bookings = require('../models/Bookings');
const { sessionChecker } = require("../middleware/auth");
const { v4 } = require('uuid');

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const uniqueId = v4();
    const rooms = await Room.find();
    (!req.session.userId) ? req.session.userId = uniqueId : null;
    res.json({ rooms: rooms, userId: req.session.userId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a room
router.post('/', sessionChecker, async (req, res) => {
  var inputData = { ...req.body };
  Room.create(inputData)
    .then((docs) => { res.status(201).json(docs) })
    .catch(e => res.status(500).json({ error: e.message }))
});

// room booking
router.post("/booking", sessionChecker, (req, res) => {

  var inputData = { ...req.body, userId: req.session.userId }
  Bookings.create(inputData)
    .then((docs) => { 
      req.io.emit('bookingUpdate', docs);
      res.status(201).json(docs) })
    .catch(e => res.status(500).json({ error: e.message }))
})

// get room booking
router.get("/booking", sessionChecker, (req, res) => {

  Bookings.find({
    bookingDate: new Date(req.headers.bookingdate),
    roomId: req.headers.roomid
  })
    .then((doc) => { res.status(200).json(doc) })
    .catch(e => res.status(500).json({ error: e.message }));
})

module.exports = router;

