// controllers/projectController.js
const { EmptyResultError } = require('sequelize');
const departmentService = require('../services/departmentService');
const { validationResult } = require('express-validator');


exports.createDepartment = async (req, res, next) => {
  try {
    const { name, perimeter } = req.body;
    const project =  await departmentService.createDepartment(req.body);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

exports.listDepartments = async (req, res, next) => {
  try {
    const projects = await departmentService.listDepartments();
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    const id = req.params.id;
    await departmentService.deleteDepartment(id);
    res.json({ message: `Department with id ${id} deleted successfully` });
  } catch (error) {
    next(error);
  }
};

exports.renameDepartment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const newName = req.body.name;
    const project = await departmentService.renameDepartment(id, newName);
    res.json({ message: `Department with id ${id} renamed successfully`, project });
  } catch (error) {
    next(error);
  }
};

exports.intersectDepartments = async (req, res, next) => {
  try {
    const { id1, id2 } = req.query;
    const intersects = await departmentService.testIntersection(id1, id2);
    res.json({ message: 'Intersection test completed', intersects });
  } catch (error) {
    next(error);
  }
};

exports.mergeDepartments = async (req, res, next) => {
  try {
    const { id1, id2 } = req.query;
    const project = await departmentService.mergeDepartments(id1, id2);
    res.status(201).json({ message: 'Departments merged successfully', project });
  } catch (error) {
    next(error);
  }
};

exports.getDepartmentDepartment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const departmentNumber = await departmentService.getDepartmentNumber(id);
    res.json({ message: `Department number for project ${id}`, departmentNumber });
  } catch (error) {
    next(error);
  }
};
