import React, { useEffect, useReducer, useState } from "react";

import { validate } from "../../util/Validators";
import './Input.css';

const inputReducer = (state, action) => {
	switch ( action.type ){
		case 'CHANGE':
			return {
				...state,
				value: action.val,
				isValid: validate(action.val, action.validators)
			};
		case 'TOUCH': {
			return {
				...state,
				isTouched: true
			}
		}
		case 'AUTOCOMPLETE':
			return {
				...state,
				value: action.val,
				isValid: validate(action.val, action.validators)
			}
		default:
			return state;
	}
}

/* Main function */
const Input = (props) => {
	const [inputState, dispatch] = useReducer(inputReducer, {
		value: props.initialValue || '',
		isValid: props.initialValid || '',
		isTouched: false
	});

	const { id, onInput } = props;
	const { value, isValid } = inputState;
	useEffect(() => {
		onInput(id, value, isValid)
	}, [id, onInput, value, isValid])

	// Email dropdown autocomplete
	const atListArray = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com']
	const [hasAt, setHasAt] = useState(false);

	// Since useState is async, the value "emailValue" is a normal var
	// and storeEmailValue received emailValue to be saved behind the curtains
	// This state will be used to replace input value
	const [storeEmailValue, setStoreEmailValue] = useState("");


	// Run each time input is changed
	const changeHandler = event => {
		var emailValue = event.target.value
		setStoreEmailValue(emailValue);
		if (emailValue < 1) setHasAt(false);

		var numOfAts = 0;
		for (let letter of emailValue){

			if (letter === "@"){
				++numOfAts;
				if (numOfAts < 2){
					setHasAt(true);					
				}

			} else {
				setHasAt(false)
			}
		}

		dispatch({
			type: 'CHANGE',
			val: event.target.value,
			validators: props.validators
		})
	};

	// Autocomplete email if dropdown item is chosen
	const handleAtList = (value) => {
		dispatch({
			type: 'AUTOCOMPLETE',
			val: storeEmailValue + value,
			validators: props.validators
		})
		setHasAt(false);
	}

	const touchHandler = () => {
		dispatch({
			type: 'TOUCH'
		})
	}

	const element =
		props.element === 'input' ? (
				<div>
					<input 
						id={props.id} 
						type={props.type} 
						placeholder={props.placeholder} 
						onChange={changeHandler}
						onBlur={touchHandler}
						value={inputState.value}
					/>
					{hasAt && props.enableAtList ? (
						<ul className="at-list">
							{atListArray.map((e) => {
								return <li key={Math.random()} onClick={() => {handleAtList(e)}}>{`${e}`}</li>
							})}
						</ul>
					) : null}
					
				</div>

			) : (
				<textarea 
					id={props.id} 
					rows={props.rows || 3}
					onBlur={touchHandler}
					onChange={changeHandler}
					value={inputState.value}/>
			);

	return (
		<div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
			<label htmlFor={props.id}>{props.label}</label>
			{element}
			{!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
		</div>
	)
}

export default Input;