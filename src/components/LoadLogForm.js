import React from 'react'

import frrData from '../data/frr-data'

import './LoadLogForm.css'

const pantsMap = {
    'Glacial Leggings': 1,
    'Icebane Leggings': 2,
    'Icy Scale Leggings': 3,
    'Polar Leggings': 4,
}

class LoadLogForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            error: null,
            loading: false
        }
        this.inputRef = React.createRef()

        window.onpopstate = (e) => {
            if (e.state) {
                this.loadReportFromUrl()
            }
        }
    }

    componentDidMount = () => {
        this.loadReportFromUrl()
    }

    loadReportFromUrl = () => {
        const code = new URLSearchParams(window.location.search).get('report')
        if (code) {
            this.inputRef.current.value = code
            this.onSubmit()
        }
    }

    onSubmit = async (e) => {
        if (e) {
            e.preventDefault()
        }
        this.setState({loading: true})
        let code = this.inputRef.current.value
        code = code.split('#')[0]
        if (code[code.length-1] == '/') {
            code = code.slice(0, -1)
        }
        const split = code.split('/')
        code = split[split.length-1]
        this.inputRef.current.value = code
        try {
            const responseLog = await fetch(`https://classic.warcraftlogs.com:443/v1/report/fights/${code}?translate=false&api_key=f256e2d5987d810f711d9cfd88df3504`)
            if (responseLog.ok) {
                const logData = await responseLog.json()
                const log = {name: logData.title, time: logData.start, owner: logData.owner, code}
                const fights = []
                log.fights = fights
                for (let i = 0; i < logData.fights.length; i++) {
                    const {start_time, end_time, boss, name, bossPercentage, id} = logData.fights[i]
                    if (boss !== 1119) {
                        continue
                    }
                    const response = await fetch(`https://classic.warcraftlogs.com:443/v1/report/tables/summary/${code}?start=${start_time}&end=${end_time}&translate=true&api_key=f256e2d5987d810f711d9cfd88df3504`)
                    if (response.ok) {
                        const report = await response.json()
                        const players = this.processPlayerData(report, code, id)
                        fights.push({players, start_time, end_time, name, bossPercentage})
                    } else {
                        this.setState({error: 'Error occured', loading: false})
                    }
                }
                this.setState({loading: false})
                this.props.loadData(log)
            } else {
                this.setState({error: 'Error occured', loading: false})
                return
            }
        } catch (e) {
            console.error(e)
            this.setState({error: 'Error occured', loading: false})
        }
    }

    processPlayerData = (fight, reportId, fightId) => {
        const players = [];
        ['tanks', 'dps', 'healers'].forEach(role => {
            fight.playerDetails[role].forEach(playerDetail => {
                const player = {
                    id: playerDetail.id,
                    name: playerDetail.name,
                    type: playerDetail.type,
                    epics: 0,
                    greens: 0,
                    frr: 0,
                    frrRandom: false,
                    ring: 0,
                    pants: 0,
                    role,
                    gear: [],
                    link: `https://classic.warcraftlogs.com/reports/${reportId}#fight=${fightId}&source=${playerDetail.id}`
                }
                if (playerDetail.type === 'Unknown') {
                    return
                }
                (playerDetail.combatantInfo.gear || []).forEach(({id, name: itemName, slot, permanentEnchant}) => {
                    const {frr = 0, quality, random, name} = frrData[id] || {}
                    player.frr += frr
                    if (frr > 0) {
                        player.gear.push(frrData[id])
                    }
                    if (slot === 14 && permanentEnchant === 1888) {
                        player.frr += 5
                        player.gear.push({name: 'Cloak Enchant', frr: 5, quality: 'Enchant'})
                    } else if (slot === 16 && permanentEnchant === 926) {
                        player.frr += 8
                        player.gear.push({name: 'Shield Enchant', frr: 8, quality: 'Enchant'})
                    } else if (permanentEnchant === 2682) {
                        player.frr += 10
                        player.gear.push({
                            name: slot === 6 ? 'Leg Enchant' : 'Head Enchant',
                            frr: 10,
                            quality: 'Enchant'
                        })
                    } else if (permanentEnchant === 2484 || permanentEnchant === 2488) {
                        player.frr += 5
                        player.gear.push({name: 'Shoulder Enchant', frr: 8, quality: 'Enchant'})
                    }
                    if (quality === 'Epic' && frr >= 20) {
                        player.epics++
                    } else if (quality === 'Uncommon') {
                        player.greens++
                    }
                    if (name === `Ramaladni's Icy Grasp`) {
                        player.ring = 1
                    }
                    if (slot === 6) {
                        player.pants = pantsMap[name] || 0
                    }
                    player.frrRandom = player.frrRandom || random
                })
                players.push(player)
            })
        })


        return players
    }

    render = () => {
        return (
            <form onSubmit={this.onSubmit} className="loadLogForm">
                <div>
                    <label>
                        Log ID or URL:
                    </label>
                    <input type="text" name="log id" ref={this.inputRef}/>
                    <input type="submit" disabled={this.state.loading}
                           value={this.state.loading ? "Loading..." : "Load"}/>
                </div>
                <div className="error">
                    {this.state.error}
                </div>
            </form>
        );
    }
}

export default LoadLogForm;
