const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} = require("graphql");

const { books } = require("../../db");

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => {
    const BookType = require("./book");

    return {
      id: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      country: { type: GraphQLString },
      books: {
        type: new GraphQLList(BookType),
        resolve: (author) =>
          books.filter((book) => book.authorId === author.id),
      },
    };
  },
});

module.exports = AuthorType;
