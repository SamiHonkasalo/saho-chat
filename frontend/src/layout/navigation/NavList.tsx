import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';

import NavItem from './NavItem';

const NavList: React.FC = () => {
  return (
    <>
      <NavItem to="/" icon={<DashboardIcon />} primaryText="Home" />
    </>
  );
};

export default NavList;
