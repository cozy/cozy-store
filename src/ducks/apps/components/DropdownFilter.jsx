import React, { Component } from 'react'

import SelectBox from 'cozy-ui/react/SelectBox'
import Icon from 'cozy-ui/react/Icon'

const SmallArrow = () => (
  <Icon
    className="sto-sections-dropdown-icon"
    icon="small-arrow"
    color="#95999D"
    width={16}
    height={16}
  />
)

export class DropdownFilter extends Component {
  constructor(props) {
    super(props)
    this.onSelectChange = this.onSelectChange.bind(this)
    this.getDefaultOption = this.getDefaultOption.bind(this)
  }

  onSelectChange(option) {
    // reset query
    const { pushQuery } = this.props
    switch (option.value) {
      case 'all':
        return pushQuery()
      case 'konnectors':
        return pushQuery('type=konnector')
      case 'webapps':
        return pushQuery('type=webapp')
      default:
        return pushQuery(`category=${option.value}`)
    }
  }

  getDefaultOption(options = []) {
    const queryElements = this.props.query.match(/^\?([^=]*)=([^&/]*).*/)
    if (!queryElements) return options.find(op => op.value === 'all')
    switch (queryElements[2]) {
      case 'webapp':
        return options.find(op => op.value === 'webapps')
      case 'konnector':
        return options.find(op => op.value === 'konnectors')
      default: {
        const defaultOp = options.find(op => op.value === queryElements[2])
        if (defaultOp) {
          return defaultOp
        } else {
          console.error('No default option for select found')
          return null
        }
      }
    }
  }

  render() {
    const { options } = this.props
    const defaultOption = this.getDefaultOption(options)
    return (
      <div className="sto-sections-dropdown">
        <SelectBox
          options={options}
          onChange={this.onSelectChange}
          defaultValue={defaultOption}
          components={{
            DropdownIndicator: SmallArrow
          }}
          isSearchable={false}
        />
      </div>
    )
  }
}

export default DropdownFilter
