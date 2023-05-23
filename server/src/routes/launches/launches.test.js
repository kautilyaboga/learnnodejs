const request = require('supertest');
const app = require('../../app')

// Group of tests
describe('Test GET /launches', ()=>{
  // individual test and its name
  test('It should respond with 200 success', async()=>{
    const response = await request(app)
    .get('/launches')
    .expect(200)
    .expect('Content-Type', /json/);
    // expect(response.statusCode).toBe(200);
  })
});

describe('Test POST /launch',()=>{

  const completeLaunchData = {
    "mission" : "USS Enterprise",
    "rocket" : "NCC 1701-D",
    "launchDate" : "January 27, 2030",
    "target" : "Kepler-186 f",
  };

  const launchDataWithOutDate = {
    "mission" : "USS Enterprise",
    "rocket" : "NCC 1701-D",
    "target" : "Kepler-186 f",
  }

  const launchDataWithInvalidDate = {
    "mission" : "USS Enterprise",
    "rocket" : "NCC 1701-D",
    "launchDate" : "Zoot",
    "target" : "Kepler-186 f",
  };


  test('It should respond with 201 success', async()=>{
    const response = await request(app)
    .post('/launches')
    .send(completeLaunchData)
    .expect('Content-Type',/json/)
    .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate);
    expect(response.body).toMatchObject(launchDataWithOutDate);

  })

  test('It should catch missing required properties', async()=>{
    const response = await request(app)
    .post('/launches')
    .send(launchDataWithOutDate)
    .expect('Content-Type',/json/)
    .expect(400);

    expect(response.body).toStrictEqual({
      error :"Missing required launch property",
    })
  })
  test('It should catch in valida dates', async()=>{

    const response = await request(app)
    .post('/launches')
    .send(launchDataWithInvalidDate)
    .expect('Content-Type',/json/)
    .expect(400);

    expect(response.body).toStrictEqual({
      error :"Invalid Launch Date",
    })


  })
});