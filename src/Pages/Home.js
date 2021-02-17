import React, { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/react-hooks";
import {
  Button,
  Dimmer,
  Divider,
  Form,
  Grid,
  Loader,
  Segment,
  Transition,
} from "semantic-ui-react";
import PostCard from "../Components/PostCard";
import { AuthContext } from "../context/auth";
import PostForm from "../Components/PostForm";
//import { FETCH_POST_QUERY } from "../util/graphql";
import { Link } from "react-router-dom";
import { useForm } from "../util/hooks";
import Filter from "../Components/Filter";
import { motion } from "framer-motion";
function compare(a, b) {
  if (a.createdAt < b.createdAt) {
    return 1;
  }
  if (a.createdAt > b.createdAt) {
    return -1;
  }
  return 0;
}
export default function Home(props) {
  const context = useContext(AuthContext);
  const user = context.user;
  const [errors, setErrors] = useState({});
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });
  let [filter, setFilter] = useState([]);
  let [posts, setPosts] = useState([]);
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      //  console.log(result.data.login);

      context.login(result.data.login);
      // props.history.push("/");
      setPosts([]);
      window.location.reload(false);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });
  async function loginUserCallback() {
    await loginUser();
  }

  let { loading: loading2, data } = useQuery(FETCH_POST_QUERY);
  // const { loading3, threadPosts } = useQuery(FETCH_THREAD_POST_QUERY);
  if (data) {
    // console.log(data);
    posts = data.getFollowedPosts;
    console.log(posts);
    posts.sort(compare);
  }

  function deletePost(id) {
    posts = posts.filter((p) => p._id !== id);
    setPosts([...posts]);
    // console.log(posts);
  }

  useEffect(() => {
    posts = [];
    if (!user) {
      setPosts([]);
    }
    //   console.log(posts);
  }, [user]);
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
  // console.log(filter);
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ position: "absolute", width: "100%" }}
    >
      {user ? (
        <>
          {/* <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-end",
            }}
          >
            <PostForm />
            <Filter
              filter={filter}
              setFilter={setFilter}
              loading={loading2}
              threads={posts}
            />
          </div> */}
          <Grid columns={3} relaxed stackable>
            <Grid.Row className="title" verticalAlign="bottom" columns="2">
              <Grid.Column>
                <PostForm />
              </Grid.Column>
              <Grid.Column>
                <Filter
                  filter={filter}
                  setFilter={setFilter}
                  loading={loading2}
                  threads={posts}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className="title">
              <h1 style={{ display: "flex", justifyContent: "space-around" }}>
                Timeline{" "}
              </h1>
            </Grid.Row>
            <Grid.Row>
              {/* <Grid.Column>
              <PostForm />
            </Grid.Column> */}

              {loading2 ? (
                <Dimmer active={loading2} inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
              ) : filter.length > 0 ? (
                <Transition.Group>
                  {posts &&
                    posts.map(
                      (post) =>
                        filter.find((t) => t === post.threadName) && (
                          <Grid.Column
                            key={post._id}
                            style={{ marginBottom: 20 }}
                          >
                            <PostCard deletePost={deletePost} post={post} />
                          </Grid.Column>
                        )
                    )}
                </Transition.Group>
              ) : (
                <Transition.Group>
                  {posts &&
                    posts.map((post) => (
                      <Grid.Column key={post._id} style={{ marginBottom: 20 }}>
                        <PostCard deletePost={deletePost} post={post} />
                      </Grid.Column>
                    ))}
                </Transition.Group>
              )}
            </Grid.Row>
          </Grid>
        </>
      ) : (
        <Segment placeholder>
          <Grid columns={2} relaxed="very" stackable>
            <Grid.Column>
              <Form
                onSubmit={onSubmit}
                noValidate
                className={loading ? "loading" : ""}
              >
                <Form.Input
                  className="test"
                  icon="user"
                  iconPosition="left"
                  label="Username"
                  //labelPosition="right corner"
                  placeholder="Username"
                  name="username"
                  value={values.username}
                  onChange={onChange}
                  type="text"
                  error={errors.username ? true : false}
                />
                <Form.Input
                  icon="lock"
                  iconPosition="left"
                  label="Password"
                  type="password"
                  error={errors.password ? true : false}
                  placeholder="Password"
                  name="password"
                  value={values.password}
                  onChange={onChange}
                />

                <Button type="submit" content="Login" primary />
              </Form>
              {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                  <ul className="list">
                    {Object.values(errors).map((value) => (
                      <li key={value}>{value}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Grid.Column>

            <Grid.Column verticalAlign="middle">
              <Button
                as={Link}
                to="/register"
                content="Sign up"
                icon="signup"
                size="big"
              />
            </Grid.Column>
          </Grid>

          <Divider vertical>Or</Divider>
        </Segment>
      )}
    </motion.div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      posts {
        postID
      }
      followedThreads {
        threadID
      }
      followedUsers {
        userID
      }
      name
      email
      username
      createdAt
      token
      id
    }
  }
`;

const FETCH_POST_QUERY = gql`
  {
    getFollowedPosts {
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
  }
`;
