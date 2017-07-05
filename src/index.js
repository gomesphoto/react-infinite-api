import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import styled from 'styled-components';
import scrollMonitor from 'scrollmonitor';
import { loremApi, parseData } from './helpers';

const StyledList = styled.ul`
  text-align: center;
  width: 80%;
  height: 400px;
  padding: 0;
  margin: 200px auto;
  overflow: scroll;
  border: 1px solid black;
  list-style: none;
  font-family: sans-serif;
`;

const StyledItem = styled.li`
  font-size: 30px;
  border-bottom: 1px solid black;
`;

let containerMonitor;
let containerElement;
let watcherElement;
let watcherRegister = null;

class App extends Component {
  state = {
    items: []
  }

  componentDidMount = () => {
    containerMonitor = scrollMonitor.createContainer(containerElement);
    this.apiTrigger();
  }

  apiTrigger = () =>
    loremApi(30)
    .then(({ data }) => {
      const moreItems = parseData(data)
      const items = [ ...this.state.items, ...moreItems ];
      this.setState({ items })
    })
    .then(() => {
      if (watcherRegister) {
        watcherRegister.destroy()
      }
    })
    .then(() => {
      watcherRegister = containerMonitor.create(watcherElement)
      watcherRegister.enterViewport(this.apiTrigger);
    });

  render = () => (
      <StyledList innerRef={x => containerElement = x}>
        {this.state.items.map((item, idx) => (<StyledItem key={`lorem-${idx}`} innerRef={x => (idx === this.state.items.length - 6) ? watcherElement = x : null}>{`${idx} ${item}`}</StyledItem>))}
      </StyledList>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
