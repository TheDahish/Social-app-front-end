import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Label, Popup } from "semantic-ui-react";

export function LikeButton({ user, post: { _id, likeCount, likes } }) {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username))
      setLiked(true);
    else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST, {
    variables: { postid: _id },
  });

  const likebutton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );
  return (
    <Popup
      content={liked ? "Unlike" : "Like"}
      inverted
      trigger={
        <Button as="div" labelPosition="right" onClick={likePost}>
          {likebutton}
          <Label basic color="teal" pointing="left">
            {likeCount}
          </Label>
        </Button>
      }
    />
  );
}

const LIKE_POST = gql`
  mutation likePost($postid: ID!) {
    likePost(postid: $postid) {
      _id
      likes {
        _id
        username
      }
      likeCount
    }
  }
`;
