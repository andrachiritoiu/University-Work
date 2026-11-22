import * as graphql from 'graphql';
import {deleteEntity, findEntity} from '../../fakeDb.js';

const deleteUserResolver = (_, args) => {
    const user = findEntity("users", args.id);

    if(user){
        deleteEntity("users", args.id);

        return true;
    }

    return null;

}

const deleteUserMutation = {
    type:  graphql.GraphQLBoolean,
    args: {id: {type: new graphql.GraphQLNonNull(graphql.GraphQLInt)}},
    resolve: deleteUserResolver
};

export default deleteUserMutation;