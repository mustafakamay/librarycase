const BorrowedBook = require("../models/borrowedbook");
const ReturnedBook = require("../models/returnedbook");
const Book = require("../models/book");
const User = require("../models/user");


const createRelations = async () => {
    await User.hasMany(BorrowedBook, { foreignKey: "user_id" });
    await User.hasMany(ReturnedBook, { foreignKey: "user_id" });
    await ReturnedBook.hasOne(Book, { foreignKey: "id", sourceKey: "book_id" });
    await BorrowedBook.hasOne(Book, { foreignKey: "id", sourceKey: "book_id" });
};

module.exports = createRelations;