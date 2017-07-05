import React, { Component } from 'react'
import styled from 'styled-components'
import { loremApi } from './helpers/api'
import scrollMonitor from 'scrollmonitor'
import { parseData } from './helpers/utilities'

const StyledList = styled.ul`
  text-align: center;
  width: 80%;
  height: 400px;
  padding: 0;
  margin: 200px auto;
  overflow: scroll;
  border: 1px solid black;
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

let watcherIndex = 24;

console.log(containerMonitor);

export default class App extends Component {
  state = {
    items: [],
    hasMore: true
  }

  applyScrollMonitor = () => {
    var _this = this;
    const watchers = []
    var listElements = document.getElementsByClassName('list-item')

    const watcher = containerMonitor.create(listElements[watcherIndex])
    watcherIndex += 25

    watcher.enterViewport(function() {
      _this.callApi()
      console.log( 'I have entered the viewport' )
    })
    watcher.exitViewport(function() {
      console.log( 'I have left the viewport' )
      watchers[0].destroy()
      watchers.shift()
    })

    watchers.push(watcher)
    console.log(watchers);
    }

  callApi = () =>
    loremApi(30).then(({ data }) => this.loadMore(data)).then(this.applyScrollMonitor)

  componentDidMount = () => {

    bindContainerMonitor()
    console.log(containerMonitor);

    this.callApi()
  }

  loadMore = (data) => {
    const moreItems = parseData(data)
    if (this.state.items > 100) {
      this.setState({ hasMore: false })
    } else {
      const items = [ ...this.state.items, ...moreItems ];
      this.setState({ items })
    }
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
