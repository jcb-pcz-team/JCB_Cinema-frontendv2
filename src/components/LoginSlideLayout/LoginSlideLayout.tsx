import './LoginSlideLayout.scss';
import { SlidingPanelLayout } from '../../layouts/SlidingPanelLayout/SlidingPanelLayout.tsx';
import React from "react";

interface LoginSlideLayoutProps {
    isOpen: boolean;
    toggleLogin: () => void;
}

export const LoginSlideLayout : React.FC<LoginSlideLayoutProps> = ({isOpen, toggleLogin}) => {
    return (
        <SlidingPanelLayout title={"LOGIN"} isOpen={isOpen} toggle={toggleLogin}>
            <h3>LOGIN</h3>
        </SlidingPanelLayout>
    );
};