import React from "react";
//import faker from "faker";
//import _ from "lodash";
import { Dropdown, Icon, Segment } from "semantic-ui-react";
const DropdownExampleDivider = ({
  filter,
  setFilter,
  loading,
  threads: posts,
}) => {
  let temp = [];
  if (posts) {
    for (let index = 0; index < posts.length; index++) {
      const element = posts[index];
      if (
        element.threadName !== "" &&
        !temp.find((t) => element.threadName === t)
      ) {
        temp.push(element.threadName);
      }
    }
  }
  return (
    <Segment floated="left" textAlign="left" className="filter">
      <Dropdown
        loading={loading}
        text="Filter"
        icon="filter"
        floating
        button
        className="icon"
      >
        <Dropdown.Menu>
          <Dropdown.Header
            icon="clipboard outline"
            content="Filter by Threads"
          />
          <Dropdown.Divider />
          {posts &&
            temp.map((t) => (
              <Dropdown.Item
                onClick={() => {
                  if (!filter.find((tname) => tname === t)) {
                    filter.push(t);
                    setFilter([...filter]);
                  }
                }}
              >
                {t}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown>
      {filter.map((f) => (
        <button
          style={{ marginTop: "5px" }}
          onClick={() => {
            filter = filter.filter((e) => e !== f);
            setFilter([...filter]);
          }}
          className=" threadbtn ui button"
        >
          {f}
          <Icon name="close" />
        </button>
      ))}
    </Segment>
  );
};

export default DropdownExampleDivider;
