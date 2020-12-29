import React, {Component} from 'react'

import LoadLogForm from './components/LoadLogForm'
import PlayerTable from './components/PlayerTable';
import FightSelector from './components/FightSelector';
import RoleSelector from "./components/RoleSelector";

import './App.css'

import background from './assets/background.png'
import HelpModal from "./components/HelpModal";

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            selectedFightIndex: null,
            filteredPlayers: [],
            show: {tanks: true, dps: true, healers: true},
            showHelp: false,
        }
    }

    filterPlayers = (players, show) => {
        if (!players) {
            return []
        }
        return players.filter(({role}) => show[role])
    }

    loadData = (data) => {
        const selectedFightIndex = data.fights.length - 1
        let filteredPlayers = null
        if (selectedFightIndex >= 0) {
            filteredPlayers = this.filterPlayers(data.fights[selectedFightIndex].players, this.state.show)
        }
        this.setState({data, selectedFightIndex, filteredPlayers})
        window.history.pushState({code: data.code}, '', `?report=${data.code}`)
    }

    updateFilter = (show) => {
        const filteredPlayers = this.filterPlayers(this.state.data.fights[this.state.selectedFightIndex].players, show)
        this.setState({show, filteredPlayers})
    }

    selectFight = (selectedFightIndex) => {
        const filteredPlayers = this.filterPlayers(this.state.data.fights[selectedFightIndex].players, this.state.show)
        this.setState({selectedFightIndex, filteredPlayers})
    }

    showHelp = () => {
        this.setState({showHelp: true})
    }

    closeHelp = () => {
        this.setState({showHelp: false})
    }

    render = () => {
        const {data, selectedFightIndex, show} = this.state
        const loaded = this.state.data
        const invalid = loaded && !this.state.data.fights[this.state.selectedFightIndex]
        return (
            <div className="App" style={{backgroundImage: `url(${background})`}}>
                <header className="App-header">
                    <h2>Sapphiron Frost Resistance Counter</h2>
                    <div className="credits">Made by <span className="veggie"> Veggie</span>-Zandalar Tribe</div>
                    <div>
                        <LoadLogForm loadData={this.loadData}/>
                        <div className="howTo" onClick={this.showHelp}>need help?</div>
                    </div>
                    <div>
                        <FightSelector data={data} selectedFightIndex={selectedFightIndex}
                                       selectFight={this.selectFight}/>
                        {loaded && !invalid && <RoleSelector {...show} filterRole={this.updateFilter}/>}
                    </div>
                </header>

                {loaded && invalid && <div className="not-found">No Sapphiron fights were found in the given log</div>}

                {loaded && !invalid &&
                <PlayerTable players={this.state.filteredPlayers}/>
                }
                <HelpModal showHelp={this.state.showHelp} closeHelp={this.closeHelp}/>
            </div>
        );
    }
}

export default App;
