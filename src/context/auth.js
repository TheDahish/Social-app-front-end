import React, { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const initialState = {
  user: null,
};
if (localStorage.getItem("jwtToken")) {
  const token = jwtDecode(localStorage.getItem("jwtToken"));
  if (token.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwtToken");
  } else {
    console.log(token);
    initialState.user = token;
  }
}

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(user) {
    localStorage.setItem("jwtToken", user.token);
    // console.log(user);
    dispatch({
      type: "LOGIN",
      payload: user,
    });
  }

  function logout() {
    localStorage.removeItem("jwtToken");
    dispatch({
      type: "LOGOUT",
    });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };

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
      token
      id
    }
  }
`;
