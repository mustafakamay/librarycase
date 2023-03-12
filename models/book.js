const Sequelize = require("sequelize");
const sequelize = require("../database/db");

const Book = sequelize.define(
    "Book",
    {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        score: {
            type: Sequelize.FLOAT,
            defaultValue: -1
        }
    },
    { timestamps: false }
);

module.exports = Book;