// backend/src/routes/match.routes.js
const router = require("express").Router();
const ctrl   = require("../controllers/match.controller");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get( "/seekers",              ctrl.findSeekers);
router.post("/invite/:targetId",     ctrl.sendTeamInvite);
router.delete("/team",               ctrl.leaveTeam);

module.exports = router;
