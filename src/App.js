import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Navbar from "./Components/Navbar";
import { Container } from "semantic-ui-react";
import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";
import SinglePost from "./Pages/SinglePost";
import Users from "./Pages/Users";
import SingleUser from "./Pages/SingleUser";
import Threads from "./Pages/Threads";
import SingleThread from "./Pages/SingleThread";
import Profile from "./Pages/Profile";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <Navbar />
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <AuthRoute exact path="/users" component={Users} />

          <AuthRoute exact path="/profile" component={Profile} />
          <AuthRoute exact path="/threads" component={Threads} />
          <Route exact path="/register" component={Register} />
          <AuthRoute exact path="/posts/:postId" component={SinglePost} />
          <AuthRoute exact path="/users/:userID" component={SingleUser} />
          <AuthRoute exact path="/threads/:threadID" component={SingleThread} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
