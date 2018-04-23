const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const enviroment = 'test';
const configuration = require('../knexfile')[enviroment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Routes', () => {
  beforeEach(done => {
    database.migrate.rollback().then(() => {
      database.migrate.latest().then(() =>
        database.seed.run().then(() => {
          done();
        })
      );
    });
  });

  describe('Client Routes', () => {
    it('should return the homepage with text', () => {
      return chai
        .request(server)
        .get('/')
        .then(response => {
          response.should.have.status(200);
          response.should.be.html;
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return a 404 for a route that does not exist', () => {
      return chai
        .request(server)
        .get('/abc')
        .then(response => {
          response.should.have.status(404);
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('API Routes', () => {
    describe('GET', () => {
      describe('api/v1/projects', () => {
        it('should return all of the projects', () => {
          return chai
            .request(server)
            .get('/api/v1/projects')
            .then(response => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body.length.should.equal(1);
              response.body[0].should.have.property('id');
              response.body[0].id.should.equal(1);
              response.body[0].should.have.property('name');
              response.body[0].name.should.equal('first project');
            })
            .catch(error => {
              throw error;
            });
        });
      });

      describe('api/v1/projects/:id', () => {
        it('should return the project with an id of 1', () => {
          return chai
            .request(server)
            .get('/api/v1/projects/1')
            .then(response => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body.length.should.equal(1);
              response.body[0].should.have.property('id');
              response.body[0].id.should.equal(1);
              response.body[0].should.have.property('name');
              response.body[0].name.should.equal('first project');
            })
            .catch(error => {
              throw error;
            });
        });
      });

      describe('api/v1/palettes/:id', () => {
        it('should return the palettes with a foriegn key of 1', () => {
          return chai
            .request(server)
            .get('/api/v1/palettes/1')
            .then(response => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body.length.should.equal(2);
              response.body[0].should.have.property('palette_name');
              response.body[0].palette_name.should.equal('palette one');
              response.body[0].should.have.property('color_one');
              response.body[0].color_one.should.equal('#848f5b');
              response.body[0].should.have.property('color_two');
              response.body[0].color_two.should.equal('#21fe01');
              response.body[0].should.have.property('color_three');
              response.body[0].color_three.should.equal('#76789c');
              response.body[0].should.have.property('color_four');
              response.body[0].color_four.should.equal('#6c63d3');
              response.body[0].should.have.property('color_five');
              response.body[0].color_five.should.equal('#f0f759');
              response.body[0].should.have.property('project_id');
              response.body[0].project_id.should.equal(1);
            })
            .catch(error => {
              throw error;
            });
        });
      });
    });

    describe('POST', () => {
      describe('api/v1/palettes', () => {
        it('should create a new palette', () => {
          return chai
            .request(server)
            .post('/api/v1/palettes')
            .send({
              project_id: 1,
              palette_name: 'pallet three',
              color_one: '#343b78',
              color_two: '#1d0286',
              color_three: '#d6b741',
              color_four: '#11691f',
              color_five: '#add764'
            })
            .then(response => {
              response.should.have.status(201);
              response.should.be.json;
              response.body.should.be.a('object');
              response.body.should.have.property('id');
              response.body.id.should.equal(3);
            })
            .catch(error => {
              throw error;
            });
        });

        it('should not create a palette with missing information', () => {
          return chai
            .request(server)
            .post('/api/v1/palettes')
            .send({
              project_id: 1,
              palette_name: 'pallet three',
              color_one: '#343b78',
              color_two: '#1d0286',
              color_three: '#d6b741',
              color_four: '#11691f'
            })
            .then(response => {
              response.should.have.status(422);
              response.body.should.have.property('error');
              response.body.error.should.equal('You are missing a "color_five" property');
            })
            .catch(error => {
              throw error;
            });
        });
      });

      describe('api/v1/projects', () => {
        it('should create a new project', () => {
          return chai
            .request(server)
            .post('/api/v1/projects')
            .send({
              name: 'second project'
            })
            .then(response => {
              response.should.have.status(201);
              response.should.be.json;
              response.body.should.be.a('object');
              response.body.should.have.property('id');
              response.body.id.should.equal(2);
            });
        });

        it('should not create a project with missing information', () => {
          return chai
            .request(server)
            .post('/api/v1/projects')
            .send({
              title: 'second project'
            })
            .then(response => {
              response.should.have.status(422);
              response.body.should.have.property('error');
              response.body.error.should.equal('You are missing a "name" property.');
            })
            .catch(error => {
              throw error;
            });
        });
      });
    });

    describe('DELETE', () => {
      describe('api/v1/palettes/:id', () => {
        it('should delete the palette with the specified id', () => {
          return chai
            .request(server)
            .delete('/api/v1/palettes/1')
            .then(response => {
              response.should.have.status(200);
              response.body.should.have.property('id');
              response.body.id.should.equal('1');
            });
        });
      });
    });
  });
});
