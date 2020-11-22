import React from 'react'
import './Button.css'
import { Link } from 'react-router-dom'

const STYLES = ['btn--primary', 'btn--outline']

const SIZES = ['btn--medium', 'btn--large']

const FILL = ['btn--fill']

export const Button = ( { children, type, onClick, buttonStyle, buttonSize, isSelected, linkTo }) =>{
	const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];

	const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

	const checkFill = isSelected ? FILL[0] : FILL[0];

	if(linkTo==='/sign_up')
	{
		return (
			<Link to='/sign_up' className='btn-mobile'>
				<button className={`btn ${checkFill} ${checkButtonStyle} ${checkButtonSize} `} onClick={onClick} type={type}>{children}
				</button>	
			</Link>	
		);
	}
	
	else
	{
		return (
			
				<button className={`btn ${checkFill} ${checkButtonStyle} ${checkButtonSize} `} onClick={onClick} type={type}>{children}
				</button>
		);
	}
	
};