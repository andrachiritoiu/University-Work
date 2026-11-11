const {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = require("graphql");

const { books } = require("./db");
const { users } = require("./db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./middleware/auth");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    author: { type: GraphQLString },
    year: { type: new GraphQLNonNull(GraphQLInt) },
    summary: {
      type: GraphQLString,
      resolve: (book) => `${book.title} by ${book.author}`,
    },
  },
});

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    books: {
      type: new GraphQLList(BookType),
      resolve: () => books,
    },
    book: {
      type: BookType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_, args) => books.find((book) => book.id === args.id),
    },
    me: {
      type: UserType,
      resolve: (_, __, context) => {
        if (!context.user) {
          return null;
        }

        return users.find((user) => user.id === context.user.userId) || null;
      },
    },
  },
});

//mutations
const MutationType = new GraphQLObjectType({
  name: "Mutation",
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
            user.username === args.username && user.password === args.password,
        );
        if (user) {
          return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
        }
        return null;
      }
    },
    createBook: {
      type: BookType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLString) },
        year: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (_, args, context) => {
        requireUser(context);

        const newBook = {
          id: getNextBookId(),
          title: args.title,
          author: args.author,
          year: args.year,
        };
        books.push(newBook);
        return newBook;
      },
    },
  },
});

function requireUser(context) {
  if (!context.user) {
    throw new Error("Authentication required");
  }
}

function getNextBookId() {
  return String(
    books.reduce((maxId, book) => Math.max(maxId, Number(book.id)), 0) + 1,
  );
}

module.exports = {
  schema: new GraphQLSchema({ query: QueryType, mutation: MutationType }),
};