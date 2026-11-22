// A very simple "database" that lives in memory.
// Everything is reset when the server restarts.

const users = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
  { id: 2, username: "student", password: "student123", role: "student" },
];

const books = [
  {
    id: 1,
    title: "The Pragmatic Programmer",
    authorId: 1,
    year: 1999,
    genre: "programming",
  },
  { id: 2, title: "Clean Code", authorId: 2, year: 2008, genre: "programming" },
  {
    id: 3,
    title: "You Don't Know JS",
    authorId: 3,
    year: 2014,
    genre: "programming",
  },
  { id: 4, title: "Dune", authorId: 4, year: 1965, genre: "sci-fi" },
  { id: 5, title: "The Hobbit", authorId: 5, year: 1937, genre: "fantasy" },
];

const magazines = [
  { id: 1, title: "National Geographic", year: 2024, issue: 245 },
  { id: 2, title: "Wired", year: 2025, issue: 33 },
];

const authors = [
  { id: 1, name: "Andrew Hunt", country: "USA" },
  { id: 2, name: "Robert C. Martin", country: "USA" },
  { id: 3, name: "Kyle Simpson", country: "USA" },
  { id: 4, name: "Frank Herbert", country: "USA" },
  { id: 5, name: "J.R.R. Tolkien", country: "UK" },
];

// Used to generate ids for new books
let nextBookId = 6;

function getNextBookId() {
  return nextBookId++;
}

function findAuthor(id) {
  return authors.find((author) => author.id === Number(id));
}

module.exports = {
  users,
  books,
  getNextBookId,
  findAuthor,
  authors,
  magazines,
};
