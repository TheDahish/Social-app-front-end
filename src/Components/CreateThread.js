import { gql, useMutation } from "@apollo/react-hooks";
import React, { useState } from "react";
import { Button, Form, Modal } from "semantic-ui-react";

export default function CreateThread({
  edit,
  createOn: open,
  setCreateOn: setOpen,
  threadID,
}) {
  const [tname, setTname] = useState("");

  const [editThread] = useMutation(EDIT_THREAD, {
    update() {
      window.location.reload(false);
    },
    variables: {
      name: tname,
      threadID: threadID ? threadID : "",
    },
  });

  const [createThread] = useMutation(CREATE_THREAD, {
    variables: { name: tname },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_THREADS,
      });
      // console.log(data.getThreads, result.data.createThread);
      data.getThreads = data.getThreads.push({
        posts: [],
        thread: result.data.createThread,
      });
      //const test = cloneDeep(data.getThreads);
      proxy.writeQuery({
        query: FETCH_THREADS,
        data: {
          getThreads: data.getThreads,
        },
      });
      setTname("");
      window.location.reload(false);
    },
  });

  function handleCreate() {
    if (tname !== "") {
      if (edit) {
        editThread();
      } else {
        createThread();
      }
      setOpen(false);
    } else {
      alert("name must not be empty");
    }
  }
  return (
    <Modal
      dimmer="blurring"
      size="mini"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      //trigger={<Button>Show Modal</Button>}
    >
      <Modal.Header>{edit ? "Edit name" : "Create a Thread"}</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <Form>
            <Form.Field>
              <label>Thread's Name</label>
              <input
                onChange={(event) => setTname(event.target.value)}
                placeholder="Name"
              />
            </Form.Field>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content={!edit ? "Create" : "Edit"}
          //  labelPosition="right"
          //icon="checkmark"
          onClick={handleCreate}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

const CREATE_THREAD = gql`
  mutation createThread($name: String!) {
    createThread(name: $name) {
      _id
      name
      creatorUsername
    }
  }
`;

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

const EDIT_THREAD = gql`
  mutation editThread($name: String!, $threadID: String!) {
    editThread(name: $name, threadID: $threadID) {
      name
    }
  }
`;
