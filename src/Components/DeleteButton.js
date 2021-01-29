import cloneDeep from "lodash/cloneDeep";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Button, Confirm, Icon, Popup } from "semantic-ui-react";
import { FETCH_POST_QUERY } from "../util/graphql";
export default function DeleteButton({
  deletePost2,
  postid,
  commentid,
  callback,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const mutation = commentid ? DELETE_COMMENT : DELETE_POST;
  const [deletePostorComment] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentid) {
        const data = proxy.readQuery({
          query: FETCH_POST_QUERY,
        });
        data.getPosts = data.getPosts.filter((p) => p._id !== postid);
        const test = cloneDeep(data.getPosts);
        proxy.writeQuery({
          query: FETCH_POST_QUERY,
          data: {
            getPosts: test,
          },
        });
        deletePost2(postid);
      }

      if (callback) callback();
    },
    variables: {
      postid,
      commentid,
    },
  });
  return (
    <>
      <Popup
        content={commentid ? "Delete comment" : "Delete Post"}
        inverted
        trigger={
          <Button
            as="div"
            color="red"
            onClick={() => setConfirmOpen(true)}
            floated="right"
          >
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
        }
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostorComment}
      />
    </>
  );
}

const DELETE_POST = gql`
  mutation deletePost($postid: ID!) {
    deletePost(postid: $postid)
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($postid: ID!, $commentid: ID!) {
    deleteComment(postid: $postid, commentid: $commentid) {
      _id
      comments {
        _id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;
