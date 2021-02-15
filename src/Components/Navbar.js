import { useMutation } from "@apollo/react-hooks";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Menu, Sidebar, Transition } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
export default function Navbar(props) {
  const { user, logout } = useContext(AuthContext);

  const pathname = window.location.pathname;
  const path =
    pathname === "/"
      ? !user
        ? "home"
        : user.name
      : pathname.substr(1) === "users"
      ? "Users"
      : pathname.substr(1) === "threads"
      ? "Threads"
      : pathname.substr(1);
  // console.log(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);
  const [activeItem, setActiveItem] = useState(path);

  const [scrollNav, setScrollNav] = useState(false);

  const [visible, setVisible] = useState(false);
  const changeNav = () => {
    if (window.scrollY >= 50) {
      setScrollNav(true);
    } else {
      setScrollNav(false);
      setVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNav);
  }, []);
  const navBar = user ? (
    <>
      <Menu style={{}} pointing secondary size="massive" color="teal">
        <Menu.Item
          onClick={handleItemClick}
          name={user.name}
          active={activeItem === user.name}
          as={Link}
          to="/"
        />
        {/* <Menu.Item name="Users" as={Link} to="/users" /> */}

        <Menu.Menu position="right">
          <Menu.Item
            name="Users"
            onClick={handleItemClick}
            active={activeItem === "Users"}
            as={Link}
            to="/users"
          />
          <Menu.Item
            name="Threads"
            onClick={handleItemClick}
            as={Link}
            active={activeItem === "Threads"}
            to="/threads"
          />
        </Menu.Menu>

        <Menu.Menu position="right">
          <Menu.Item
            name="Profile"
            onClick={handleItemClick}
            as={Link}
            active={activeItem === "Profile"}
            to="/profile"
          />
          <Menu.Item
            name="Logout"
            onClick={() => {
              logout();
            }}
          />
        </Menu.Menu>
      </Menu>
      <Transition.Group animation="fly left">
        {scrollNav && (
          <Button
            style={{ position: "fixed", left: "95%", zIndex: 100 }}
            icon="bars"
            size="big"
            circular
            color="teal"
            link
            onClick={() => setVisible(!visible)}
          />
        )}
      </Transition.Group>
      <Sidebar
        as={Menu}
        animation="overlay"
        direction="left"
        icon="labeled"
        inverted
        vertical
        visible={visible && scrollNav}
        width="thin"
      >
        <Menu.Item
          name={user.name}
          onClick={handleItemClick}
          active={activeItem === user.username}
          as={Link}
          to="/"
        >
          <Icon name="home" />
          Home
        </Menu.Item>
        <Menu.Item
          name="Users"
          as={Link}
          onClick={handleItemClick}
          active={activeItem === "Users"}
          to="/users"
        >
          <Icon name="users" />
          Users
        </Menu.Item>
        <Menu.Item
          name="Threads"
          as={Link}
          onClick={handleItemClick}
          active={activeItem === "Threads"}
          to="/threads"
        >
          <Icon name="clipboard outline" />
          Threads
        </Menu.Item>
        <Menu.Item
          name="Profile"
          as={Link}
          onClick={handleItemClick}
          active={activeItem === "Profile"}
          to="/profile"
        >
          <Icon name="user" />
          Profile
        </Menu.Item>
        <Menu.Item onClick={logout}>
          <Icon name="sign language" />
          Logout
        </Menu.Item>
      </Sidebar>
    </>
  ) : (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />

      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );
  return <>{navBar}</>;
}
