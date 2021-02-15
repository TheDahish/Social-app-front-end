import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useContext, useState } from "react";
import { Button, Container, Form } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

export default function Register(props) {
  const [errors, setErrors] = useState({});
  const context = useContext(AuthContext);
  const { onChange, onSubmit, values } = useForm(registerUser, {
    name: "",
    username: "",
    email: "",
    password: "",
    confirmedPassword: "",
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      context.login(result.data.register);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function registerUser() {
    addUser();
  }
  return (
    <div className="formContainer">
      <Container textAlign="center">
        <Form
          onSubmit={onSubmit}
          noValidate
          className={loading ? "loading" : ""}
        >
          <h1>Register</h1>
          <Form.Input
            label="Display Name"
            placeholder="Display Name"
            name="name"
            value={values.name}
            onChange={onChange}
            type="text"
            error={errors.name ? true : false}
          />
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
            error={errors.email ? true : false}
            type="email"
            label="email"
            placeholder="email"
            name="email"
            value={values.email}
            onChange={onChange}
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
          <Form.Input
            error={errors.confirmedPassword ? true : false}
            label="Confirmed Password"
            placeholder="Confirmed Password"
            name="confirmedPassword"
            value={values.confirmedPassword}
            onChange={onChange}
            type="password"
          />
          <Button type="submit" primary>
            Register
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
      </Container>
    </div>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
    $confirmedPassword: String!
  ) {
    register(
      registerInput: {
        name: $name
        username: $username
        email: $email
        password: $password
        confirmedPassword: $confirmedPassword
      }
    ) {
      email
      username
      createdAt
      token
    }
  }
`;
