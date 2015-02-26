var $ = require('jquery')
var uniqId = require('./oven').uniqId

class View {
  render() { /* override this */ }
}

function createElement(nodeType, props, children, events) {
  if (typeof children === 'string') {
    children = [createText(children)]
  }
  return {
    type: nodeType,
    props: props,
    children: children,
    events: events || {}
  }
}

function createText(s) {
  return {
    type: 'text',
    content: s
  }
}

var tags = {
  a: createElement.bind(null, 'a'),
  div: createElement.bind(null, 'div'),
  p: createElement.bind(null, 'p')
}

exports.View = View
exports.createElement = createElement
exports.tags = tags

function render(view, mountpoint) {
  $(document).off('.virtevent')
  var parent = $(mountpoint)
  var elem = parent.children().first()
  renderHelper(view, elem, parent)
}

function renderHelper(view, elem, parent) {
  if (view instanceof View) {
    view = view.render()
  }
  if (view.type === 'text') {
    renderText(view, parent)
    return
  }
  elem = renderChanges(view, elem, parent)
  view.children.forEach((child, i) => {
    renderHelper(child, $(elem.children()[i]), elem)
  })
}

function renderChanges(view, elem, parent) {
  if (elem.length === 0) {
    elem = $(document.createElement(view.type))
    elem.appendTo(parent)
  }
  if (elem[0].nodeName.toLowerCase() != view.type.toLowerCase()) {
    elem = replace(view, elem)
  }
  Object.keys(view.props).forEach(key => {
    if (key == 'css') {
      elem.css(view.props[key])
    }
    else {
      elem.prop(key, view.props[key])
    }
  })
  Object.keys(view.events).forEach(
    key => attachEvent(key, view.events[key], elem)
  )
  return elem
}


function renderText(view, parent) {
  if (parent.text() !== view.content) {
    parent.text(view.content)
  }
}

function replace(view, elem) {
  var newElem = $(document.createElement(view.type))
  elem.replaceWith(newElem)
  return newElem
}

function attachEvent(eventType, handler, elem) {
  var id = elem.attr('data-virtid')
  if (!id) {
    id = uniqId()
    elem.attr('data-virtid', id)
  }
  $(document).on(`${eventType}.virtevent`, `[data-virtid="${id}"]`, handler)
}


exports.render = render
