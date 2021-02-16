import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import { Button, Dimmer, Form, Loader } from "semantic-ui-react";
import { useForm } from "../util/hooks";

export default function PostFormThread({
  threadPosts,
  setThreadPosts,
  threadID,
}) {
  const { values, onChange, onSubmit } = useForm(createPostcallback, {
    body: "",
  });
  // console.log(threadID);
  const [createThreadPost, { loading, error }] = useMutation(CREATE_POST, {
    variables: { body: values.body, threadID },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_THREAD_POST_QUERY,
        variables: { threadID: threadID },
      });
      // console.log(result.data.createThreadPost);
      proxy.writeQuery({
        query: FETCH_THREAD_POST_QUERY,
        variables: { threadID: threadID },
        data: {
          getThreadPosts: [
            result.data.createThreadPost,
            ...data.getThreadPosts,
          ],
        },
      });
      //  console.log(data);
      threadPosts.push(result.data.createThreadPost);
      setThreadPosts([...threadPosts]);
      values.body = "";
    },
  });

  function createPostcallback() {
    createThreadPost();
  }

  return (
    <>
      <Dimmer active={loading} inverted>
        <Loader inverted>Posting</Loader>
      </Dimmer>
      <Form onSubmit={onSubmit}>
        <h1 style={{ marginLeft: "45px" }}>Create a Post</h1>
        <Form.Group>
          <Form.Input
            placeholder="Connect me"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Post
          </Button>
        </Form.Group>
      </Form>
      {error && (
        <div
          style={{ height: "20%", marginLeft: "10px", marginTop: "40px" }}
          className="ui error message"
        >
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST = gql`
  mutation createThreadPost($threadID: ID!, $body: String!) {
    createThreadPost(threadID: $threadID, body: $body) {
      threadName
      _id
      body
      createdAt
      username
      likes {
        _id
        username
        createdAt
      }
      likeCount
      comments {
        _id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

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
