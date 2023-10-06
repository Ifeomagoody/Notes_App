const express = require("express");
const router = express.Router();
const { isLoggedIn } = requires('../middleware/checkAuth')
const dashboardController = require("../controllers/dashboardController");


/**
 * Dashboard Routes
 */
router.get("/dashboard",  isLoggedIn, dashboardController.dashboard);
router.get("/dashboard/item/:id",  isLoggedIn, dashboardController.dashboardViewNote);
router.put("/dashboard/item/:id",  isLoggedIn, dashboardController.dashboardUpdateNote);
router.delete("/dashboard/item-delete/:id",  isLoggedIn, dashboardController.dashboarDeleteNote);
router.get("/dashboard", isLoggedIn, dashboardController.dashboardAddNote);
router.post("/dashboard", isLoggedIn, dashboardController.dashboardAddNoteSubmit);
router.post("/dashboard/search", isLoggedIn, dashboardController.dashboardSearchSubmit);



module.exports = router