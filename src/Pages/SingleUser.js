import { useQuery } from "@apollo/react-hooks";
import { motion } from "framer-motion";
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
  const pageVariants = {
    initial: {
      opacity: 0,
      x: "-100vw",
      scale: 0.8,
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      x: "100vw",
      scale: 1.2,
    },
  };
  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 1,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      variants={pageVariants}
      transition={pageTransition}
      exit="out"
      className="formContainer"
      style={{ position: "absolute", width: "100%" }}
    >
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
    </motion.div>
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
