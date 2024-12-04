// services/projectService.js

const projectRepository = require('../repositories/projectRepository');

class ProjectService {
  async createProject(projectData) {
    // Add business logic if needed
    const project = await projectRepository.createProject(projectData);
    return project;
  }

  async deleteProject(id) {
    const result = await projectRepository.deleteProject(id);
    return result;
  }

  async renameProject(id, newName) {
    const project = await projectRepository.renameProject(id, newName);
    return project;
  }

  async listProjects() {
    const projects = await projectRepository.listProjects();
    return projects;
  }

  async testIntersection(projectId1, projectId2) {
    // Implement geospatial logic
    return true; // Placeholder
  }

  async mergeProjects(projectId1, projectId2) {
    // Implement geospatial logic
    return { id: 3, name: 'Merged Project', perimeter: {} }; // Placeholder
  }

  async getDepartmentNumber(projectId) {
    // Implement logic to get department number
    return 75; // Placeholder
  }
}

module.exports = new ProjectService();
