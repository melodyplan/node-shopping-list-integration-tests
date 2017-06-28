const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('..server')

const should = chai.should();

chai.use(chaiHttp);

describe('Recipes', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list recipes on GET', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        //this is still returning an array of objects, so it should be an array still.
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        const expectedKeys = ['name', 'ingredients'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  it('should add a recipe on POST', function() {
    const newRecipe = {name: 'popcorn', ingredients: ['corn', 'butter', 'anticipation']};
    return chai.request(app)
      .post('/recipes')
      .send(newRecipe)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a.('object');
        res.body.should.include.keys('name', 'ingredients');
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newRecipe, {id:res.body.id}));
      });
  });

  it('should update the recipe on PUT', function() {
    const updateRecipe = {
      name: 'milkshake',
      ingredients: ['yard', 'boys', 'better than yours']
    };

    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        updateRecipe.id = res.body[0].id;
        return chai.request(app)
          .put(`/recipes/${updateRecipe.id}`)
          .send(UpdateRecipe);
      })
      .then(function(res) {
        res.should.have.status.(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.deep.equal(updateRecipe)
      });
  });

  it('should delete recipes on DELETE', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});
