import React from "react";
import logo from "../src/assets/logo.svg";
import background_pattern from "../src/assets/pattern.png";
import styled from "styled-components";
import AsyncSelect from "react-select/async";
import ReactTimeAgo from "react-time-ago";
import "./App.css";
import { Container } from "reactstrap";

// load options using API call
const loadOptions = (inputValue) => {
  return fetch(
    `https://hn.algolia.com/api/v1/search?query=${inputValue}&tags=story`
  )
    .then((response) => response.json())
    .then((data) => data.hits);
};

function App() {
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
            {props.data.num_comments} comments
          </span>
        </div>
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
    <ContentContainer fluid bg={background_pattern}>
      <Pattern src={background_pattern} />
      <Content className="col-10 col-md-8 col-lg-4">
        <div style={style.center}>
          <Logo src={logo} />
        </div>
        <MySelect />
      </Content>
    </ContentContainer>
  );
}

export default App;

// styled-components

const ContentContainer = styled(Container)`
  height: 100vh;
  padding-top: 15vh;
  font-family: "Poppins", sans-serif;
  background: #1a87c5;
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  z-index: 1;
`;

const Pattern = styled.img`
  position: absolute;
  top: 0;
  width: 100vw;
`;

const Logo = styled.img`
  margin-bottom: 1rem;
  height: 10vh;
  align-self: center;
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
  center: {
    display: "grid",
    placeItems: "center",
  },
};
