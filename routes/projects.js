// routes/projects.js

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Create a Project
router.post('/', projectController.createProject);

// Delete a Project
router.delete('/:id', projectController.deleteProject);

// Rename a Project
router.put('/:id', projectController.renameProject);

// List All Projects
router.get('/', projectController.listProjects);

// Test for Project Intersection
router.post('/intersect', projectController.testIntersection);

// Merge Two Projects
router.post('/merge', projectController.mergeProjects);

// Return Department Number for Project Center Point
router.get('/:id/department', projectController.getDepartmentNumber);

module.exports = router;
