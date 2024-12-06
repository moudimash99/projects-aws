/**
 * tests/api.test.js
 *
 * This test suite covers all seven operations of your Node.js backend API.
 * We use Supertest to send requests to the API.
 *
 * Before running these tests:
 * 1. Ensure your server (app.js) is running on http://localhost:3000 or consider importing your app and calling `request(app)` directly.
 * 2. If your code exports an express app, you can `require` it and do `request(app)`.
 *    Otherwise, run the server before tests and rely on `request("http://localhost:3000")`.
 */

const request = require('supertest');
// If your app exports the Express instance, you can do:
// const app = require('../app'); 
// Then use request(app). If not, and you run your server separately, do:
const API_URL = 'http://localhost:3000';

describe('Node.js API Integration Tests', () => {
  let createdProjectId;

  // Sample perimeter for createProject
  const validPerimeter = {
    type: "Polygon",
    coordinates: [
      [
        [3.2945, 48.8584],
        [3.2955, 48.8585],
        [3.2955, 48.8575],
        [3.2945, 48.8575],
        [3.2945, 48.8584]
      ]
    ]
  };

  /**
   * 1. createProject (POST /projects)
   * Body: { "name": "Test Project", "perimeter": <geojson polygon> }
   * Expected: 201 Created and returns the created project JSON with an id.
   */
  it('should create a new project', async () => {
    const res = await request(API_URL)
      .post('/projects')
      .send({
        name: "Test Project",
        perimeter: validPerimeter
      })
      .expect('Content-Type', /json/)
      .expect(201);

    // Expect a project object back with id, name, perimeter fields
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Project');
    expect(res.body.perimeter).toEqual(validPerimeter);

    // Store the created project ID for later tests
    createdProjectId = res.body.id;
  });

  /**
   * 2. listProjects (GET /projects)
   * No body needed. Expected: 200 OK and an array of projects.
   */
  it('should list all projects', async () => {
    const res = await request(API_URL)
      .get('/projects')
      .expect('Content-Type', /json/)
      .expect(200);

    // Expect an array of projects
    expect(Array.isArray(res.body)).toBe(true);

    // Check that the previously created project is in the list
    const found = res.body.find(p => p.id === createdProjectId);
    expect(found).toBeDefined();
    expect(found.name).toBe('Test Project');
  });

  /**
   * 3. deleteProject (DELETE /projects/:id)
   * Takes an existing project ID.
   * Expected: if project exists, return 200 with success message.
   */
  // We'll test deletion after we test rename and department, so we create another project for deletion test
  let projectToDeleteId;
  it('should create another project for deletion test', async () => {
    const res = await request(API_URL)
      .post('/projects')
      .send({
        name: "ToDelete",
        perimeter: validPerimeter
      })
      .expect(201);
    projectToDeleteId = res.body.id;
  });

  /**
   * 4. renameProject (PUT /projects/:id/rename)
   * Body: { "name": "New Name" }
   * Expected: 200 and returns updated project with new name.
   */
  it('should rename the created project', async () => {
    const res = await request(API_URL)
      .put(`/projects/${createdProjectId}/rename`)
      .send({ name: "Updated Project Name" })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.message).toMatch(/renamed successfully/i);
    expect(res.body.project).toHaveProperty('id', createdProjectId);
    expect(res.body.project.name).toBe("Updated Project Name");
  });

  /**
   * 5. intersectProjects (POST /projects/intersect)
   * Body: { "projectId1": <id>, "projectId2": <id> }
   * Expected: 200 and returns an object with intersection results.
   * We'll need two projects. We already have createdProjectId and projectToDeleteId. Let's assume intersection logic works.
   */
  it('should test intersection of two projects', async () => {
    const res = await request(API_URL)
      .post('/projects/intersect')
      .send({
        projectId1: createdProjectId,
        projectId2: projectToDeleteId
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.message).toBe('Intersection test completed');
    // The actual intersection logic returns "intersects" boolean maybe:
    expect(res.body).toHaveProperty('intersects');
    // Example check:
    expect(typeof res.body.intersects).toBe('boolean');
  });

  /**
   * 6. mergeProjects (POST /projects/merge)
   * Body: { "projectId1": <id>, "projectId2": <id> }
   * Expected: 201 and returns the merged project.
   * We can merge the two existing projects (createdProjectId and projectToDeleteId).
   */
  it('should merge two projects', async () => {
    const res = await request(API_URL)
      .post('/projects/merge')
      .send({
        projectId1: createdProjectId,
        projectId2: projectToDeleteId
      })
      .expect('Content-Type', /json/)
      .expect(201);

    expect(res.body.message).toBe('Projects merged successfully');
    expect(res.body).toHaveProperty('project');
    expect(res.body.project).toHaveProperty('id');
    expect(res.body.project.name).toMatch(/Merged Project/i);
  });

  /**
   * 7. getProjectDepartment (GET /projects/:id/department)
   * No body needed. Just supply the project ID.
   * Expected: 200 and returns { message, departmentNumber }.
   * We'll use the original createdProjectId (renamed project) to get its department.
   */
  it('should return the department number of a project', async () => {
    const res = await request(API_URL)
      .get(`/projects/${createdProjectId}/department`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.message).toMatch(/Department number for project/);
    expect(res.body).toHaveProperty('departmentNumber');
    expect(typeof res.body.departmentNumber).toBe('number');
  });

  /**
   * Now let's test deletion using projectToDeleteId.
   * deleteProject (DELETE /projects/:id)
   * We created "ToDelete" project earlier just for this test.
   */
  it('should delete a project', async () => {
    const res = await request(API_URL)
      .delete(`/projects/${projectToDeleteId}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  /**
   * Test deletion of a non-existent project (after we deleted it):
   * Expected: error, possibly 404 or 500 depending on your controller logic.
   */
  it('should return an error when deleting a non-existent project', async () => {
    const res = await request(API_URL)
      .delete(`/projects/${projectToDeleteId}`)
      .expect('Content-Type', /json/);

    // Check the status code if your controller sets 404 or 500
    // The previously shared code might return 500 for not found. Adjust accordingly:
    expect(404).toContain(res.statusCode);
    // Check message in the response
    expect(res.body).toHaveProperty('error');
    // This shows we handle errors gracefully
  });
});
