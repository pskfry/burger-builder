import React from 'react';
import classes from './Logo.css';
import LogoPng from '../../assets/images/burger-logo.png';

const Logo = (props) => (
    <div className={classes.Logo}>
        <img src={LogoPng} alt='logo' />
    </div>
);

export default Logo;