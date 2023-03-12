const express = require("express");
const router = express.Router();
const User = require("../models/user");
const BorrowedBook = require("../models/borrowedbook");
const ReturnedBook = require("../models/returnedbook");
const Book = require("../models/book");
const { Op } = require("sequelize");
const { check, validationResult } = require("express-validator");


router.get("/", (req, res) => {
    User.findAll({ attributes: ["id", "name"] })
        .then((users) => {

            if (!users) {
                return res.status(404).json({ error: "No users exist" });
            }
            res.status(200).json(users);
        })
        .catch((err) => res.status(500).json({ error: err }));
});


router.get("/:userId", (req, res) => {
    const userId = req.params.userId;

    User.findAll({
        where: { id: userId },
        include: [
            {
                model: BorrowedBook,
                include: [{ model: Book, attributes: ["name"] }]
            },
            {
                model: ReturnedBook,
                include: [{ model: Book, attributes: ["name", "score"] }]
            }
        ]
    })
        .then((userData) => {
            if (!userData) {
                return res.status(404).json({
                    error: "User doesn't exist"
                });
            }

            const borrowedBooksArray = userData[0].Borrowed_Books.map(
                (current) => {
                    return {
                        name: current.Book.name
                    };
                }
            );

            const returnedBooksArray = userData[0].Returned_Books.map(
                (current) => {
                    return {
                        name: current.Book.name,
                        userScore: current.score
                    };
                }
            );

            res.status(200).json({
                id: userData[0].id,
                name: userData[0].name,
                past: returnedBooksArray,
                present: borrowedBooksArray
            });
        })
        .catch((err) =>
            res.status(500).json({ error: err, msg: "User doesn't exist" })
        );
});



router.post(
    "/",

    [check("name", "Name must be a string").isString()],
    async (req, res) => {

        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(400).json({ errors: validationErrors.array() });
        }

        const name = req.body.name;
        try {
            await User.create({ name });
            res.status(201).json({message : 'User created successfully'});
        } catch (error) {
            res.status(500).json({ error });
        }
    }
);



router.post("/:userId/borrow/:bookId", async (req, res) => {
    const { userId, bookId } = req.params;

    try {

        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }


        const book = await Book.findOne({ where: { id: bookId } });
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }


        const borrowedBook = await BorrowedBook.findOne({
            where: { book_id: bookId }
        });
        if (borrowedBook) {
            return res.status(409).json({
                error:
                    "This book is already borrowed by someone else, please try borrowing it later"
            });
        }


        await BorrowedBook.create({ user_id: userId, book_id: bookId });

        res.status(201).json({message : "Book has been borrowed"});
    } catch (error) {
        res.status(500).json({ error });
    }
});


router.post(
    "/:userId/return/:bookId",

    [check("score", "Score must be in float type").isFloat()],
    async (req, res) => {

        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(400).json({ errors: validationErrors.array() });
        }

        const { userId, bookId } = req.params;
        const score = req.body.score;

        try {

            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ error: "User doesn't exist" });
            }


            const book = await Book.findOne({ where: { id: bookId } });
            if (!book) {
                return res.status(404).json({ error: "Book doesn't exist" });
            }


            const borrowedBook = await BorrowedBook.findOne({
                where: { [Op.and]: [{ book_id: bookId }, { user_id: userId }] }
            });

            if (!borrowedBook) {
                return res.status(404).json({
                    error:
                        "This book is already returned or never borrowed by you."
                });
            }


            await BorrowedBook.destroy({
                where: {
                    [Op.and]: [{ book_id: bookId }, { user_id: userId }]
                }
            });


            await ReturnedBook.create({
                user_id: userId,
                book_id: bookId,
                score
            });


            const bookReturns = await ReturnedBook.findAll({
                where: { book_id: bookId }
            });


            let totalScore = 0;
            bookReturns.forEach((current) => {
                totalScore += current.score;
            });

            const averageScore = totalScore / bookReturns.length;


            await Book.update(
                { score: averageScore },
                { where: { id: bookId } }
            );

            res.sendStatus(204);
        } catch (error) {
            res.status(500).json({ error });
        }
    }
);

module.exports = router;