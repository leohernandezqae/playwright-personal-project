const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require('../middleware/authMiddleware');

// Protect all routes
router.use(authenticateToken);

router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
