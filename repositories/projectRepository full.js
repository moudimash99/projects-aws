// repositories/projectRepository.js

const Project = require('../models/project');

class ProjectRepository {
  async createProject(projectData) {
    const project = await Project.create(projectData);
    return project;
  }

  async deleteProject(id) {
    const result = await Project.destroy({ where: { id } });
    return result > 0; // Returns true if a row was deleted
  }

  async renameProject(id, newName) {
    const [updatedRows] = await Project.update({ name: newName }, { where: { id } });
    if (updatedRows === 0) {
      throw new Error('Project not found');
    }
    const project = await Project.findByPk(id);
    return project;
  }

  async listProjects() {
    const projects = await Project.findAll();
    return projects;
  }

  async getProjectById(id) {
    const project = await Project.findByPk(id);
    return project;
  }

  // Additional methods for geospatial operations

  async getProjectsByIds(ids) {
    const projects = await Project.findAll({ where: { id: ids } });
    return projects;
  }
}

module.exports = new ProjectRepository();
