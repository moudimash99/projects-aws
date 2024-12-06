// routes/projectRoutes.js

const express = require('express');
const departmentController = require('../controllers/departmentController');
const {
  validateCreateProject,
  validateRenameProject,
  validateDeleteProject,
  validateIntersectMergeProjects,
  validateGetProject,
} = require('../validators/projectValidator');

const router = express.Router();

// Get Project

router.get('/',  departmentController.listDepartments);

// Create Project
router.post('/', validateCreateProject, departmentController.createDepartment);

// Rename Project
router.put('/rename/:id', validateRenameProject, departmentController.renameDepartment);

// Delete Project
router.delete('/:id', validateDeleteProject, departmentController.deleteDepartment);

module.exports = router;