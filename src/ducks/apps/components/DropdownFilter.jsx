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
      default:
        return pushQuery(`category=${option.value}`)
    }
  }

  getDefaultOption(options = []) {
    const params = new URLSearchParams(this.props.query)
    const findOption = value => options.find(op => op.value === value)
    const typeParam = params.get('type')
    const categoryParam = params.get('category')
    let option
    if (typeParam === 'konnector' && !categoryParam) {
      option = findOption('konnectors')
    } else if (!typeParam) {
      if (!categoryParam) return findOption('all')
      option = findOption(categoryParam)
    }
    if (option) return option
    console.error('No default option for select found')
    return null
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
