import React from 'react'

import './FightSelector.css'


class FightSelector extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    onSelect = (event) => {
        this.props.selectFight(event.target.value)
    }

    render = () => {
        if (!this.props.data || !this.props.data.fights.length) {
            return <div/>
        }
        return (
            <div className="fightSelector">
                <label>
                    Select Fight:
                </label>
                <select value={this.props.selectedFightIndex} defaultValue={0} onChange={this.onSelect}>
                    {
                        this.props.data.fights.map(({name, start_time, end_time, bossPercentage}, index) => {
                            const time = Math.floor((end_time - start_time)/1000)
                            const timeString = `${Math.floor(time/60)}:${`0${(time % 60)}`.slice(-2)}`
                            return <option value={index} key={start_time} value={index}>{index + 1}. {name} {bossPercentage/100}% ({timeString})</option>
                        })
                    }
                </select>
            </div>
        );
    }
}

export default FightSelector;
