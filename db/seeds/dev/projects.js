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
                palette_name: 'pallet one',
                color_one: '#848f5b',
                color_two: '#21fe01',
                color_three: '#76789c',
                color_four: '#6c63d3',
                color_five: '#f0f759'
              },
              {
                project_id: project[0],
                palette_name: 'pallet two',
                color_one: '#847f5c',
                color_two: '#51fe21',
                color_three: '#96285c',
                color_four: '#1c66d3',
                color_five: '#f2f621'
              }
            ]);
          })
          .catch(error => console.log(`Error seeding data: ${error}`))
      ]);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
