const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const requireHTTPS = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
};

if (process.env.NODE_ENV === 'production') {
  app.use(requireHTTPS);
}

app.set('port', process.env.PORT || 3000);

app.enable('trust proxy');

app.use(bodyParser.json());

app.use(express.static('public'));

app.locals.title = 'Palette Picker';

app.get('/api/v1/projects', (request, response) => {
  database('projects')
    .select()
    .then(projects => {
      if (projects.length) {
        response.status(200).json(projects);
      } else {
        response.status(404).json({
          error: 'projects not found'
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id', (request, response) => {
  database('projects')
    .where('id', request.params.id)
    .select()
    .then(project => {
      if (project.length) {
        response.status(200).json(project);
      } else {
        response.status(404).json({
          error: `Could not find project with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes/:id', (request, response) => {
  database('palettes')
    .where('project_id', request.params.id)
    .select()
    .then(palette => {
      if (palette.length) {
        response.status(200).json(palette);
      } else {
        response.status(404).json({
          error: `Could not find palette with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;

  for (let requiredParameter of ['palette_name']) {
    if (!palette[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { palette_name: <String> }.
        You're missing a "${requiredParameter}" property`
      });
    }
  }

  database('palettes')
    .insert(palette, 'id')
    .then(palette => {
      response.status(201).json({ id: palette[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { name: <String> }. 
        You're missing a "${requiredParameter}" property.`
      });
    }
  }

  database('projects')
    .insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  database('palettes')
    .where('id', request.params.id)
    .select()
    .del()
    .then(palette => {
      if (palette) {
        response.status(200).json(request.body);
      } else {
        return response.status(422).send({
          error: 'No paletteId property provided'
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  // eslint-disable-next-line
  console.log(
    `${app.locals.title} sever is running on port ${app.get('port')}.`
  );
});

module.exports = app;
