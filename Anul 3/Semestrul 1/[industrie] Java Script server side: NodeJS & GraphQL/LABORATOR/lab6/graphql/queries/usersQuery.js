import * as graphql from 'graphql';
import userType from '../types/userType.js';
import { listEntities } from '../../fakeDb.js';

const usersQueryResolver = (_, { id }) => {
    return listEntities("users");
}

const usersQuery = {
    type: new graphql.GraphQLList(userType),
    resolve: usersQueryResolver,

};

export default usersQuery;