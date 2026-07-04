// backend/src/routes/match.routes.js
const router = require("express").Router();
const ctrl   = require("../controllers/match.controller");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

router.get( "/seekers",              ctrl.findSeekers);
router.post("/invite/:targetId",     ctrl.sendTeamInvite);
router.delete("/team",               ctrl.leaveTeam);

module.exports = router;
