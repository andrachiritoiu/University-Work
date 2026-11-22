const {
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} = require("graphql");

const PublicationInterface = new GraphQLInterfaceType({
  name: "Publication",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    year: { type: GraphQLInt },
  },
  resolveType: (publication) => ("issue" in publication ? "Magazine" : "Book"),
});

module.exports = PublicationInterface;
