import * as graphql from 'graphql';
import userType from '../types/userType.js';
import {findEntity} from '../../fakeDb.js';

const userQueryResolver = (_, { id }) => {
    // return users.find((user) => user.id === id);
    return findEntity("users", id);
}

const userQuery = ({
    type: userType,
    args: { id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) }
 },
    resolve: userQueryResolver
});

export default userQuery;