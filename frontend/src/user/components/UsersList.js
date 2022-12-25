/* Native import */
import React from "react";

/* Custom components import */
import './UsersList.scss';
import UserItem from "./UserItem";

const UsersList = (props) => {
	if (props.items.length === 0){
		return (
			<div className="center">
				<h2>No users found.</h2>
			</div>
		)
	}

	return (
		<ul className="users-list">
			{/* Iterate over props.items */}
			{props.items.map((user) => {
				/* Pass received item data as props to UserItem */
				return <UserItem 
							key={user.id} 
							id={user.id} 
							image={user.image} 
							name={user.name} 
							placeCount={user.places.length}
						/>
			})}
		</ul>
	)
}

export default UsersList;