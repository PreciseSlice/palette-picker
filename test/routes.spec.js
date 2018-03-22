const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', () => {
    return chai
      .request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(err => {
        throw err;
      });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai
      .request(server)
      .get('/abc')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(err => {
        throw err;
      });
  });
});

describe('API Routes', () => {
  describe('GET /api/v1/projects', () => {
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
          response.body[0].name.should.equal('second project');
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('GET /api/v1/projects/1', () => {
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
          response.body[0].name.should.equal('second project');
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('GET /api/v1/palettes/1', () => {
    it('should return the palettes with a foriegn key of 1', () => {
      return chai
        .request(server)
        .get('/api/v1/palettes/1')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);            
          response.body[0].should.have.property('palette_name');
          response.body[0].palette_name.should.equal('pallet one');
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
        .catch(err => {
          throw err;
        });
    });
  });
});
