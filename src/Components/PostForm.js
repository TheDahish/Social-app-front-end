import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import { Button, Form } from "semantic-ui-react";
import { useForm } from "../util/hooks";

import { FETCH_POST_QUERY } from "../util/graphql";
export default function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostcallback, {
    body: "",
  });

  const [createUserPost, { error }] = useMutation(CREATE_POST, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POST_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POST_QUERY,
        data: {
          getFollowedPosts: [
            result.data.createUserPost,
            ...data.getFollowedPosts,
          ],
        },
      });
      values.body = "";
    },
  });

  function createPostcallback() {
    createUserPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h1 style={{ textAlign: "left", marginLeft: "30px" }}>Create a Post</h1>
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
  mutation createPost($body: String!) {
    createUserPost(body: $body) {
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
