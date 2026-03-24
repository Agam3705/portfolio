const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

// GET /api/stats - Get + increment visitor count
router.get('/', async (req, res) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = new Visitor({ count: 1 });
    } else {
      visitor.count += 1;
    }
    await visitor.save();
    res.json({ visitors: visitor.count });
  } catch (err) {
    res.status(500).json({ visitors: 0 });
  }
});

module.exports = router;
