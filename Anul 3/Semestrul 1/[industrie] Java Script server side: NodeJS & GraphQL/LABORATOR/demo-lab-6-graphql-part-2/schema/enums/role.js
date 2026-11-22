const { GraphQLEnumType } = require("graphql");

const RoleEnum = new GraphQLEnumType({
  name: "Role",
  values: {
    ADMIN: { value: "admin" },
    STUDENT: { value: "student" },
  },
});

module.exports = RoleEnum;
