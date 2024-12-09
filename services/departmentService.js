const departmentRepository = 4;
const db = require('../models'); 
const { EmptyResultError } = require('sequelize');
class DepartmentService {
  async createDepartment(departmentData) {

      const { name, code, perimeter } = departmentData;

      const newDepartment = await db.Department.create({
        name,
        code,
        perimeter,
      });

      return newDepartment;

  }

  async deleteDepartment(id) {

    const department = await db.Department.findByPk(id);
    if (!department) {
      const err = new EmptyResultError(`Department with id ${id} not found`);
      err.status = 404;
      throw err;
    }

    await department.destroy();

  }

  async renameDepartment(id, newName) {

    const department = await db.Department.findByPk(id);
    if (!department) {

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