import { useQuery } from "@apollo/react-hooks";
import { motion } from "framer-motion";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  Dimmer,
  Grid,
  Icon,
  Loader,
  Transition,
} from "semantic-ui-react";
import CreateThread from "../Components/CreateThread";
import Followbts from "../Components/Followbts";
import PostCard from "../Components/PostCard";

export default function Threads() {
  const [createOn, setCreateOn] = useState(false);
  const { loading, data } = useQuery(FETCH_THREADS);
  let [threads, setThreads] = useState([]);
  if (data) {
    threads = data.getThreads;

    // console.log(threads);

    //threads = threads.filter((u) => u.id !== user.id);
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
      style={{ position: "absolute", width: "100%" }}
    >
      <Dimmer active={loading} inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
      <div style={{ marginTop: "40px" }}>
        <div className="">
          <Grid relaxed stackable celled columns="equal">
            <Grid.Column>
              <Grid columns="1">
                <div style={{ overflow: "auto", maxHeight: "600px" }}>
                  <h4 style={{ textAlign: "center" }}>Threads</h4>
                  {loading
                    ? ""
                    : threads.map((t) => (
                        <Grid.Row>
                          <Card style={{ height: "100%", margin: "20px" }}>
                            <Card.Content
                              as={Link}
                              to={`/threads/${t.thread._id}`}
                              header={t.thread.name}
                            />
                            <Card.Content
                              description={`Created by ${t.thread.creatorUsername} on 2021`}
                            />
                            <Card.Content
                              style={{
                                display: "flex",
                                justifyContent: "space-around",
                              }}
                              extra
                            >
                              <Icon name="pencil">
                                {t.thread.posts.length} post
                                {t.thread.posts.length !== 1 && "s"}
                              </Icon>
                              <Followbts threadID={t.thread._id} />
                            </Card.Content>
                          </Card>
                        </Grid.Row>
                      ))}
                </div>
              </Grid>
            </Grid.Column>
            <Grid.Column>
              <Grid columns={2}>
                <Grid.Row className="title">
                  <Grid.Column>
                    <h1>Popular Posts</h1>
                  </Grid.Column>
                  <Grid.Column>
                    <Button
                      style={{}}
                      color="teal"
                      size="massive"
                      floated="right"
                      onClick={() => setCreateOn(true)}
                    >
                      Create Thread
                    </Button>
                  </Grid.Column>
                </Grid.Row>

                {loading ? (
                  ""
                ) : (
                  <Transition.Group>
                    <div className="thread">
                      {threads &&
                        threads.map((t) =>
                          t.posts.map((post) => (
                            <Grid.Row
                              //className="thread"
                              key={post.id}
                              // style={{ marginBottom: 20, width: "25%" }}
                            >
                              <PostCard
                                threadCreator={t.thread.creatorUsername}
                                threadID={t.thread._id}
                                post={post}
                              />
                            </Grid.Row>
                          ))
                        )}
                    </div>
                  </Transition.Group>
                )}
              </Grid>
            </Grid.Column>
          </Grid>
        </div>
      </div>

      <CreateThread createOn={createOn} setCreateOn={setCreateOn} />
    </motion.div>
  );
}

const FETCH_THREADS = gql`
  {
    getThreads {
      posts {
        threadName
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
      thread {
        creatorUsername
        _id
        posts {
          postID
        }
        name
      }
    }
  }
`;
