import React, { useState } from "react";
import { Link } from 'react-router-dom';

import MainHeader from "./MainHeader";
import './MainNavigation.scss';
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";

const MainNavigation = (props) => {
	
	/* Handle drawer */
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);
	const handleDrawer = (drawerState) => {
		drawerState ? setDrawerIsOpen(true) : setDrawerIsOpen(false);
	}

	return (
		<React.Fragment>
			{drawerIsOpen && <Backdrop onClick={() => handleDrawer(false)} />}
			<SideDrawer show={drawerIsOpen} onClick={() => handleDrawer(false)}>
				<nav className="main-navigation__drawer-nav">
					<NavLinks />
				</nav>
			</SideDrawer>
			<MainHeader>
				<button onClick={() => handleDrawer(true)} className="main-navigation__menu-btn">
					<span/>
					<span/>
					<span/>
				</button>
				<h1 className="main-navigation__title">
					<Link to="/">My<span>Places</span></Link>
				</h1>
				<nav className="main-navigation__header-nav">
					<NavLinks />
				</nav>
			</MainHeader>
		</React.Fragment>
	)
}

export default MainNavigation;