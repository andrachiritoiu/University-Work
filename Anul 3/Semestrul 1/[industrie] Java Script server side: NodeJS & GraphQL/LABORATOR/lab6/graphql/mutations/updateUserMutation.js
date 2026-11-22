import * as graphql from 'graphql';
import userInputType from '../types/userInputType.js';
import {findEntity, updateEntity} from '../../fakeDb.js';
import userType from '../types/userType.js';

const updateUserMutationResolver = (_, args) => {
    const user = findEntity("users", args.id);

    if(!user){
        return null;
    }
    else{
        updateEntity("users", args.id, args.user);

        //ca sa returneze obj actualizat
        return findEntity("users", args.id);
    }
}

const updateUserMutation = {
    type: userType,
    args: { 
        id: {type: new graphql.GraphQLNonNull(graphql.GraphQLInt)},
        user: { type: new graphql.GraphQLNonNull(userInputType)} 
    },
    resolve: updateUserMutationResolver
};

export default updateUserMutation;