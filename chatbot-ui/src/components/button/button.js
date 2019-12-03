import React from 'react';
import styles from './button.css';

const Button = ({onClick, children}) => (
    <button type="button" className="Button" onClick={onClick}>{children}</button>
)
export default Button