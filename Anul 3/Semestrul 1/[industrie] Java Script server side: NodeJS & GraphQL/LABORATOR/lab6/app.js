import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { GraphQLSchema } from 'graphql';
import queryType from './graphql/rootTypes/queryType.js'
import mutationType from './graphql/rootTypes/mutationType.js'

const schema = new GraphQLSchema({ query: queryType, mutation: mutationType })

const app = express()
app.all(
    "/graphql",
    createHandler({
        schema: schema,
    })
)

export default app;