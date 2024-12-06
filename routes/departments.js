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

router.get('/',  departmentController.listDepartments);

router.post('/', validateCreateProject, departmentController.createDepartment);

router.put('/rename/:id', validateRenameProject, departmentController.renameDepartment);

router.delete('/:id', validateDeleteProject, departmentController.deleteDepartment);

module.exports = router;