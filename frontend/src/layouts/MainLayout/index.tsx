import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import { Switch } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import Alerts from '../../components/Alerts';

interface MainLayoutProps {}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <>
            <TopBar />
            <Toolbar />
            <Switch>{children}</Switch>
            <Alerts />
        </>
    );
};

export default MainLayout;
