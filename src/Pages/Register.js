import { useMutation } from "@apollo/client";
import { motion } from "framer-motion";
import gql from "graphql-tag";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
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
      window.location.reload(false);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function registerUser() {
    addUser();
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
  return (
    <motion.div
      initial="initial"
      animate="in"
      variants={pageVariants}
      transition={pageTransition}
      exit="out"
      className="formContainer login"
      style={{ position: "absolute", left: "31%" }}
    >
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
          Already a User?<Link to="/login"> Login</Link>
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
    </motion.div>
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
