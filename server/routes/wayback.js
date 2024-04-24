const express = require('express');
const router = express.Router();
const waybackController =  require('../controllers/waybackController')

router.get('/', waybackController.getArchive, waybackController.getSnapshot, (req, res) => {
  return res.status(200)
});

// Test route that triggers getSnapshot
router.get('/test-snapshot', waybackController.getSnapshot, (req, res) => {
  res.status(200).json(res.locals.resultSnapshot);
});

module.exports = router;