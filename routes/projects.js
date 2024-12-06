// routes/projectRoutes.js

const express = require('express');
const projectController = require('../controllers/projectController');
const {
  validateCreateProject,
  validateRenameProject,
  validateDeleteProject,
  validateIntersectMergeProjects,
  validateGetProject,
} = require('../validators/projectValidator');

const router = express.Router();

// Get Project
router.get('/',  projectController.listProjects);

// Create Project
router.post('/', validateCreateProject, projectController.createProject);

// Rename Project
router.put('/rename/:id', validateRenameProject, projectController.renameProject);

// Delete Project
router.delete('/:id', validateDeleteProject, projectController.deleteProject);

// Intersect Projects
router.get('/intersect', validateIntersectMergeProjects, projectController.intersectProjects);

// Merge Projects
router.put('/merge', validateIntersectMergeProjects, projectController.mergeProjects);

// GET /projects/:id/department - get department for a project by id
router.get('/department/:id', validateGetProject, projectController.getProjectDepartment);
 
module.exports = router;
