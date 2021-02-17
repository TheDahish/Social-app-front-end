import { AuthContext } from "../context/auth";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useContext, useRef, useState } from "react";
import {
  Button,
  Card,
  Form,
  Grid,
  Icon,
  Image,
  Label,
  Popup,
} from "semantic-ui-react";
import moment from "moment";
import { LikeButton } from "../Components/likebtn";
import DeleteButton from "../Components/DeleteButton";
import { motion } from "framer-motion";

export default function SinglePost(props) {
  const postid = props.match.params.postId;
  const [comment, setComment] = useState("");
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);
  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postid,
    },
  });
  const [createComment] = useMutation(CREATE_COMMENT, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postid,
      body: comment,
    },
  });
  let getPost;
  if (data) {
    getPost = data.getPost;
  }
  function deletepostcallback() {
    props.history.push("/");
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
  let postMarkup;
  if (!getPost) {
    postMarkup = <h1> </h1>;
  } else {
    const {
      _id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;
    postMarkup = (
      <motion.div
        initial="initial"
        animate="in"
        variants={pageVariants}
        transition={pageTransition}
        exit="out"
        className="formContainer"
        style={{ position: "absolute", width: "100%" }}
      >
        <Grid>
          <Grid.Row>
            <Grid.Column width={2}>
              <Image
                floated="right"
                size="small"
                src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
              />
            </Grid.Column>
            <Grid.Column width={10}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>{username}</Card.Header>
                  <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{body}</Card.Description>
                </Card.Content>
                <hr />
                <Card.Content extra>
                  <LikeButton user={user} post={{ _id, likeCount, likes }} />
                  <Popup
                    content="Comment on Post"
                    inverted
                    trigger={
                      <Button as="div" labelPosition="right">
                        <Button basic color="blue">
                          <Icon name="comments" />
                        </Button>
                        <Label basic color="blue" pointing="left">
                          {commentCount}
                        </Label>
                      </Button>
                    }
                  />
                  {user && user.username === username && (
                    <DeleteButton postid={_id} callback={deletepostcallback} />
                  )}
                </Card.Content>
              </Card>
              {user && (
                <Card fluid>
                  <Card.Content>
                    <p>Post a Comment</p>
                    <Form>
                      <div className="ui action input fluid">
                        <input
                          ref={commentInputRef}
                          type="text"
                          placeholder="Comment.."
                          name="comment"
                          value={comment}
                          onChange={(event) => setComment(event.target.value)}
                        />
                        <button
                          type="submit"
                          className="ui button teal"
                          disabled={comment.trim() === ""}
                          onClick={createComment}
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                  </Card.Content>
                </Card>
              )}
              {comments.map((comment) => (
                <Card fluid key={comment._id}>
                  <Card.Content>
                    {user &&
                      (user.username === comment.username ||
                        user.username === username) && (
                        <DeleteButton postid={_id} commentid={comment._id} />
                      )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </Card.Content>
                </Card>
              ))}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </motion.div>
    );
  }
  return postMarkup;
}

const FETCH_POST_QUERY = gql`
  query($postid: ID!) {
    getPost(postid: $postid) {
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
const CREATE_COMMENT = gql`
  mutation createComment($postid: ID!, $body: String!) {
    createComment(postid: $postid, body: $body) {
      _id
      commentCount
      comments {
        _id
        body
        createdAt
        username
      }
    }
  }
`;
