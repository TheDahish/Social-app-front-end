import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { AuthContext } from "../context/auth";

export default function Followbts({ threadID, id }) {
  let { user } = useContext(AuthContext);
  //console.log(user);
  //let { myUser, setMyUser } = useState({ id: 123 });
  const [followed, setFollowed] = useState(false);
  const { data } = useQuery(FETCH_USER, {
    variables: { userID: user.id },
  });
  if (data) {
    user = data.getUser;

    // console.log(user);
  }
  // if (!user) user = { followedUsers: [] };
  //   user.followedUsers.find((u) => u.userID === id)
  // );
  // //  console.log(user.followedUsers.find((u) => u.userID === id));
  // let [list, setList] = useState(user.followedUsers);

  useEffect(() => {
    if (threadID && user.followedThreads) {
      // console.log("thread dollow");
      if (user.followedThreads.find((u) => u.threadID === threadID)) {
        setFollowed(true);
      } else {
        setFollowed(false);
      }
    } else if (
      user.followedUsers &&
      user.followedUsers.find((u) => u.userID === id)
    ) {
      setFollowed(true);
    } else {
      setFollowed(false);
    }
  }, [user, id, threadID]);

  const [follow] = useMutation(FOLLOW_USER, {
    variables: { userID: id },
  });
  const [tFollow] = useMutation(FOLLOW_THREAD, {
    variables: { threadID: threadID },
  });

  function followus() {
    //alert("here");
    setFollowed(!followed);
    if (threadID) {
      tFollow();
      if (user.followedThreads.find((u) => u.threadID === threadID)) {
        user.followedThreads = user.followedThreads.filter(
          (u) => u.threadID !== threadID
        );
      } else {
        user.followedThreads.push({ threadID: threadID });
      }
    } else {
      follow();
      if (user.followedUsers.find((u) => u.userID === id)) {
        user.followedUsers = user.followedUsers.filter((u) => u.userID !== id);
      } else {
        user.followedUsers.push({ userID: id });
      }
    }
    //setList([...list]);
  }

  return (
    <div style={{ marginLeft: "auto" }}>
      {data ? (
        followed ? (
          <Button
            color="teal"
            onClick={followus}
            content="UnFollow"
            icon="add user"
            // label={{ as: "a", basic: true, content: "2,048" }}
            // labelPosition="right"
          />
        ) : (
          <Button
            onClick={followus}
            basic
            color="teal"
            content="Follow"
            icon="add user"
            // label={{ as: "a", basic: true, content: "2,048" }}
            //labelPosition="right"
          />
        )
      ) : (
        <Button as={Link} basic to="/login" color="teal" />
      )}
    </div>
  );
}

const FOLLOW_USER = gql`
  mutation followUser($userID: ID!) {
    followUser(userID: $userID) {
      id
      username
      name
    }
  }
`;

const FETCH_USER = gql`
  query($userID: ID!) {
    getUser(userID: $userID) {
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

      id
    }
  }
`;
const FOLLOW_THREAD = gql`
  mutation followThread($threadID: ID!) {
    followThread(threadID: $threadID) {
      _id

      name
    }
  }
`;
