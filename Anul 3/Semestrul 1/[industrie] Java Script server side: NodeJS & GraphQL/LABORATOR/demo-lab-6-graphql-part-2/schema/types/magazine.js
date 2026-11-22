const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} = require("graphql");

const PublicationInterface = require("../interfaces/publication");

const MagazineType = new GraphQLObjectType({
  name: "Magazine",
  interfaces: [PublicationInterface],
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    year: { type: GraphQLInt },
    issue: { type: GraphQLInt },
  },
});

module.exports = MagazineType;
