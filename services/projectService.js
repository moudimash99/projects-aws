const projectRepository = 4;
const db = require('../models'); 
const {
    EmptyResultError
} = require('sequelize');
class ProjectService {
    async createProject(projectData) {

        const {
            name,
            perimeter
        } = projectData;

        const newProject = await db.Project.create({
            name,
            perimeter,
        });

        return newProject;

    }

    async deleteProject(id) {

        const project = await db.Project.findByPk(id);
        if (!project) {
            const err = new EmptyResultError(`Project with id ${id} not found`);
            err.status = 404;
            throw err;
        }

        await project.destroy();

    }

    async renameProject(id, newName) {

        const project = await db.Project.findByPk(id);
        if (!project) {

            const err = new EmptyResultError(`Project with id ${id} not found`);
            err.status = 404;
            throw err;

        }
        project.name = newName;
        await project.save();
        return project;
    }

    async listProjects() {
        const projects = await db.Project.findAll();
        return projects
    }

    async testIntersection(projectId1, projectId2) {

        const project1 = await db.Project.findByPk(projectId1);
        const project2 = await db.Project.findByPk(projectId2);

        if (!project1) {
            const err = new EmptyResultError(`Project with id ${projectId1} not found`);
            err.status = 404;
            throw err;
        }
        if (!project2) {
            const err = new EmptyResultError(`Project with id ${projectId2} not found`);
            err.status = 404;
            throw err;
        }

        const query = `
      SELECT 
        ST_Intersects(p1.perimeter, p2.perimeter) AS do_intersect
      FROM "Projects" p1, "Projects" p2
      WHERE p1.id = :id1 AND p2.id = :id2;
    `;

        const replacements = {
            id1: projectId1,
            id2: projectId2
        };
        const [result] = await db.Sequelize.query(query, {
            replacements,
            type: db.Sequelize.QueryTypes.SELECT
        });

        const doIntersect = result.do_intersect; 
        const message = doIntersect ? 'intersection' : 'no_intersection';
        return {
            message,
            intersection: doIntersect,
            project1,
            project2
        };

    }

    async mergeProjects(projectId1, projectId2) {
        const project1 = await db.Project.findByPk(projectId1);
        const project2 = await db.Project.findByPk(projectId2);

        if (!project1) {
            const err = new EmptyResultError(`Project with id ${project1} not found`);
            err.status = 404;
            throw err;
        }
        if (!project2) {
            const err = new EmptyResultError(`Project with id ${project2} not found`);
            err.status = 404;
            throw err;
        }

        const query = `
        SELECT 
          ST_IsEmpty(ST_Intersection(p1.perimeter, p2.perimeter)) AS is_disjoint,
          ST_Union(p1.perimeter, p2.perimeter) AS merged_geom
        FROM "Projects" p1, "Projects" p2
        WHERE p1.id = :id1 AND p2.id = :id2;
      `;

        const replacements = {
            id1: projectId1,
            id2: projectId2
        };
        const [result] = await db.Sequelize.query(query, {
            replacements
        });

        const isDisjoint = result[0].is_disjoint; 
        const mergedGeom = result[0].merged_geom;

        if (isDisjoint) {
            return {
                message: 'no_intersection',
                project1,
                project2
            };
        }

        const newProject = await this.createProject({
            name: 'Merged Project',
            perimeter: mergedGeom,
        });

        await this.deleteProject(projectId1);
        await this.deleteProject(projectId2);
        const oldProjects = {
            project1,
            project2
        };
        return {
            message: 'merged',
            mergedProject: newProject,
            oldProjects
        };
    }

    async getDepartmentNumber(projectId) {
        const project1 = await db.Project.findByPk(projectId);

        if (!project1) {
            const err = new EmptyResultError(`Project with id ${project1} not found`);
            err.status = 404;
            throw err;
        }
        const query = `
        WITH proj_center AS (
          SELECT ST_Centroid(perimeter) AS center
          FROM "Projects"
          WHERE id = :id
        )
        SELECT d.code, d.name
        FROM "Departments" d, proj_center c
        WHERE ST_Contains(d.perimeter, c.center);`;

        const replacements = {
            id: projectId
        };
        const [result] = await db.Sequelize.query(query, {
            replacements
        });

        if (result.length === 0) {

            const err = new EmptyResultError(`Project with id ${project1} is found within none of the departments`);
            err.status = 404;
            throw err;
        }
        if (result.length > 1) {

            const err = new Error(`Project with id ${project1} sits on the boundary of multiple departments`);
            err.status = 500;
            throw err;

        }
        return result[0]; 

    }
}

module.exports = new ProjectService();