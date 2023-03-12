const Sequelize = require("sequelize");
const sequelize = require("../database/db");

const ReturnedBook = sequelize.define(
    "Returned_Book",
    {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id"
            }
        },
        book_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "Books",
                key: "id"
            }
        },
        score: Sequelize.FLOAT
    },
    { timestamps: false }
);

module.exports = ReturnedBook;