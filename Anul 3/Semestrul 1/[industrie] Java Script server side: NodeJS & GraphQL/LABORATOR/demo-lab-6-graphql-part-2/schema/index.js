const { GraphQLSchema } = require("graphql");
const QueryType = require("./query");
const MutationType = require("./mutation");
const MagazineType = require("./types/magazine");

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  types: [MagazineType],
});
