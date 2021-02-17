import { gql, useMutation, useQuery } from "@apollo/react-hooks";
import { motion } from "framer-motion";
import React, { useContext, useState } from "react";
import {
  Button,
  Card,
  Confirm,
  Dimmer,
  Grid,
  Icon,
  Loader,
  Segment,
  Transition,
} from "semantic-ui-react";
import CreateThread from "../Components/CreateThread";
import PostCard from "../Components/PostCard";
//import PostForm from "../Components/PostForm";
import PostFormThread from "../Components/PostFormThread";
import { AuthContext } from "../context/auth";

export default function SingleThread(props) {
  const { user } = useContext(AuthContext);
  const [createOn, setCreateOn] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  function compare(a, b) {
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    if (a.createdAt > b.createdAt) {
      return -1;
    }
    return 0;
  }
  const threadID = props.match.params.threadID;
  let thread = {};
  let [threadPosts, setThreadPosts] = useState([]);
  const { loading, data } = useQuery(FETCH_THREAD_POST_QUERY, {
    variables: { threadID },
  });
  const { loading: loading2, data: data2 } = useQuery(FETCH_THREADS, {
    variables: { threadID },
  });

  const [deleteThread] = useMutation(DELETE_THREAD, {
    update() {
      props.history.push("/threads");
      window.location.reload(false);
    },
    variables: {
      threadID: threadID,
    },
  });

  function handleDelete() {
    deleteThread();
  }

  if (data) {
    threadPosts = data.getThreadPosts;
    threadPosts.sort(compare);
    // console.log(threadPosts);
  }
  if (data2) {
    thread = data2.getThread;
    // console.log(thread);
  }
  function deletePost(postID) {
    threadPosts = threadPosts.filter((p) => p._id !== postID);
    setThreadPosts([...threadPosts]);
    //  console.log(threadPosts);
    //window.location.reload(false);
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
    <>
      <Dimmer active={loading} inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
      {loading && loading2 ? (
        ""
      ) : (
        <motion.div
          initial="initial"
          animate="in"
          variants={pageVariants}
          transition={pageTransition}
          exit="out"
          className="formContainer"
          style={{ position: "absolute", width: "100%", display: "flex" }}
        >
          <Card style={{ height: "100%", margin: "20px" }}>
            <Card.Content header={thread.name} />
            <Card.Content
              description={`Created by ${thread.creatorUsername} on 2021`}
            />
            <Card.Content extra>
              <Icon name="write" />
              {threadPosts.length} post{threadPosts.length !== 1 && "s"}
            </Card.Content>
            {user.username === thread.creatorUsername && (
              <Card.Content extra>
                <Button
                  color="red"
                  floated="right"
                  content="Delete"
                  icon="trash"
                  onClick={() => setConfirmOpen(true)}
                />
                <Button
                  basic
                  onClick={() => setCreateOn(true)}
                  color="teal"
                  content="Edit"
                  icon="edit"
                />
                <CreateThread
                  threadID={thread._id}
                  edit
                  createOn={createOn}
                  setCreateOn={setCreateOn}
                />
                <Confirm
                  open={confirmOpen}
                  onCancel={() => setConfirmOpen(false)}
                  onConfirm={handleDelete}
                />
              </Card.Content>
            )}
          </Card>
          <Segment loading={loading2 || loading}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <PostFormThread
                threadPosts={threadPosts}
                setThreadPosts={setThreadPosts}
                threadID={threadID}
              />
            </div>
            <>
              <div className="thread">
                <Grid columns={3}>
                  <Grid.Row className="title">
                    <h1>Popular Posts</h1>
                  </Grid.Row>

                  <Transition.Group>
                    <div className="thread">
                      {threadPosts &&
                        threadPosts.map((post) => (
                          <Grid.Row
                            //className="thread"
                            key={post.id}
                            // style={{ marginBottom: 20, width: "25%" }}
                          >
                            <PostCard
                              threadID={thread._id}
                              threadCreator={thread.creatorUsername}
                              deletePost={deletePost}
                              post={post}
                            />
                          </Grid.Row>
                        ))}
                    </div>
                  </Transition.Group>
                </Grid>
              </div>
            </>
          </Segment>
        </motion.div>
      )}
    </>
  );
}

const FETCH_THREAD_POST_QUERY = gql`
  query($threadID: ID!) {
    getThreadPosts(threadID: $threadID) {
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

const FETCH_THREADS = gql`
  query($threadID: ID!) {
    getThread(threadID: $threadID) {
      _id
      name
      creatorUsername
      posts {
        postID
      }
    }
  }
`;

const DELETE_THREAD = gql`
  mutation deleteThread($threadID: ID!) {
    deleteThread(threadID: $threadID)
  }
`;
