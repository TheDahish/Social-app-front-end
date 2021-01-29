import gql from "graphql-tag";

export const FETCH_POST_QUERY = gql`
  {
    getPosts {
      _id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        _id
        username
        createdAt
        body
      }
    }
  }
`;
