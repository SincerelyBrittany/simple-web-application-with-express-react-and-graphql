import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import gql from "graphql-tag";
import {
  buildASTSchema,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const POSTS = [
  { author: "John Doe", body: "Hello world" },
  { author: "Jane Doe", body: "Hi, planet!" },
  { author: "Jane Doe", body: "Hi, planet!" },
  { author: "Jane Doe", body: "Hi, planet!" },
];

const schema = buildASTSchema(gql`
  type Query {
    posts: [Post]
    post(id: ID!): Post
  }

  type Post {
    id: ID
    author: String
    body: String
  }

  type Mutation {
    submitPost(input: PostInput!): Post
  }

  input PostInput {
    id: ID
    author: String!
    body: String!
  }
`);

const mapPost = (post, id) => post && { id, ...post };

const root = {
  posts: () => POSTS.map(mapPost),
  post: ({ id }) => mapPost(POSTS[id], id),
  submitPost: ({ input: { id, author, body } }) => {
    const post = { author, body };
    console.log(post, "this is post");
    let index = POSTS.length;

    if (id != null && id >= 0 && id < POSTS.length) {
      if (POSTS[id].authorId !== authorId) return null;

      POSTS.splice(id, 1, post);
      index = id;
    } else {
      POSTS.push(post);
    }

    return mapPost(post, index);
  },
};

const app = express();
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

const port = process.env.PORT || 4000;
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
