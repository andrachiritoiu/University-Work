const { GraphQLInputObjectType, GraphQLInt } = require("graphql");
const GenreEnum = require("../enums/genre");

const BookFilterInput = new GraphQLInputObjectType({
  name: "BookFilterInput",
  fields: {
    genre: { type: GenreEnum },
    publishedAfter: { type: GraphQLInt },
  },
});

module.exports = BookFilterInput;
