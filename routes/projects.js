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
 *                     description: The geospatial perimeter of the project.
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
 *                           items:
 *                             type: number
 *                             description: A latitude/longitude pair.
 *                             example: [0, 0]
 */

// Get Project
router.get('/',  projectController.listProjects);


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
 *                 description: The geospatial perimeter of the project.
 *                 properties:
 *                   type:
 *                     type: string
 *                     description: The geometry type (e.g., Polygon).
 *                     example: "Polygon"
 *                   coordinates:
 *                     type: array
 *                     description: The coordinates of the perimeter.
 *                     items:
 *                       type: array
 *                       items:
 *                         type: number
 *                         description: A latitude/longitude pair.
 *                         example: [0, 0]
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
 *                   description: The geospatial perimeter of the newly created project.
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: "Polygon"
 *                     coordinates:
 *                       type: array
 *                       items:
 *                         type: array
 *                         items:
 *                           type: number
 *                           example: [0, 0]
*/
router.post('/', validateCreateProject, projectController.createProject);

router.put('/rename/:id', validateRenameProject, projectController.renameProject);

router.delete('/:id', validateDeleteProject, projectController.deleteProject);

router.get('/intersect', validateIntersectMergeProjects, projectController.intersectProjects);

router.put('/merge', validateIntersectMergeProjects, projectController.mergeProjects);

router.get('/department/:id', validateGetProject, projectController.getProjectDepartment);

module.exports = router;