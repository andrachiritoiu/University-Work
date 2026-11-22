import { GraphQLObjectType } from 'graphql';
import createUserMutation from '../mutations/createUserMutation.js';
import updateUserMutation from '../mutations/updateUserMutation.js';
import deleteUserMutation from '../mutations/deleteUserMutation.js';

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: createUserMutation,
        updateUser: updateUserMutation,
        deleteUser: deleteUserMutation,
    },
});

export default mutationType;
