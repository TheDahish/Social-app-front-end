import React, { useContext, useState } from "react";
import {
  Card,
  Icon,
  Label,
  Image,
  Button,
  Popup,
  Modal,
  Form,
  TextArea,
} from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { LikeButton } from "./likebtn";
import DeleteButtonThread from "./DeleteButtonThread";
import DeleteButton from "./DeleteButton";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
export default function PostCard({
  threadCreator,
  threadID,
  deletePost,
  post,
}) {
  const {
    threadName,
    body,
    createdAt,
    _id,
    username,
    likeCount,
    commentCount,

    likes,
  } = post;
  const { user } = useContext(AuthContext);
  const [newbody, setBody] = useState(body);
  const [editOn, setEditOn] = useState(false);
  const [editPost] = useMutation(EDIT_POST, {
    variables: {
      body: newbody,
      postID: _id,
    },
  });

  function handleEdit() {
    //console.log(newbody);
    editPost();
    window.location.reload(false);
  }
  return (
    <>
      <Card fluid>
        <Card.Content>
          <Card.Header icon>
            {username}{" "}
            {threadName !== "" &&
              (threadID ? (
                <Card.Meta
                  style={{ fontSize: 15 }}
                  as={Link}
                  to={`/threads/${threadID}`}
                >
                  / {threadName}
                </Card.Meta>
              ) : (
                <Card.Meta as={Link} to="/threads" style={{ fontSize: 15 }}>
                  / {threadName}
                </Card.Meta>
              ))}{" "}
            {user && user.username === username && (
              <Popup
                content="Edit post"
                inverted
                trigger={
                  <Button
                    onClick={() => setEditOn(true)}
                    size="small"
                    basic
                    icon="edit"
                    floated="right"
                  />
                }
              />
            )}
          </Card.Header>

          <Card.Meta as={Link} to={`/posts/${_id}`}>
            {moment(createdAt).fromNow(true)}
          </Card.Meta>
          <Card.Description>
            {" "}
            <TextArea
              style={{
                cursor: "default",
                border: "none",
                resize: "none",
                width: "100%",
                height: "100%",
              }}
              readOnly
            >
              {body}
            </TextArea>{" "}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <LikeButton user={user} post={{ _id, likes, likeCount }} />
          <Popup
            content="Comment on post"
            inverted
            trigger={
              <Button labelPosition="right" as={Link} to={`/posts/${_id}`}>
                <Button color="blue" basic>
                  <Icon name="comments" />
                </Button>
                <Label basic color="blue" pointing="left">
                  {commentCount}
                </Label>
              </Button>
            }
          />
          {console.log(threadCreator)}
          {user &&
            (user.username === username || user.username === threadCreator) &&
            (threadID ? (
              <DeleteButtonThread
                threadID={threadID}
                deletePost2={deletePost}
                postid={_id}
              />
            ) : (
              <DeleteButton
                threadID={threadID}
                deletePost2={deletePost}
                postid={_id}
              />
            ))}
        </Card.Content>
      </Card>

      <Modal
        dimmer="blurring"
        size="mini"
        onClose={() => setEditOn(false)}
        onOpen={() => setEditOn(true)}
        open={editOn}
        //trigger={<Button>Show Modal</Button>}
      >
        <Modal.Header>Edit Post</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Form>
              <Form.Field>
                <label>Posts's body</label>
                <TextArea
                  style={{ resize: "none" }}
                  onChange={(event) => setBody(event.target.value)}
                  value={newbody}
                />
              </Form.Field>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setEditOn(false)}>
            Cancel
          </Button>
          <Button
            disabled={newbody === ""}
            content="Edit"
            //  labelPosition="right"
            //icon="checkmark"
            onClick={handleEdit}
            positive
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}

const EDIT_POST = gql`
  mutation editPost($body: String!, $postID: String!) {
    editPost(body: $body, postID: $postID) {
      body
    }
  }
`;
