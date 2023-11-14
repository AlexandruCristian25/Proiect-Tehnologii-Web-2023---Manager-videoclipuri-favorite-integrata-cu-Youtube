import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar } from '@material-ui/core';

function MeniuSite() {

    return (
        <Fragment>
            <AppBar style={{ position: 'relative' }}>
                <Toolbar>
                    <ul className='meniu_style'>
                        <Link to={"/"} className='link_style'>
                            <li>Artists</li>
                        </Link>

                        <Link to={"/NewArtist"} className='link_style'>
                            <li>New artist</li>
                        </Link>

                    </ul>

                </Toolbar>
            </AppBar>
        </Fragment >);

}

export default MeniuSite;