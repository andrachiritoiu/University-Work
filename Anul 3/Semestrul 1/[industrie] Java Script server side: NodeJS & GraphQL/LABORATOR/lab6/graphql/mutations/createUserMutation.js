import * as graphql from 'graphql';
import userInputType from '../types/userInputType.js';
import {createEntity} from '../../fakeDb.js';
import userType from '../types/userType.js';

const createUserMutationResolver = (_, args) => {
    createEntity("users", args.user)
    return true;
}

const createUserMutation = {
    type: graphql.GraphQLBoolean,
    args: { user: { type: new graphql.GraphQLNonNull(userInputType) } },
    resolve: createUserMutationResolver
};

export default createUserMutation;