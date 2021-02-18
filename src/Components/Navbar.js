import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Menu, Sidebar, Transition } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
export default function Navbar(props) {
  const { user, logout } = useContext(AuthContext);
  const size = useWindowSize();
  const pathname = window.location.pathname;

  // console.log(path);
  const path =
    pathname === "/"
      ? !user
        ? "home"
        : user.name
      : pathname.substr(1) === "users"
      ? "Users"
      : pathname.substr(1) === "threads"
      ? "Threads"
      : pathname.substr(1) === "register"
      ? "register"
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

  useEffect(() => {
    setActiveItem(
      pathname === "/"
        ? !user
          ? "home"
          : user.name
        : pathname.substr(1) === "users"
        ? "Users"
        : pathname.substr(1) === "threads"
        ? "Threads"
        : pathname.substr(1) === "register"
        ? "register"
        : pathname.substr(1)
    );
    //console.log("changed");
    // window.location.reload(false);
  }, [pathname]);

  return (
    <>
      {size.width > 700 ? (
        user ? (
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
        )
      ) : (
        <div style={{ marginBottom: "20px" }} />
      )}
      {user && (
        <>
          <Transition.Group animation="fly left">
            {(scrollNav || size.width < 700) && (
              <Button
                style={{
                  position: "fixed",
                  left: `${size.width < 700 ? "75%" : "95%"}`,
                  top: `${size.width < 700 ? "20%" : ""}`,
                  zIndex: 100,
                }}
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
            visible={visible && (scrollNav || size.width < 700)}
            width="thin"
          >
            <Menu.Item
              name={user ? user.name : "home"}
              onClick={(e, { name }) => {
                handleItemClick(e, name);
                setVisible(false);
              }}
              active={
                user ? activeItem === user.username : activeItem === "home"
              }
              as={Link}
              to="/"
            >
              <Icon name="home" />
              Home
            </Menu.Item>
            <Menu.Item
              name="Users"
              as={Link}
              onClick={(e, { name }) => {
                handleItemClick(e, name);
                setVisible(false);
              }}
              active={activeItem === "Users"}
              to="/users"
            >
              <Icon name="users" />
              Users
            </Menu.Item>
            <Menu.Item
              name="Threads"
              as={Link}
              onClick={(e, { name }) => {
                handleItemClick(e, name);
                setVisible(false);
              }}
              active={activeItem === "Threads"}
              to="/threads"
            >
              <Icon name="clipboard outline" />
              Threads
            </Menu.Item>
            <Menu.Item
              name="Profile"
              as={Link}
              onClick={(e, { name }) => {
                handleItemClick(e, name);
                setVisible(false);
              }}
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
      )}
    </>
  );
}
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}
