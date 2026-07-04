const router = require("express").Router();
const ctrl = require("../controllers/visit.controller");
const { authenticate } = require("../middleware/auth");

// All visit request routes require authentication
router.use(authenticate);

// Create visit request (visitor initiates)
router.post("/", ctrl.createVisitRequest);

// Get incoming requests (for host)
router.get("/incoming", ctrl.getIncomingRequests);

// Get sent requests (for visitor)
router.get("/sent", ctrl.getSentRequests);

// Get visit statistics
router.get("/stats", ctrl.getVisitStats);

// Get single visit request
router.get("/:id", ctrl.getVisitRequest);

// Confirm visit request (host accepts)
router.post("/:id/confirm", ctrl.confirmVisitRequest);

// Decline visit request (host rejects)
router.post("/:id/decline", ctrl.declineVisitRequest);

// Complete visit request (after visit)
router.post("/:id/complete", ctrl.completeVisitRequest);

// Cancel visit request
router.post("/:id/cancel", ctrl.cancelVisitRequest);

module.exports = router;
