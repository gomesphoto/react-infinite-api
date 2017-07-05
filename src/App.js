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
  console.log('bindContainerMonitor');
  const containerElement = document.getElementById('listContainer')
  containerMonitor = scrollMonitor.createContainer(containerElement)
  return containerMonitor
}

let watcherTargetIndex = 24;
let watchers = []

export default class App extends Component {
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
    console.log( 'WATCHER entered viewport / load more items' )
    this.callApi()
  }

  onExitViewport = () => {
    console.log( 'WATCHER left viewport / removeEventListener' )
    watchers[0].destroy()
    watchers.shift()
  }

  applyScrollMonitor = () => {
    var listElements = document.getElementsByClassName('list-item')

    console.log('APPLYSCROLLMONITOR / addEventListener to index', watcherTargetIndex)
    const watcher = containerMonitor.create(listElements[watcherTargetIndex])
    watcherTargetIndex += 25

    watcher.enterViewport(this.onEnterViewport)
    watcher.exitViewport(this.onExitViewport)

    watchers.push(watcher)
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
