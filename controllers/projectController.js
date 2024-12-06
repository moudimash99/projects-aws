// controllers/projectController.js
const { EmptyResultError } = require('sequelize');
const projectService = require('../services/projectService');
const { validationResult } = require('express-validator');


exports.createProject = async (req, res, next) => {
  try {
    // Validation
    const { name, perimeter } = req.body;
    const project =  await projectService.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

exports.listProjects = async (req, res, next) => {
  try {
    const projects = await projectService.listProjects();
    res.status(200).json(projects);
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

exports.intersectProjects = async (req, res, next) => {
  try {
    const { id1, id2 } = req.query;
    const intersects = await projectService.testIntersection(id1, id2);
    res.json({ message: 'Intersection test completed', intersects });
  } catch (error) {
    next(error);
  }
};

exports.mergeProjects = async (req, res, next) => {
  try {
    const { id1, id2 } = req.query;
    const project = await projectService.mergeProjects(id1, id2);
    res.status(201).json({ message: 'Projects merged successfully', project });
  } catch (error) {
    next(error);
  }
};

exports.getProjectDepartment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const departmentNumber = await projectService.getDepartmentNumber(id);
    res.json({ message: `Department number for project ${id}`, departmentNumber });
  } catch (error) {
    next(error);
  }
};
