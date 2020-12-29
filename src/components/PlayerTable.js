import React from 'react'

import DataTable, {createTheme} from 'react-data-table-component'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'

import './PlayerTable.css'

import QuestionMark from '../assets/question_mark.jpg'
import PantsCloth from '../assets/pants_cloth.jpg'
import PantsLeather from '../assets/pants_leather.jpg'
import PantsMail from '../assets/pants_mail.jpg'
import PantsPlate from '../assets/pants_plate.jpg'
import Ring from '../assets/ring.jpg'

const colorText = '#d4ebe8'

const colorCritical = '#f00'
const colorBad = '#f90'
const colorWarning = '#ff0'
const colorOkay = '#0f0'

createTheme('sapphiron', {
    text: {
        primary: colorText,
        secondary: '#7688a1',
        hover: '#fff',
    },
    background: {
        default: '#101218',
    },
    context: {
        background: '#cb4b16',
        text: '#FFFFFF',
    },
    divider: {
        default: '#45494d',
    },
    action: {
        button: 'rgba(0,0,0,.54)',
        hover: 'rgba(0,0,0,.08)',
        disabled: 'rgba(0,0,0,.12)',
    },
    sortFocus: {
        default: '#fff',
    },
    striped: {
        default: '#0d1a23',
        text: '#d7f1ee',
    },
    highlightOnHover: {
        default: '#0a1c34',
        text: 'rgba(255,255,255,0.87)',
    },
});


const customStyles = {
    rows: {
        style: {
            minHeight: '24px', // override the row height
        }
    },
    headCells: {
        style: {
            paddingLeft: '4px', // override the cell padding for head cells
            paddingRight: '4px',
        },
    },
    cells: {
        style: {
            paddingLeft: '4px', // override the cell padding for data cells
            paddingRight: '4px',
        },
    },
};

const classColors = {
    Druid: '#FF7C0A',
    Hunter: '#AAD372',
    Mage: '#3FC7EB',
    Paladin: '#F48CBA',
    Priest: '#FFFFFF',
    Rogue: '#FFF468',
    Shaman: '#0070DD',
    Warlock: '#8788EE',
    Warrior: '#C69B6D',
}

const pantsImages = [QuestionMark, PantsCloth, PantsLeather, PantsMail, PantsPlate]
const ringImages = [QuestionMark, Ring]

const PlayerLink = styled.a`
  border: none;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }`

const ItemIcon = styled.img`
    width: 16px;
    height: 16px;
    margin: 0px;
    padding: 0px;
`

const qualityColors = {
    Enchant: colorText,
    Uncommon: '#1eff00',
    Rare: '#0070dd',
    Epic: '#a335ee',
}

const getEpicsColor = (x) => {
    return [colorCritical,colorBad,colorWarning][x] || colorText;
}

const getGreensColor = (x) => {
    return [colorText, colorWarning, colorWarning, colorBad,colorBad][x] || colorCritical;
}

const getFrrColor = (x) => {
    if (x < 70) {
        return colorCritical
    }
    if (x < 110) {
        return colorBad
    }
    if (x < 150) {
        return colorWarning
    }
    return colorText
}

const columns = [
    {
        name: 'Name',
        selector: 'name',
        cell: row => <div>
            <PlayerLink
                href={row.link}
                target='_blank'
                style={{
                    color: classColors[row.type],
                }}
            >
                {row.name}
            </PlayerLink>
        </div>,
        sortable: true,
    },
    {
        name: 'Gear FrR',
        selector: 'frr',
        sortable: true,
        cell: row => <div
            data-for="frr"
            data-tip={row.name}
            style={{color: getFrrColor(row.frr), fontWeight: 'bolder'}}
        >
            {row.random ? '~' : ''}{row.frr}
        </div>
    },
    {
        name: '#NaxxEpics',
        selector: 'epics',
        sortable: true,
        cell:  row => <div style={{color: getEpicsColor(row.epics)}}>{row.epics}</div>
    },
    {
        name: '#Greens',
        selector: 'greens',
        sortable: true,
        cell:  row => <div style={{color: getGreensColor(row.greens)}}>{row.greens}</div>
    },
    {
        name: 'Ring?',
        selector: 'ring',
        sortable: true,
        cell: row => <div>
            <ItemIcon src={ringImages[row.ring]}/>
        </div>,
    },
    {
        name: 'Pants?',
        sortable: true,
        selector: 'pants',
        cell: row => <div>
            <ItemIcon src={pantsImages[row.pants]}/>
        </div>,
    },
];

class PlayerTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    calculateGearTooltip = (name) => {
        const gear = (this.props.players.find(player => player.name === name) || {}).gear || []
        if (gear.length == 0) {
            return '🤔'
        }
        return <div>
            {gear.map(this.getItemDescription)}
        </div>
    }

    getItemDescription = (item) => {
        return <div>
            <div style={{color: qualityColors[item.quality], display: 'inline-block'}}>{item.name}</div>
            <div style={{display: 'inline-block', float: 'right', paddingLeft:10}}>{item.random ? '±' : ''}{item.frr}</div>

        </div>
    }

    render = () => {
        return (
            <div>
                <DataTable
                    theme={'sapphiron'}
                    highlightOnHover={true}
                    noHeader={true}
                    data={this.props.players}
                    columns={columns}
                    customStyles={customStyles}
                    striped={true}
                />
                <ReactTooltip
                    effect="solid"
                    id="frr"
                    getContent={this.calculateGearTooltip}
                    backgroundColor="black"
                />
            </div>
        );
    }
}

export default PlayerTable;
