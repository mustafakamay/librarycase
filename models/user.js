const Sequelize = require("sequelize");
const sequelize = require("../database/db");


const User = sequelize.define(
    "User",
    {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
    { timestamps: false }
);

module.exports = User;