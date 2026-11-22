const { GraphQLEnumType } = require("graphql");

const GenreEnum = new GraphQLEnumType({
  name: "Genre",
  values: {
    PROGRAMMING: { value: "programming" },
    SCIENCE_FICTION: { value: "sci-fi" },
    FANTASY: { value: "fantasy" },
  },
});

module.exports = GenreEnum;
