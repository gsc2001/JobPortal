import React from 'react';
import { Switch } from 'react-router-dom';

interface MainLayoutProps {}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div>
            <h1>Main Layout</h1>
            <Switch>{children}</Switch>
        </div>
    );
};

export default MainLayout;
