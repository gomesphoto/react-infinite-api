import ReactDOM from 'react-dom';
import React, { Component } from 'react'
import styled from 'styled-components'
import scrollMonitor from 'scrollmonitor'
import { loremApi, parseData } from './helpers'

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
`

const StyledItem = styled.li`
  font-size: 30px;
  border-bottom: 1px solid black;
`
let containerMonitor

const bindContainerMonitor = () => {
  const containerElement = document.getElementById('listContainer')
  containerMonitor = scrollMonitor.createContainer(containerElement)
  return containerMonitor
}

let watcherTargetIndex = 24;
let watcherRegister = null

class App extends Component {
  state = {
    items: [],
    hasMore: true
  }

  componentDidMount = () => {
    bindContainerMonitor()
    this.callApi()
  }

  callApi = () =>
    loremApi(30).then(({ data }) => this.loadMore(data)).then(this.applyScrollMonitor)

  loadMore = (data) => {
    const moreItems = parseData(data)
    if (this.state.items > 100) {
      this.setState({ hasMore: false })
    } else {
      const items = [ ...this.state.items, ...moreItems ];
      this.setState({ items })
    }
  }

  onEnterViewport = () => {
    this.callApi()
    watcherRegister.destroy()
  }

  applyScrollMonitor = () => {
    var listElements = document.getElementsByClassName('list-item')

    console.log('APPLYSCROLLMONITOR / addEventListener to index', watcherTargetIndex)
    const watcher = containerMonitor.create(listElements[watcherTargetIndex])
    watcher.enterViewport(this.onEnterViewport)
    watcherTargetIndex += 25
    watcherRegister = watcher
    }

  renderItems = items =>
    items.map((item, idx) => (
      <StyledItem key={`lorem-${idx}`} className="list-item">{`${idx} ${item}`}</StyledItem>
    ))

  render = () => (
    <div>
      <StyledList id="listContainer">
        {this.renderItems(this.state.items)}
      </StyledList>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
