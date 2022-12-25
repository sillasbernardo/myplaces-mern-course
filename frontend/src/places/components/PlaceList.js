import React from "react";

import PlaceItem from "./PlaceItem";
import './PlaceList.scss';
import Button from "../../shared/components/FormElements/Button";

const PlaceList = (props) => {
	if (props.items.length === 0){
		return <div className="place-list center">
			<h2>No places found. Maybe create one?</h2>
			<Button to="/places/new">Share Place</Button>
		</div>
	}

	return (
		<ul className="place-list">
			{props.items.map(place => 
				<PlaceItem 
					key={place.id} 
					id={place.id} 
					image={place.image} 
					title={place.title}
					description={place.description}
					address={place.address}
					creatorId={place.creator}
					coordinates={place.location}
					onDelete={props.onDeletePlace}
					homepageStyle={props.homepageStyle}
				/>
			)}
		</ul>
	)
}

export default PlaceList;