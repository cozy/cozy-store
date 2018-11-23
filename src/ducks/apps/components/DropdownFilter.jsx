import React, { Component } from 'react'

import SelectBox from 'cozy-ui/transpiled/react/SelectBox'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { APP_TYPE } from 'ducks/apps'

const SmallArrow = () => (
  <Icon
    className="sto-sections-dropdown-icon"
    icon="small-arrow"
    color="#95999D"
    width={16}
    height={16}
  />
)

function findOption(value, type, optionsList) {
  if (type) {
    return optionsList.find(op => op.value === value && op.type === type)
  } else {
    return optionsList.find(op => op.value === value)
  }
}

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
        return pushQuery(`type=${APP_TYPE.KONNECTOR}`)
      default:
        return pushQuery(`type=${option.type}&category=${option.value}`)
    }
  }

  getDefaultOption(options = []) {
    const params = new URLSearchParams(this.props.query)
    const typeParam = params.get('type')
    const categoryParam = params.get('category')
    let option
    if (typeParam === APP_TYPE.KONNECTOR && !categoryParam) {
      return findOption('konnectors', null, options)
    } else if (!typeParam && !categoryParam) {
      return findOption('all', null, options)
    }
    option = findOption(categoryParam, typeParam, options)
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
          classNamePrefix="sto-sections-select"
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
