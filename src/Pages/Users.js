import { useQuery } from "@apollo/react-hooks";
import { motion } from "framer-motion";
import gql from "graphql-tag";
import React, { useContext } from "react";
import { Dimmer, Grid, Loader, Transition } from "semantic-ui-react";
import UserCard from "../Components/UserCard";
import { AuthContext } from "../context/auth";

export default function Users() {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_USERS);
  var users = [];
  if (data) {
    // console.log(user);
    users = data.getUsers;
    if (user) users = users.filter((u) => u.id !== user.id);
    //console.log(users, user);
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
      style={{ marginTop: "20px", position: "absolute", width: "100%" }}
    >
      <Dimmer active={loading} inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
      <Grid relaxed stackable columns={3}>
        <Grid.Row className="title">
          <h1>Users</h1>
        </Grid.Row>
        <Grid.Row>
          {loading ? (
            ""
          ) : (
            <Transition.Group>
              {users &&
                users.map((user) => (
                  <Grid.Column key={user.id} style={{ marginBottom: 20 }}>
                    <UserCard
                      name={user.name}
                      id={user.id}
                      posts={user.posts}
                      createdAt={user.createdAt}
                    />
                  </Grid.Column>
                ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    </motion.div>
  );
}

const FETCH_USERS = gql`
  {
    getUsers {
      id
      username
      name
      createdAt
      posts {
        postID
      }
    }
  }
`;
