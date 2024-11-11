import './SlidingPanelLayout.scss';
import React, { ReactNode } from "react";

interface SlidingPanelLayoutProps {
    title: string;
    toggle: () => void;
    isOpen: boolean;
    children: ReactNode;
}

export const SlidingPanelLayout: React.FC<SlidingPanelLayoutProps> = ({ title, toggle, isOpen, children }) => {
    return (
        <div className={`sliding-panel-layout ${isOpen ? 'open' : ''}`}>
            <div className="sliding-panel-layout__header">
                <p className="sliding-panel-layout__title">{title}</p>
                <button onClick={toggle} className="sliding-panel-layout__button-close">
                    <img src="src/assets/images/icon-cross.svg" alt="cross"/>
                </button>
            </div>
            <div className="sliding-panel-layout__content">
                {children}
            </div>
        </div>
    );
};
