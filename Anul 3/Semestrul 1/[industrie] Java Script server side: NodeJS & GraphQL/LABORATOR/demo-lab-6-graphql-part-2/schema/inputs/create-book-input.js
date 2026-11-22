const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
} = require("graphql");
const GenreEnum = require("../enums/genre");

const CreateBookInput = new GraphQLInputObjectType({
  name: "CreateBookInput",
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLID) },
    year: { type: GraphQLInt },
    genre: { type: new GraphQLNonNull(GenreEnum) },
  },
});

module.exports = CreateBookInput;
