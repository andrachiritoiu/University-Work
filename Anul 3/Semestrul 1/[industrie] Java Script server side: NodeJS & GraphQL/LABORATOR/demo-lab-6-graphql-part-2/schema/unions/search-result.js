const { GraphQLUnionType } = require("graphql");
const BookType = require("../types/book");
const AuthorType = require("../types/author");

// A union means "one of these types". Unlike an interface, the types don't
// have to share any fields: a search result is either a Book or an Author.
const SearchResultUnion = new GraphQLUnionType({
  name: "SearchResult",
  types: [BookType, AuthorType],
  resolveType: (result) => ("name" in result ? "Author" : "Book"),
});

module.exports = SearchResultUnion;
