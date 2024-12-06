// services/departmentService.js

const departmentRepository = 4;
const db = require('../models'); // Assuming models are in the './models' directory
const { EmptyResultError } = require('sequelize');
class DepartmentService {
  async createDepartment(departmentData) {
    
      const { name, perimeter } = departmentData;
  
      
      // Create department in the database
      const newDepartment = await db.Department.create({
        name,
        perimeter,
      });
  
      // Send response
      return newDepartment;
    
  }
  
  

  async deleteDepartment(id) {
    // Implement logic to delete department
    // check if department exists
    const department = await db.Department.findByPk(id);
    if (!department) {
      const err = new EmptyResultError(`Department with id ${id} not found`);
      err.status = 404;
      throw err;
    }
    // delete department
    await department.destroy();
    
  }

  async renameDepartment(id, newName) {
    // Implement logic to rename department
    const department = await db.Department.findByPk(id);
    if (!department) {
      // is there a specific error from the db class?
      const err = new EmptyResultError(`Department with id ${id} not found`);
      err.status = 404;
      throw err;

      
    }
    department.name = newName;
    await department.save();
    return department;
  }

  async listDepartments() {
    const departments = await db.Department.findAll();
    return departments
  }

}

module.exports = new DepartmentService();
 