const express = require('express');
const router = express.Router();
const waybackController =  require('../controllers/waybackController')

// --------------- Test route that triggers getSnapshot------------------
router.get('/test',waybackController.getArchive, waybackController.getSnapshotAndAnalyze, (req, res) => {
  return res.status(200).json(res.locals.a11yResults);
});
//--------------------testing ends------------------------------------


router.get('/', waybackController.getArchive, waybackController.getSnapshotAndAnalyze, (req, res) => {
  return res.status(200).json(res.locals.a11yResults);
});

module.exports = router;