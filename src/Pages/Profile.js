import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useContext, useState } from "react";
import { Button, Form, Grid, Header, Image, Segment } from "semantic-ui-react";
import Followbts from "../Components/Followbts";
import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

export default function Profile(props) {
  const context = useContext(AuthContext);
  const [edit, setEdit] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const user = context.user;
  var pattern = new RegExp(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
  );

  const { onChange, values } = useForm(registerUser, {
    name: user.name,
    username: user.username,
    email: user.email,
    password: "",
  });

  const [editProfile, { loading }] = useMutation(EDIT_PROFILE, {
    update(_, result) {
      context.login(result.data.editProfile);
      props.history.push("/profile");
      window.location.reload(false);
    },

    variables: values,
  });

  function registerUser() {
    console.log("test");
    editProfile();
  }
  return (
    <div style={{ maxWidth: 720, margin: "auto" }}>
      <Segment textAlign="center">
        <Form
          style={{ maxWidth: 520, margin: "auto" }}
          // onSubmit={onSubmit}
          noValidate
          className={loading ? "loading" : ""}
        >
          <Header textAlign="center" size="huge">
            Profile
            <Image
              floated="right"
              size="mini"
              src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
            />
          </Header>
          <Form.Input
            label="Display Name"
            placeholder={user.name}
            disabled={!edit}
            name="name"
            value={values.name}
            onChange={onChange}
            type="text"
            //error={errors.name ? true : false}
          />
          <Form.Input
            label="Username"
            placeholder={user.username}
            name="username"
            disabled={!edit}
            value={values.username}
            onChange={onChange}
            type="text"
            //error={errors.username ? true : false}
          />
          <Form.Input
            error={!pattern.test(values.email)}
            type="email"
            label="email"
            placeholder={user.email}
            name="email"
            disabled={!edit}
            value={values.email}
            onChange={onChange}
          />

          <Form.Input
            //error={errors.password ? true : false}
            type="password"
            label="Password"
            placeholder="Password"
            name="password"
            disabled={!editPassword || !edit}
            value={values.password}
            onChange={onChange}
          />

          <div style={{ display: "flex", height: "32px" }}>
            <Button
              //disabled={edit}
              onClick={() => setEdit(!edit)}
              // secondary

              content={!edit ? "Edit" : "Cancel"}
            />
            {edit && (
              <>
                <Button
                  onClick={registerUser}
                  disabled={
                    !(
                      values.username !== "" &&
                      values.name !== "" &&
                      (values.password !== "" || !editPassword) &&
                      values.email !== "" &&
                      pattern.test(values.email)
                    )
                  }
                  primary
                >
                  Save
                </Button>
                <Button
                  onClick={() => setEditPassword(!editPassword)}
                  size="small"
                  //  type="submit"
                  primary
                >
                  {editPassword ? "Cancel" : "Change Password"}
                </Button>
              </>
            )}
          </div>
        </Form>
      </Segment>
    </div>
  );
}

const EDIT_PROFILE = gql`
  mutation editProfile(
    $name: String!
    $username: String!
    $password: String
    $email: String!
  ) {
    editProfile(
      name: $name
      username: $username
      password: $password
      email: $email
    ) {
      email
      username
      createdAt
      token
    }
  }
`;
