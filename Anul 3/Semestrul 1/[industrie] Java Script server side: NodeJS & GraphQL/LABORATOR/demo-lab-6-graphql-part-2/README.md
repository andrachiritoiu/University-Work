# GraphQL Lab – Books API

## Run

```bash
npm install
npm run dev
```

Endpoint: `http://localhost:3000/graphql` (send `POST` requests with Postman or any GraphQL client).

## Test users

| username | password   |
|----------|------------|
| admin    | admin123   |
| student  | student123 |

## Examples

```graphql
query {
  books { id title year genre author { name } }
}
```

```graphql
mutation {
  login(username: "student", password: "student123")
}
```

Protected operations (`me`, `createBook`) need the token from `login` in a header:

```
Authorization: Bearer <token>
```

```graphql
mutation {
  createBook(input: { title: "The Clean Coder", authorId: 2, genre: PROGRAMMING }) { id title }
}
```

Data is kept in memory and resets when the server restarts.
