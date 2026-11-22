import * as graphql from 'graphql';

const userInputType = new graphql.GraphQLInputObjectType({
    name: "UserInput",
    fields:{
        name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString)}
    }
});

export default userInputType;