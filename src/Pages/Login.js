import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

export default function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      context.login(result.data.login);
      props.history.push("/");
      window.location.reload(false);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="formContainer">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          value={values.username}
          onChange={onChange}
          type="text"
          error={errors.username ? true : false}
        />

        <Form.Input
          error={errors.password ? true : false}
          type="password"
          label="Password"
          placeholder="Password"
          name="password"
          value={values.password}
          onChange={onChange}
        />

        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
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
      token
      id
    }
  }
`;
