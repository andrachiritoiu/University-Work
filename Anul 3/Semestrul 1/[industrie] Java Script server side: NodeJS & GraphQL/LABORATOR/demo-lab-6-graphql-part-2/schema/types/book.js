const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} = require("graphql");

const AuthorType = require("./author");
const { findAuthor } = require("../../db");
const GenreEnum = require("../enums/genre");
const PublicationInterface = require("../interfaces/publication");

const BookType = new GraphQLObjectType({
  name: "Book",
  interfaces: [PublicationInterface],
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLID) },
    author: {
      type: new GraphQLNonNull(AuthorType),
      resolve: (book) => findAuthor(book.authorId),
    },
    year: { type: GraphQLInt },
    genre: { type: GenreEnum },
    summary: {
      type: GraphQLString,
      resolve: (book) => `${book.title} by ${findAuthor(book.authorId).name}`,
    },
  },
});

module.exports = BookType;
