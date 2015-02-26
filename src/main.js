var $ = require('jquery')
var virt = require('./virt')
var tags = virt.tags

class Hello extends virt.View {
  render(props) { 
    return tags.div({}, [
      tags.p({}, "Hello pdxjs"),
      tags.p({}, new Date().toISOString()),
      tags.p({}, "up there ^"),
    ])
  }
}

var flux = {
  word(component, s) {
    if (s === 'duck') {
      virt.render(component.render({ color: 'green', secret: true }), document.getElementById("example"))
    }
    else {
      virt.render(component.render({ secret: false }), document.getElementById("example"))
    }
  }
}

class SecretWord extends virt.View {
  render(props) {
    var color = props.color || 'white'
    var self = this
    return tags.div({ css: { 'background-color': color } }, [
      tags.p({}, 'Write something:'),
      virt.createElement('input', { type: 'text' }, [], {
        'keyup': function(event) { flux.word(self, $(this).val()) }
      }),
      tags.p({}, 'That was the secret word!')
    ])
  }
}

var secret = new SecretWord()

flux.word(secret, '')

