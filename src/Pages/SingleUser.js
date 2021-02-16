import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import { Container, Grid, Icon, Transition } from "semantic-ui-react";

import PostCard from "../Components/PostCard";
import UserCard from "../Components/UserCard";

export default function SingleUser(props) {
  const userID = props.match.params.userID;
  const { name, username, id, createdAt } = props.location.state;

  const { loading, data } = useQuery(FETCH_USER_POSTS, {
    variables: {
      userID,
    },
  });

  var posts = [];
  if (data) {
    posts = data.getUserPosts;
    //  console.log(posts);
  }

  return (
    <div>
      <Icon
        link
        size="big"
        color="teal"
        name="arrow alternate circle left outline"
        onClick={() => props.history.push("/users")}
      />
      <Container>
        {posts && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <UserCard
              name={name}
              username={username}
              id={id}
              createdAt={createdAt}
              posts={posts}
            />
          </div>
        )}
        <Grid columns={3}>
          <Grid.Row className="title">{name}'s Posts</Grid.Row>
          <Grid.Row>
            {loading ? (
              <h1>Loading...</h1>
            ) : (
              <Transition.Group>
                {posts.length !== 0 ? (
                  posts.map((post) => (
                    <Grid.Column key={post._id} style={{ marginBottom: 20 }}>
                      <PostCard post={post} />
                    </Grid.Column>
                  ))
                ) : (
                  <h1>No Posts</h1>
                )}
              </Transition.Group>
            )}
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

const FETCH_USER_POSTS = gql`
  query($userID: ID!) {
    getUserPosts(userID: $userID) {
      _id
      threadName
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
