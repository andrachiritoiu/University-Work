const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
  GraphQLString,
} = require("graphql");
const { books, authors, magazines } = require("../db");
const { requireUser } = require("../middleware/auth");

const BookType = require("./types/book");
const AuthorType = require("./types/author");
const UserType = require("./types/user");
const BookFilterInput = require("./inputs/book-filter-input");
const PublicationInterface = require("./interfaces/publication");
const SearchResultUnion = require("./unions/search-result");

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    books: {
      type: new GraphQLList(BookType),
      args: { filter: { type: BookFilterInput } },
      resolve: (parent, args) => {
        let result = books;
        if (args.filter?.genre) {
          result = result.filter((book) => book.genre === args.filter.genre);
        }
        if (args.filter?.publishedAfter) {
          result = result.filter(
            (book) => book.year > args.filter.publishedAfter,
          );
        }
        return result;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: () => authors,
    },
    publication: {
      type: new GraphQLList(PublicationInterface),
      resolve: () => [...books, ...magazines],
    },
    // Returns a mix of books and authors, typed by the union
    search: {
      type: new GraphQLList(SearchResultUnion),
      args: { term: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (parent, args) => {
        const term = args.term.toLowerCase();
        return [
          ...books.filter((book) => book.title.toLowerCase().includes(term)),
          ...authors.filter((author) =>
            author.name.toLowerCase().includes(term),
          ),
        ];
      },
    },
    book: {
      type: BookType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: (parent, args) =>
        books.find((book) => book.id === Number(args.id)),
    },
    me: {
      type: UserType,
      resolve: (parent, args, context) => requireUser(context),
    },
  },
});

module.exports = QueryType;
