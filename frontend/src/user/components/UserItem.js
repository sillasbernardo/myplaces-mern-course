/* Native import */
import React from "react";
import { Link } from 'react-router-dom';

/* Custom components import */
import './UserItem.scss';
import Avatar from "../../shared/components/UIElements/Avatar";

const UserItem = (props) => {
	return (
		<li className="user-item center">
			<Link to={`/${props.id}/places`} style={{textDecoration: 'none', color: 'black'}}>
				<div className="user-item__content">
					<div className="user-item__image">
						<Avatar 
							image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
							alt={props.name}
						/>
					</div>
					<div className="user-item__info">
						<h2>{props.name}</h2>
						<h3>{props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}</h3>
					</div>
				</div>
			</Link>
		</li>
	)
}

export default UserItem;