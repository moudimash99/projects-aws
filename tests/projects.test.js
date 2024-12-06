const request = require('supertest');
const app = require('../app');

describe('Projects API', () => {
  it('GET /projects - should return list of all projects', async () => {
    const res = await request(app).get('/projects');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('projects');
  });

  it('POST /projects - should create a new project', async () => {
    const res = await request(app)
      .post('/projects')
      .send({ name: 'Test Project', perimeter: {} });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('project');
    expect(res.body.project).toHaveProperty('name', 'Test Project');
  });

});