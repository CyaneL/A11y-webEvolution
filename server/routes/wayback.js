const express = require('express');
const waybackRouter = express.Router();
const waybackController =  require('../controllers/waybackController')

// --------------- Test route that triggers getSnapshot------------------
waybackRouter.get('/test',waybackController.getArchive, waybackController.getSnapshotAndAnalyze, (req, res) => {
  return res.status(200).json(res.locals.a11yResults);
});
//--------------------testing ends------------------------------------


waybackRouter.get('/', waybackController.getArchive, waybackController.getSnapshotAndAnalyze, (req, res) => {
  return res.status(200).json(res.locals.a11yResults);
});

module.exports = waybackRouter;