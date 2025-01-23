import './SearchSlideLayout.scss';
import React from "react";
import {SlidingPanelLayout} from "../../layouts/SlidingPanelLayout/SlidingPanelLayout.tsx";

interface SearchSlideLayoutProps {
    isOpen: boolean;
    toggleSearch: () => void;
}

export const SearchSlideLayout : React.FC<SearchSlideLayoutProps> = ({ isOpen, toggleSearch }) => {
    return (
        <SlidingPanelLayout title={"SEARCH"} isOpen={isOpen} toggle={toggleSearch}>
            <input type="text" placeholder="Search..." />
        </SlidingPanelLayout>
    );
};