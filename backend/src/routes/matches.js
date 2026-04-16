const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  getSeekers,
  getMyTeam,
  createTeam,
  inviteToTeam,
  removeFromTeam,
  leaveTeam,
  dissolveTeam,
} = require("../controllers/matchController");

/**
 * Public routes
 */
router.get("/seekers", authenticate, getSeekers);

/**
 * Protected routes (require authentication)
 */
router.get("/my-team", authenticate, getMyTeam);
router.post("/", authenticate, createTeam);
router.post("/invite/:userId", authenticate, inviteToTeam);
router.delete("/remove/:userId", authenticate, removeFromTeam);
router.delete("/leave", authenticate, leaveTeam);
router.delete("/team", authenticate, dissolveTeam);

module.exports = router;
