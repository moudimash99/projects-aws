// services/projectService.js

const projectRepository = 4;
const db = require('../models'); // Assuming models are in the './models' directory
const {
    EmptyResultError
} = require('sequelize');
class ProjectService {
    async createProject(projectData) {

        const {
            name,
            perimeter
        } = projectData;


        // Create project in the database
        const newProject = await db.Project.create({
            name,
            perimeter,
        });

        // Send response
        return newProject;

    }



    async deleteProject(id) {
        // Implement logic to delete project
        // check if project exists
        const project = await db.Project.findByPk(id);
        if (!project) {
            const err = new EmptyResultError(`Project with id ${id} not found`);
            err.status = 404;
            throw err;
        }
        // delete project
        await project.destroy();

    }

    async renameProject(id, newName) {
        // Implement logic to rename project
        const project = await db.Project.findByPk(id);
        if (!project) {
            // is there a specific error from the db class?
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
        // Fetch the projects by their IDs
        const project1 = await db.Project.findByPk(projectId1);
        const project2 = await db.Project.findByPk(projectId2);

        // Check if both projects exist
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

        // Perform the geospatial query to check for intersection
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

        const doIntersect = result.do_intersect; // Returns true if geometries intersect
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

        const isDisjoint = result[0].is_disjoint; // Returns true if geometries do not intersect
        const mergedGeom = result[0].merged_geom;

        if (isDisjoint) {
            return {
                message: 'no_intersection',
                project1,
                project2
            };
        }

        // Create the new merged project
        const newProject = await this.createProject({
            name: 'Merged Project',
            perimeter: mergedGeom,
        });

        // Delete the original projects
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
        SELECT d.id, d.name
        FROM "Departments" d, proj_center c
        WHERE ST_Contains(d.perimeter, c.center);`;

        const replacements = {
            id: projectId
        };
        const [result] = await db.sequelize.query(query, {
            replacements
        });

        if (result.length === 0) {
            // No department found containing this project’s midpoint
            const err = new EmptyResultError(`Project with id ${project1} is found within none of the departments`);
            err.status = 404;
            throw err;
        }
        if (result.length > 1) {
            // Multiple departments found containing this project’s midpoint
            const err = new Error(`Project with id ${project1} sits on the boundary of multiple departments`);
            err.status = 500;
            throw err;

        }
        return result[0]; // Should only return one department since they are mutually exclusive

    }
}

module.exports = new ProjectService();