const doc = $(document);
const generateButton = $('.generate-button');
const mainColorSquares = $('.main-color-squares');
const savePaletteBtn = $('.save-palette-button');
const saveProjectBtn = $('.save-project-button');
const documentWindow = $(window);
const select = $('.projects-select');
const hexCode = $('.main-color-squares h3');
const paletteNameInput = $('.generate-inputs input');
const projectNameInput = $('.new-project-container input');
const pastProjectContainer = $('.all-past-project-container');

const getRandomHex = () => {
  return (
    '#' +
    Math.random()
      .toString(16)
      .slice(-6)
  );
};

const setColors = () => {
  for (let index = 0; index < 5; index++) {
    const randomColor = getRandomHex();
    const image = $(`#square-${index} img`);

    if (image[0].className === 'open') {
      $(`#square-${index}`).css({
        backgroundColor: randomColor
      });
      $(`#square-${index} h3`).text(randomColor);
    }
  }
};

const getFromApi = async url => {
  try {
    const initialFetch = await fetch(url);

    return await initialFetch.json();
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
  }
};

const postToApi = async (url, data) => {
  try {
    const initialFetch = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return await initialFetch.json();
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
  }
};

const deleteFromApi = async url => {
  try {
    const initialFetch = await fetch(url, {
      method: 'DELETE'
    });

    return await initialFetch.json();
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
  }
};


const getProjects = async () => {
  const projects = await getFromApi('/api/v1/projects');
  
  projects.forEach(async project => {
    const { id, name } = project;
    const palettes = await getFromApi(`/api/v1/palettes/${id}`);
    const existingProject = $(`#project${id}`);
    
    if (!existingProject.length) {
      select.append($(`<option value="${id}">${name}</option>`));
      pastProjectContainer.append($(projectTemplate(name, id)));
      appendPalettes(palettes, id);
    } else {
      appendPalettes(palettes, id);
    }
  });
};

const projectTemplate = (name, id) => {
  return `
    <div class="past-project">
      <div class="h3-container">
      <h3>${name}</h3>
      </div>      
      <div class="past-project-square-container" id="project${id}">
      </div>
    </div>
  `;
};

const newProject = (name, id) => {
  select.append($(`<option value="${id}">${name}</option>`));

  pastProjectContainer.append($(projectTemplate(name, id)));
};

const appendPalettes = async (palettes, id) => {
  $(`#project${id}`).empty();

  palettes.forEach(palette => {
    const {
      id,
      palette_name,
      project_id,
      color_one,
      color_two,
      color_three,
      color_four,
      color_five
    } = palette;

    const paletteTemplate = (palette_name, buttonId, colors) => `
      <div class="square-cards">
        <h3>${palette_name}</h3>
        <div class="thumbnails">
          ${colors.reduce( 
            (accu, color) => (
              `${accu} <div class="past-palette-squares" style="background-color:${color}"></div>`
            ), '')
          }
        </div>
        <button class="delete-btn" id="${buttonId}">delete</button>
      </div>
    `;
    
    $(`#project${project_id}`).append(
      paletteTemplate(
        palette_name, 
        id,
        [color_one, color_two, color_three, color_four, color_five]
      )
    );
  });
};

//////////////////////////////
// event listeners
//////////////////////////////

documentWindow.on('load', getProjects);

documentWindow.on('load', setColors);

generateButton.on('click', () => {
  setColors();
});

doc.keydown(event => {
  const focused = document.activeElement.tagName === 'INPUT';
  if (event.which === 32 && !focused) {
    event.preventDefault();
    setColors();
  }
});

mainColorSquares.on('click', event => {
  event.preventDefault();
  const image = $(`#${event.target.id} img`);

  if (image[0].className === 'open') {
    image.attr('src', './assets/closed-padlock.svg');
    image.attr('alt', 'closed padlock');
    image.attr('class', 'closed');
  } else {
    image.attr('src', './assets/open-padlock.svg');
    image.attr('alt', 'open padlock');
    image.attr('class', 'open');
  }
});

savePaletteBtn.on('click', event => {
  event.preventDefault();
  const hexArray = hexCode.text().match(/.{7}/g);
  const paletteName = paletteNameInput.val();
  const id = select.val();
  const hexObject = {
    project_id: id,
    palette_name: paletteName,
    color_one: hexArray[0],
    color_two: hexArray[1],
    color_three: hexArray[2],
    color_four: hexArray[3],
    color_five: hexArray[4]
  };

  if (paletteName) {
    postToApi('/api/v1/palettes', hexObject);
    getProjects();
    paletteNameInput.val('');
  } else {
    alert('Please enter a palette name');
  }
});

saveProjectBtn.on('click', async event => {
  event.preventDefault();
  const projectName = {
    name: projectNameInput.val()
  };

  if (projectName) {
    const post = await postToApi('/api/v1/projects', projectName);
    const { id } = post;
    const { name } = projectName;

    newProject(name, id);
    projectNameInput.val('');
  } else {
    alert('Please eneter a project name');
  }
});

pastProjectContainer.on('click', '.delete-btn', event => {
  event.preventDefault();
  const id = event.target.id;
  deleteFromApi(`/api/v1/palettes/${id}`);
  getProjects();
});
