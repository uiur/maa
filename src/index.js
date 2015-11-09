import React from 'react'
import Markdown from 'markdown-it'
import $ from 'jquery'
import withModifier from 'with-modifier-key'

const md = new Markdown({
  linkify: true,
  breaks: true
})

export default class Editor extends React.Component {
  constructor (props) {
    super()
    this.state = {
      value: ''
    }
  }

  componentDidMount () {
    $(document).on('click', 'p', (e) => {
      this.setState({
        open: true,
        boxValue: $(e.currentTarget).text(),
        index: $('.render-area').children().index(e.currentTarget)
      }, () => {
        setTimeout(() => {
          this.refs.inlineEditor.focus()
        }, 100)
      })
    })
  }

  onKey (e) {
    if (withModifier(e)) return

    if (e.key === 'Enter') {
      const blocks = this.state.value.split('\n\n')
      blocks[this.state.index] = this.state.boxValue

      this.setState({ open: false, value: blocks.join('\n\n') })
    }
  }

  render () {
    console.log(md.parse(this.state.value))
    console.log(this.state.value.split('\n\n'))
    console.log($(`<div>${md.render(this.state.value)}</div>`).children())
    return (
      <div>
        <textarea className='editor'
                  value={ this.state.value }
                  onChange={ (e) => this.setState({ value: e.target.value }) } />

        <div className='render-area'
             dangerouslySetInnerHTML={ { __html: md.render(this.state.value) } } />

        {
          this.state.open &&
            <textarea ref='inlineEditor'
                      value={ this.state.boxValue }
                      onChange={ (e) => this.setState({ boxValue: e.target.value }) }
                      onKeyPress={ this.onKey.bind(this) }/>
        }
      </div>
    )
  }
}
