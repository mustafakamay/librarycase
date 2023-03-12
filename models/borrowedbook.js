const Sequelize = require("sequelize");
const sequelize = require("../database/db");

const BorrowedBook = sequelize.define(
    "Borrowed_Book",
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
        }
    },
    { timestamps: false }
);

module.exports = BorrowedBook;