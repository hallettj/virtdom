var $ = require('jquery')

var currId = 0

function uniqId() {
  currId += 1
  return currId
}

exports.uniqId = uniqId


class View {
  render() { /* will be ovirridden */ }
}

function createElement(type, props, children, events) {
  if (typeof children == 'string') {
    children = [createText(children)]
  }
  return {
    type: type,
    props: props,
    children: children,
    events: events || []
  }
}

function createText(s) {
  return {
    type: 'text',
    content: s,
  }
}

var tags = {
  div: createElement.bind(null, 'div'),
  p: createElement.bind(null, 'p')
}

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
    console.log(elem, key, view.props[key])
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
    console.log('id', id)
    elem.attr('data-virtid', id)
  }
  $(document).on(`${eventType}.virtevent`, `[data-virtid="${id}"]`, handler)
}

exports.View = View
exports.createElement = createElement
exports.render = render
exports.tags = tags

class Hello extends View {
  render(props) {
    return tags.div({}, [
      tags.p({}, 'hello, pdxjs'),
      tags.p({}, new Date().toISOString()),
      tags.p({}, 'see above ^')
    ]);
  }
}

var flux = {};

class SecretWord extends View {
  render(props) {
    var color = props.color || 'white'
    var self = this
    return createElement('div', { css: {'background-color': color} }, [
      tags.p({}, 'Write something: '),
      createElement('input', {
        type: 'text'
      }, [],
      {
        keyup: function(event) { flux.word(self, $(this).val()) }
      }),
      tags.p({}, props.secret ? "That's the secret word!" : "")
    ])
  }
}

// var secret = new SecretWord()
// virt.render(secret.render({ secret: false }), document.getElementById('example'))

flux.word = function(component, s) {
  if (s === 'duck') {
    render(component.render({
      color: 'green', secret: true
    }), document.getElementById('example'))
  }
  else {
    render(component.render({ secret: false }), document.getElementById('example'))
  }
}

// var hello = new Hello()
// virt.render(hello, document.getElementById('example'))

// setInterval(() => virt.render(hello, document.getElementById('example')), 1000)

exports.Hello = Hello
exports.SecretWord = SecretWord
exports.flux = flux

