import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Icon, Image } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import Followbts from "./Followbts";
export default function UserCard({ name, id, posts, createdAt }) {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <Card>
        <Image
          as={Link}
          to={{
            pathname: `/users/${id}`,
            state: {
              name,
              id,
              posts,
              createdAt,
              posts,
            },
          }}
          src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
          wrapped
          ui={false}
        />
        <Card.Content>
          <Card.Header>{name}</Card.Header>
          <Card.Meta>
            <span className="date">Joined in {createdAt.substring(0, 4)}</span>
          </Card.Meta>
        </Card.Content>
        <Card.Content
          style={{ display: "flex", justifyContent: "space-around" }}
          extra
        >
          <Icon name="edit">
            {posts.length} Post{posts.length === 1 ? "" : "s"}
          </Icon>

          {user && <Followbts user={user} id={id} />}
        </Card.Content>
      </Card>
    </div>
  );
}
