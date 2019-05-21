import React, { Component } from 'react'

import SelectBox from 'cozy-ui/react/SelectBox'
import Icon from 'cozy-ui/react/Icon'
import PropTypes from 'prop-types'

const SmallArrow = () => (
  <Icon
    className="sto-sections-dropdown-icon"
    icon="small-arrow"
    color="var(--coolGrey)"
    width={16}
    height={16}
  />
)

/**
 * Renders a generic dropdown
 */
export class DropdownFilter extends Component {
  render() {
    const { options, defaultValue } = this.props
    return (
      <div className="sto-sections-dropdown">
        <SelectBox
          classNamePrefix="sto-sections-select"
          options={options}
          onChange={this.props.onChange}
          defaultValue={defaultValue}
          components={{
            DropdownIndicator: SmallArrow
          }}
          isSearchable={false}
          fullwidth
        />
      </div>
    )
  }
}

DropdownFilter.propTypes = {
  options: PropTypes.array.isRequired,
  defaultValue: PropTypes.object
}

export default DropdownFilter
