import React from 'react'

import ReactModal from 'react-modal'

import ImageHelp from '../assets/help.png'

const HelpModal = (props) =>
    <ReactModal
        isOpen={props.showHelp}
        contentLabel="Help"
        className="HelpModal"
        onRequestClose={props.closeHelp}
        overlayClassName="Overlay"
    >
        <div>
            <p>
                Copy and paste ID or the entire URL of your report from <a className="questLink" target="_blank"
                                                                           href="https://classic.warcraftlogs.com/">Warcraft
                Logs</a> into the app
                <div className="centerDiv">
                    <div>
                        <img className="helpImage" src={ImageHelp}/>
                    </div>
                </div>
            </p>
            <p>
                <h3>
                    Columns
                </h3>
                <ul>
                    <li>
                        <em>Name</em> - Name of the player. Click to open player's summary from the selected fight on
                        warcraftlogs
                    </li>
                    <li>
                        <em>Gear FrR</em> - Amount of frost resistance the player has from <strong>gear</strong>. Keep
                        in mind that some classes have access to self-buffs and talents that can increase their FrR,
                        e.g. mages can get up to 25 extra FrR.
                        <br/>You can hover over this number to see the list of FrR items that player had equipped during
                        the fight. Values of some items "of Frost Resistance" may be off by 1.
                    </li>
                    <li>
                        <em>#NaxxEpics</em> - Number of Naxxramas quality epic (purple) items the player had in the
                        fight.
                    </li>
                    <li>
                        <em>#Greens</em> - Number of uncommon quality (green) items the player had fight.
                    </li>
                    <li>
                        <em>Ring?</em> - Shows whether the player had ring Ramaladni's Icy Grasp, reward from quest <a
                        className="questLink" target="_blank"
                        href="https://classic.wowhead.com/quest=9229/the-fate-of-ramaladni">The Fate of Ramaladni</a>.
                        Requires 1 Frozen Rune.
                    </li>
                    <li>
                        <em>Pants?</em> - Shows whether the player had any pants that are reward from quest <a
                        className="questLink" target="_blank"
                        href="https://classic.wowhead.com/quest=9232/the-only-song-i-know">The Only Song I know</a>.
                        Requires 2 Frozen Runes.
                    </li>

                </ul>
            </p>
            <p>
                <h3>
                    Feedback
                </h3>
                <p>Feel free to send me any suggestions or bug reports on Discord - <em>Jožo#9796</em></p>
            </p>
            <div className="centerDiv">
                <div>
                    <button onClick={props.closeHelp}>Close</button>
                </div>
            </div>
        </div>
        < /ReactModal>

            export default HelpModal
