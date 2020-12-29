import React from 'react'

import './RoleSelector.css'


class RoleSelector extends React.Component {
    constructor(props) {
        super(props)

    }

    onChange = (event) => {
        const { tanks, dps, healers} = this.props
        const newState = {tanks, dps, healers}
        newState[event.target.name] = !newState[event.target.name]
        this.props.filterRole(newState)
    }

    render = () => {
        return (
            <div className="roleSelector">
                <label>
                    <span>Tank:</span>
                    <input
                        name="tanks"
                        type="checkbox"
                        checked={this.props.tanks}
                        onChange={this.onChange} />
                </label>
                <label>
                    <span>DPS:</span>
                    <input
                        name="dps"
                        type="checkbox"
                        checked={this.props.dps}
                        onChange={this.onChange} />
                </label>
                <label>
                    <span>Heal:</span>
                    <input
                        name="healers"
                        type="checkbox"
                        checked={this.props.healers}
                        onChange={this.onChange} />
                </label>
            </div>
        );
    }
}

export default RoleSelector;
