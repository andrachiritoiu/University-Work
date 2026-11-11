const express = require("express");
const { books, getNextBookId } = require("../db");
const {authMiddleware} = require("../middleware/authMiddleware");
const router = express.Router();


// GET /books - get all books
router.get("/", (req,res) => {
    res.json(books);
});

//GET /books/:id - get one book
router.get("/:id", (req,res) => {
    const id = Number(req.params.id);
    const book = books.find((book) => book.id === id)

    if(!book){
        return res.status(404).json({error: "Book not found"});
    }

    res.json(books);
});

// router.get("/", (req,res) => {
//     const {title, author, year} = req.body || {};

//     if(!title || !author){
//         return res.status(400).json({error: "Title not found"});
//     }

//     const newBook = {id: getNextBookId(), title, author, year};
//     books.push(newBook);

//     res.status(201).json(newBook);
// });

router.post("/", authMiddleware, (req,res) => {
    const {title, author, year} = req.body || {};

    if(!title || !author){
        return res.status(400).json({error: "Title not found"});
    }

    const newBook = {id: getNextBookId(), title, author, year};
    books.push(newBook);

    res.status(201).json(newBook);
});


// PATCH /books/:id - modify a book
router.patch("/:id", authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((book) => book.id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found!" });
  }

  const { title, author, year } = req.body || {};

  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (year !== undefined) book.year = year;

  res.json(book);
});

// DELETE /books/:id - delete a book by id
router.delete("/:id", authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Book not found!" });
  }

  const [deleted] = books.splice(index, 1);
  res.json(deleted);
});


module.exports = router;