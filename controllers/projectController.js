// controllers/projectController.js

const projectService = require('../services/projectService');

exports.createProject = async (req, res, next) => {
  try {
    const projectData = req.body;
    const project = await projectService.createProject(projectData);
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const id = req.params.id;
    await projectService.deleteProject(id);
    res.json({ message: `Project with id ${id} deleted successfully` });
  } catch (error) {
    next(error);
  }
};

exports.renameProject = async (req, res, next) => {
  try {
    const id = req.params.id;
    const newName = req.body.name;
    const project = await projectService.renameProject(id, newName);
    res.json({ message: `Project with id ${id} renamed successfully`, project });
  } catch (error) {
    next(error);
  }
};

exports.listProjects = async (req, res, next) => {
  try {
    const projects = await projectService.listProjects();
    res.json({ message: 'List of all projects', projects });
  } catch (error) {
    next(error);
  }
};

exports.testIntersection = async (req, res, next) => {
  try {
    const { projectId1, projectId2 } = req.body;
    const intersects = await projectService.testIntersection(projectId1, projectId2);
    res.json({ message: 'Intersection test completed', intersects });
  } catch (error) {
    next(error);
  }
};

exports.mergeProjects = async (req, res, next) => {
  try {
    const { projectId1, projectId2 } = req.body;
    const project = await projectService.mergeProjects(projectId1, projectId2);
    res.status(201).json({ message: 'Projects merged successfully', project });
  } catch (error) {
    next(error);
  }
};

exports.getDepartmentNumber = async (req, res, next) => {
  try {
    const id = req.params.id;
    const departmentNumber = await projectService.getDepartmentNumber(id);
    res.json({ message: `Department number for project ${id}`, departmentNumber });
  } catch (error) {
    next(error);
  }
};
