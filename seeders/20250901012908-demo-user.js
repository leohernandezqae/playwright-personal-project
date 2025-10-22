'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      cpf: "33750650004",
      firstName: "Usuario",
      lastName: "Teste",
      birthDate: new Date("1990-05-20"),
      occupation: "Software Engineer",
      salary: 12000.50,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};