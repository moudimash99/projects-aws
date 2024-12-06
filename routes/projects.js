// routes/projectRoutes.js

const express = require('express');
const projectController = require('../controllers/projectController');
const {
  validateCreateProject,
  validateRenameProject,
  validateDeleteProject,
  validateIntersectMergeProjects,
  validateGetProject,
} = require('../validators/projectValidator');

const router = express.Router();

// Get Project
router.get('/',  projectController.listProjects);

router.post('/', validateCreateProject, projectController.createProject);

router.put('/rename/:id', validateRenameProject, projectController.renameProject);

router.delete('/:id', validateDeleteProject, projectController.deleteProject);

router.get('/intersect', validateIntersectMergeProjects, projectController.intersectProjects);

router.put('/merge', validateIntersectMergeProjects, projectController.mergeProjects);

router.get('/department/:id', validateGetProject, projectController.getProjectDepartment);

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the project.
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the project.
 *           example: "Project Alpha"
 *         perimeter:
 *           type: object
 *           description: The geospatial perimeter of the project in GeoJSON Polygon format.
 *           properties:
 *             type:
 *               type: string
 *               enum: [Polygon]
 *               description: The GeoJSON object type.
 *               example: "Polygon"
 *             coordinates:
 *               type: array
 *               description: The coordinates defining the perimeter polygon.
 *               items:
 *                 type: array
 *                 description: An array of [longitude, latitude] pairs defining a linear ring.
 *                 items:
 *                   type: number
 *                   description: A single coordinate pair representing longitude and latitude.
 *                   example: [2.2945, 48.8584]
 *           required:
 *             - type
 *             - coordinates
 *           example:
 *             type: Polygon
 *             coordinates:
 *               - [
 *                   [2.2945, 48.8584],
 *                   [2.2955, 48.8585],
 *                   [2.2955, 48.8575],
 *                   [2.2945, 48.8575],
 *                   [2.2945, 48.8584]
 *                 ]
 *       required:
 *         - name
 *         - perimeter
 *     
 *     Department:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: The unique code of the department.
 *           example: 31
 *         name:
 *           type: string
 *           description: The name of the department.
 *           example: "Haute-Garonne"
 *         perimeter:
 *           type: object
 *           description: The geospatial perimeter of the department in GeoJSON Polygon format.
 *           properties:
 *             type:
 *               type: string
 *               enum: [Polygon]
 *               description: The GeoJSON object type.
 *               example: "Polygon"
 *             coordinates:
 *               type: array
 *               description: The coordinates defining the perimeter polygon.
 *               items:
 *                 type: array
 *                 description: An array of [longitude, latitude] pairs defining a linear ring.
 *                 items:
 *                   type: number
 *                   description: A single coordinate pair representing longitude and latitude.
 *                   example: [2.2945, 48.8584]
 *           required:
 *             - type
 *             - coordinates
 *           example:
 *             type: Polygon
 *             coordinates:
 *               - [
 *                   [2.2945, 48.8584],
 *                   [2.2955, 48.8585],
 *                   [2.2955, 48.8575],
 *                   [2.2945, 48.8575],
 *                   [2.2945, 48.8584]
 *                 ]
 *       required:
 *         - code
 *         - name
 *         - perimeter
 */


/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Retrieve all projects
 *     description: Returns a list of all projects stored in the database, including their IDs, names, and geospatial perimeters.
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique ID of the project.
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: The name of the project.
 *                     example: "Project Alpha"
 *                   perimeter:
 *                     type: object
 *                     description: The geospatial perimeter of the project in GeoJSON Polygon format.
 *                     properties:
 *                       type:
 *                         type: string
 *                         description: The geometry type (e.g., Polygon).
 *                         example: "Polygon"
 *                       coordinates:
 *                         type: array
 *                         description: The coordinates of the perimeter.
 *                         items:
 *                           type: array
 *                           description: An array of [longitude, latitude] pairs defining a linear ring.
 *                           items:
 *                             type: number
 *                             description: A single coordinate pair representing longitude and latitude.
 *                             example: [2.2945, 48.8584]
 *                     required:
 *                       - type
 *                       - coordinates
 *                     example:
 *                       type: Polygon
 *                       coordinates:
 *                         - [
 *                             [2.2945, 48.8584],
 *                             [2.2955, 48.8585],
 *                             [2.2955, 48.8575],
 *                             [2.2945, 48.8575],
 *                             [2.2945, 48.8584]
 *                           ]
 */




/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     description: Creates a new project with a name and a geospatial perimeter.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the project.
 *                 example: "Project Gamma"
 *               perimeter:
 *                 type: object
 *                 description: The geospatial perimeter of the project in GeoJSON Polygon format.
 *                 properties:
 *                   type:
 *                     type: string
 *                     description: The geometry type (e.g., Polygon).
 *                     enum: [Polygon]
 *                     example: "Polygon"
 *                   coordinates:
 *                     type: array
 *                     description: The coordinates defining the perimeter polygon.
 *                     items:
 *                       type: array
 *                       description: An array of [longitude, latitude] pairs defining a linear ring.
 *                       items:
 *                         type: number
 *                         description: A single coordinate pair representing longitude and latitude.
 *                         example: [2.2945, 48.8584]
 *                 required:
 *                   - type
 *                   - coordinates
 *                 example:
 *                   type: Polygon
 *                   coordinates:
 *                     - [
 *                         [2.2945, 48.8584],
 *                         [2.2955, 48.8585],
 *                         [2.2955, 48.8575],
 *                         [2.2945, 48.8575],
 *                         [2.2945, 48.8584]
 *                       ]
 *             required:
 *               - name
 *               - perimeter
 *     responses:
 *       201:
 *         description: Project created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique ID of the newly created project.
 *                   example: 3
 *                 name:
 *                   type: string
 *                   description: The name of the newly created project.
 *                   example: "Project Gamma"
 *                 perimeter:
 *                   type: object
 *                   description: The geospatial perimeter of the newly created project in GeoJSON Polygon format.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The geometry type (e.g., Polygon).
 *                       enum: [Polygon]
 *                       example: "Polygon"
 *                     coordinates:
 *                       type: array
 *                       description: The coordinates defining the perimeter polygon.
 *                       items:
 *                         type: array
 *                         description: An array of [longitude, latitude] pairs defining a linear ring.
 *                         items:
 *                           type: number
 *                           description: A single coordinate pair representing longitude and latitude.
 *                           example: [2.2945, 48.8584]
 *                   required:
 *                     - type
 *                     - coordinates
 *                   example:
 *                     type: Polygon
 *                     coordinates:
 *                       - [
 *                           [2.2945, 48.8584],
 *                           [2.2955, 48.8585],
 *                           [2.2955, 48.8575],
 *                           [2.2945, 48.8575],
 *                           [2.2945, 48.8584]
 *                         ]
 *       400:
 *         description: Validation error due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "name"
 *                       message:
 *                         type: string
 *                         example: "Name is required."
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /projects/{id}/rename:
 *   put:
 *     summary: Rename an existing project
 *     description: Updates the name of a project by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the project to rename
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name for the project
 *                 example: Updated Project Name
 *     responses:
 *       200:
 *         description: Project renamed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project with id 1 renamed successfully
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error due to invalid input
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete an existing project
 *     description: Removes a project from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the project to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project with id 1 deleted successfully
 *       400:
 *         description: Validation error due to invalid input
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /projects/intersect:
 *   get:
 *     summary: Check Intersection Between Two Projects
 *     description: Determines whether the perimeters of two projects intersect.
 *     parameters:
 *       - in: query
 *         name: id1
 *         required: true
 *         description: The ID of the first project.
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: id2
 *         required: true
 *         description: The ID of the second project.
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Intersection test result.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Outcome message of the intersection test.
 *                   example: "Intersection detected"
 *                 intersection:
 *                   type: boolean
 *                   description: Indicates whether the perimeters intersect.
 *                   example: true
 *                 project1:
 *                   $ref: '#/components/schemas/Project'
 *                 project2:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error due to missing or invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "id1"
 *                       message:
 *                         type: string
 *                         example: "First Project ID (id1) is required."
 *       404:
 *         description: One or both projects not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Project with id 1 not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /projects/merge:
 *   put:
 *     summary: Merge Two Projects
 *     description: Merges two projects into a new project by combining their perimeters. If the projects do not intersect, the merge is not performed.
 *     parameters:
 *       - in: query
 *         name: id1
 *         required: true
 *         description: The ID of the first project to merge.
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: id2
 *         required: true
 *         description: The ID of the second project to merge.
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       201:
 *         description: Projects merged successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Outcome message of the merge operation.
 *                   example: "Projects merged successfully"
 *                 mergedProject:
 *                   $ref: '#/components/schemas/Project'
 *                 oldProjects:
 *                   type: object
 *                   description: Details of the original projects that were merged.
 *                   properties:
 *                     project1:
 *                       $ref: '#/components/schemas/Project'
 *                     project2:
 *                       $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error due to missing or invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "id2"
 *                       message:
 *                         type: string
 *                         example: "Second Project ID (id2) is required."
 *       404:
 *         description: One or both projects not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Project with id 2 not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /projects/department/{id}:
 *   get:
 *     summary: Get Department for a Project
 *     description: Retrieves the department information that contains the specified project based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the project for which to retrieve the department.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Department information for the specified project.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Outcome message of the department retrieval.
 *                   example: "Department number for project 1"
 *                 departmentNumber:
 *                   $ref: '#/components/schemas/Department'
 *       400:
 *         description: Validation error due to missing or invalid path parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "id"
 *                       message:
 *                         type: string
 *                         example: "Project ID is required."
 *       404:
 *         description: Project not found or no department contains the project's midpoint.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Project with id 1 is found within none of the departments"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

module.exports = router;