import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../Components/PostCard";
import { AuthContext } from "../context/auth";
import PostForm from "../Components/PostForm";
import { FETCH_POST_QUERY } from "../util/graphql";
export default function Home() {
  const { user } = useContext(AuthContext);

  const { loading, data } = useQuery(FETCH_POST_QUERY);
  let [posts, setPosts] = useState([]);
  if (data) {
    posts = data.getPosts;
  }

  function deletePost(id) {
    posts = posts.filter((p) => p._id !== id);
    setPosts([...posts]);
    console.log(posts);
  }

  return (
    <Grid columns={3}>
      <Grid.Row className="title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading...</h1>
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
  );
}
