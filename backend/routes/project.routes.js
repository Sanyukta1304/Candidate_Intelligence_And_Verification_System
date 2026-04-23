const express = require("express");
const router = express.Router();

const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

const { verifyToken } = require("../middleware/auth");

router.get("/projects", verifyToken, getProjects);
router.post("/projects", verifyToken, createProject);
router.put("/projects/:id", verifyToken, updateProject);
router.delete("/projects/:id", verifyToken, deleteProject);

module.exports = router;