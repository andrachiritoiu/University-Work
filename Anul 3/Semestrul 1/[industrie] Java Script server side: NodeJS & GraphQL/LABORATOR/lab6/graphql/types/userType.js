import * as graphql from 'graphql';

const userType = new graphql.GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
        name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
    }
});

export default userType;