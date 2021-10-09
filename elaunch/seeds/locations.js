exports.seed = async function (knex) {
  // Deletes ALL existing entries
  return knex('locations').truncate()
    .then(async function () {
      // Inserts seed entries
      return knex('locations').insert([
        { country: 'india', state: 'gujrat' },
        { country: 'india', state: 'maharastr' },
        { country: 'india', state: 'rajsthan' },
        { country: 'india', state: 'MP' },
        { country: 'india', state: 'UP' }
      ]);
    });
};