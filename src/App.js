import React from "react";
import logo from "../src/assets/logo.svg";
import background_pattern from "../src/assets/background-pattern.svg";
import styled from "styled-components";
import AsyncSelect from "react-select/async";
import ReactTimeAgo from "react-time-ago";
import "./App.css";
import { result } from "lodash";

// load options using API call
const loadOptions = (inputValue) => {
  return fetch(
    `http://hn.algolia.com/api/v1/search?query=${inputValue}&tags=story/`
  )
    .then((response) => response.json())
    .then((data) => data.hits);
};

function App() {
  const [results, setResults] = React.useState({});

  const Option = ({ innerRef, innerProps, ...props }) => {
    return (
      //optionally you can replace this parent div with a touchable opacity button, and remove the button
      <SearchResults
        ref={innerRef}
        {...innerProps}
        onClick={(e) => {
          e.preventDefault();
          window.location.href = `${props.data.url}`;
        }}
      >
        <div>
          <span>{props.data.title}</span>
          <br />
          <span style={style.url}>{props.data.url}</span>
          <br />
          <span style={style.info}>
            {props.data.points} points | {props.data.author} |{" "}
            <ReactTimeAgo date={props.data.created_at} locale="en-US" /> |{" "}
            {props.data.comments} comments
          </span>
        </div>

        {/* <button
          onClick={(e) => {
            console.log(props.data);
            setResults(props.data);
          }}
        >
          <p>Invite</p>
        </button> */}
      </SearchResults>
    );
  };

  const MySelect = () => {
    const customOptions = {
      Option: ({ innerRef, innerProps, ...props }) => (
        <Option {...{ innerRef, innerProps, ...props }} />
      ),
    };
    return (
      <AsyncSelect
        loadOptions={loadOptions}
        components={customOptions}
        placeholder={<div>Type here to search</div>}
        noOptionsMessage={() => "there are no results yet"}
      />
    );
  };

  return (
    <Container>
      <Background src={background_pattern} />
      <Content className="col-4">
        <Logo src={logo} />
        <MySelect />
      </Content>
    </Container>
  );
}

export default App;

// styled-components

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  padding-top: 15vh;
  font-family: "Poppins", sans-serif;
  background: #1a87c5;
  display: flex;
  justify-content: center;
`;
const Background = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;

const Content = styled.div`
  z-index: 1;
`;

const Logo = styled.img`
  margin-bottom: 1rem;
`;

const SearchResults = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: black;
  padding: 5px 20px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
`;

const style = {
  url: {
    fontSize: "12px",
    color: "blue",
  },
  info: {
    fontSize: "12px",
    color: "gray",
  },
};
