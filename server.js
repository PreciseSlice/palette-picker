const express = require('express'); // bringing in the express library and assigining it to a variable
const app = express(); // assiging app to express so that when we refernce app we get access to express methods. app is the server itself in the express library
const bodyParser = require('body-parser'); // bringing in body parser and assiging it to a variable
const environment = process.env.NODE_ENV || 'development'; // declaring the enviroment is the vaule of the what is declared in the terminal when the server is started or 'development' if none is specified.
const configuration = require('./knexfile')[environment]; // assigning the value of ./knexfile under the key of enviroment to configuration
const database = require('knex')(configuration); // assiging the database specified in the knex file under the enviroment key to the string of database.

app.set('port', process.env.PORT || 3000); // setting the port of our server to the eviroment we are working in's port or 3000 if the enviroment does not specify 
app.locals.title = 'Palette Picker'; // assiging the string of 'Palette Picker' to app.locals under the key of title.  app .local is a form of local state
app.use(bodyParser.json()); // instructing our server to use the bodyParser middleware for all http request. specifictly the json formatter of the package.
app.use(express.static('public')); // instructing the server to server the index.html page if the / endpoint is requested
app.listen(app.get('port'), () => { // instructing app listen to the port specified above.   
  console.log(
    `${app.locals.title} sever is running on port ${app.get('port')}.`// when the port becomes active log the string of sever is running on the port
  );
});

app.get('/api/v1/projects/', (request, response) => { // app.get is express's verb for route handling within this block we will specifiy what to do when that route recives an http request also passing request and reponce into the function  
  database('projects') // pointing to the database of 'projects' psql 
    .select() // select the project we just pointed to above
    .then(projects => { // once the code above resolves its promise we ae calling that promise projects
      if (projects.length) { // if the responce has length
        response.status(200).json(projects); // send a http reply with a status of 200 and in the body place the data in a json format
      } else { // otherwise if the responce does not have length 
        response.status(404).json({ // send back an http responce of 404 
          error: 'projects not found' // send back the error key with a value of 'project not found'
        });
      }
    })    
    .catch(error => { // catch any errors
      response.status(500).json({ error }); // if errors are caught send a 500 and the error message 
    });
});

app.get('/api/v1/projects/:id', (request, response) => { // handle the dynamic route of '/api/v1/projects/:id' in the block below
  database('projects') // look to the psql database of projects 
    .where('id', request.params.id) // within the database we just pointed to find items whose id matches the id in the http string 
    .select() // select those that match the paramneters above
    .then(project => { // once the promise resolves we are calling that promise project
      if (project.length) { // if project has length 
        response.status(200).json(project); // send a http reply with a status of 200 and in the body place the data in a json format
      } else { // otherwise if the responce does not have length 
        response.status(404).json({ // send back an http responce of 404 
          error: `Could not find project with id ${request.params.id}` // send back the error key with a value of 'could not find project with id that was sent to the server'
        });
      }
    })
    .catch(error => { // if some other error occurs 
      response.status(500).json({ error }); // respond with a 500 and send the eror message to the server
    });
});

app.get('/api/v1/palettes/:id', (request, response) => { // handle the dynamic route of '/api/v1/palettes/:id' in the block below
  database('palettes') // look to the psql database of palettes 
    .where('project_id', request.params.id) // within the database we just pointed to find items whose key of project_id matches the id in the http string 
    .select() // select those that match the parameters specified above
    .then(palette => { // once the promise resolves we are calling that promise palette
      if (palette.length) { // if palette has length
        response.status(200).json(palette); // send a http reply with a status of 200 and in the body place the data in a json format
      } else { // otherwise if the responce does not have length 
        response.status(404).json({ // send back an http responce of 404 
          error: `Could not find palette with id ${request.params.id}` // send back the error key with a value of 'could not find project with id that was sent to the server'
        });
      }
    })
    .catch(error => { // catch any errors
      response.status(500).json({ error }); // if errors are caught send a 500 and the error message 
    });
});

app.post('/api/v1/palettes/', (request, response) => { // handle the route of '/api/v1/palettes/:id' in the block below
  const palette = request.body; // assiging the value of the the request recieved's body to palette

  for (let requiredParameter of ['palette_name']) { // loop through an iteratible object and look for 'palette_name'
    if (!palette[requiredParameter]) { // if the required parameter is not found in the palette
      return response.status(422).send({ // send an http responce code of 422
        error: `Expected format: { palette_name: <String> }.
                You're missing a "${requiredParameter}" property`
      }); // in the responce body rely with the template above 
    }
  }

  database('palettes') // look to the psql database of palettes
    .insert(palette, 'id') // add the palette to the database and pass in the id which the server will use to incriment and assign an id
    .then(palette => { // once the promise above resolves we will call it palette
      response.status(201).json({ id: palette[0] }); // send 201 back with the item we just placed in the database 
    })
    .catch(error => { // catch any errors
      response.status(500).json({ error }); // if errors are caught send a 500 and the error message 
    });
});

app.post('/api/v1/projects/', (request, response) => { // handle the route of '/api/v1/projects/' in the block below
  const project = request.body; // assiging the value of the the request recieved's body to project

  for (let requiredParameter of ['name']) { // loop through an iteratible object and look for 'name'
    if (!project[requiredParameter]) { // if the required parameter is not found in the project
      return response.status(422).send({ // send an http responce code of 422
        error: `Expected format: { name: <String> }. 
                You're missing a "${requiredParameter}" property.`
      }); // in the responce body rely with the template above 
    }
  }

  database('projects') // look to the psql database of projects
    .insert(project, 'id') // add the project to the database and pass in the id which the server will use to incriment and assign an id
    .then(project => { // once the promise above resolves we will call it palette
      response.status(201).json({ id: project[0] }); // send 201 back with the item we just placed in the database 
    })
    .catch(error => { // catch any other errors
      response.status(500).json({ error }); // if errors are caught send a 500 and the error message 
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => { // handle the dynamic route of '/api/v1/palettes/:id' in the block below
  database('palettes') // look to the psql database of palettes
    .where('id', request.params.id) // whithin the database specified above find items whose id matches the id in the http string  
    .select() // select those that match the parameters specified above  
    .del() // delete the selected items from the database
    .then(palette => { // when that pomise resolves we are calling that palette
      if (palette) { // if the promise exist 
        response.status(202).json(request.body); //send a status of 202 and the item sent
      } else { // if it promise does not exist 
        return response.status(422).send({ // send an http responce code of 422
          error: 'No paletteId property provided' // send an error of the string 'No paletteId property provided'
        });
      }
    })
    .catch(error => { // catch any errors
      response.status(500).json({ error }); // if errors are caught send a 500 and the error message 
    });
});
