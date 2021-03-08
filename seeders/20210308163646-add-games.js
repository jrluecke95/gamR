const { fake } = require('faker');
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let games = [];
    for (let i = 0; i < 10; i++) {
      const game = {
        name: faker.random.word(),
        platform: faker.random.arrayElement(['PC', 'Ps5', 'Xbox']),
        genre: faker.music.genre(),
        releaseDate: faker.date.past(),
        difficulty: faker.random.number({min: 1, max: 10}),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      games.push(game)
    }
    

    await queryInterface.bulkInsert('Games', [
    {
      name: 'GTA',
      platform: 'PC', 
      genre: 'violence',
      releaseDate: '1997-10-21',
      difficulty: '7',
      createdAt: '2020-03-08',
      updatedAt: '2020-03-08' //coudl use new Date()
    },
    ...games
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
