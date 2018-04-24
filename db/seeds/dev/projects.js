exports.seed = function(knex, Promise) {
  return knex('palettes')
    .del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects')
          .insert(
            {
              name: 'first project'
            },
            'id'
          )
          .then(project => {
            return knex('palettes').insert([
              {
                project_id: project[0],
                palette_name: 'palette one',
                color_one: '#848f5b',
                color_two: '#21fe01',
                color_three: '#76789c',
                color_four: '#6c63d3',
                color_five: '#f0f759'
              },
              {
                project_id: project[0],
                palette_name: 'green field',
                color_one: '#5a7303',
                color_two: '#42d067',
                color_three: '#14f4ba',
                color_four: '#069032',
                color_five: '#1be4f2'
              }
            ]);
          })
          .catch(error => console.log(`Error seeding data: ${error}`))
      ]);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
