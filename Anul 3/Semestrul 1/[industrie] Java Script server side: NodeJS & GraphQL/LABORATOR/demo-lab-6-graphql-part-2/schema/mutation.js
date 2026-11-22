const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLError,
} = require("graphql");
const jwt = require("jsonwebtoken");
const { books, users, getNextBookId, findAuthor } = require("../db");
const { JWT_SECRET, requireUser } = require("../middleware/auth");
const BookType = require("./types/book");
const CreateBookInput = require("./inputs/create-book-input");

const MutationType = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    login: {
      type: GraphQLString,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, args) => {
        const user = users.find(
          (user) =>
            user.password === args.password && user.username === args.username,
        );

        if (!user) {
          throw new GraphQLError("Invalid username or password!");
        }

        return jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          JWT_SECRET,
          {
            expiresIn: "1h",
          },
        );
      },
    },
    createBook: {
      type: BookType,
      args: { input: { type: new GraphQLNonNull(CreateBookInput) } },
      resolve: (parent, args, context) => {
        requireUser(context);

        const { title, authorId, year, genre } = args.input;

        if (!findAuthor(authorId)) {
          throw new GraphQLError(`Author with id ${authorId} does not exist!`);
        }

        const newBook = {
          id: getNextBookId(),
          title,
          authorId: Number(authorId),
          year,
          genre,
        };
        books.push(newBook);
        return newBook;
      },
    },
  },
});

module.exports = MutationType;
