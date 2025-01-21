import './SlidingPanelLayout.scss';
import React, { ReactNode } from "react";

/**
 * Props interface for the SlidingPanelLayout component
 * @interface
 */
interface SlidingPanelLayoutProps {
    /** The title displayed in the panel header */
    title: string;
    /** Function to toggle the panel open/closed state */
    toggle: () => void;
    /** Boolean indicating if the panel is currently open */
    isOpen: boolean;
    /** Content to be rendered inside the panel */
    children: ReactNode;
}

/**
 * A sliding panel component that can be toggled open and closed.
 * Provides a header with title and close button, and a content area for children.
 *
 * @component
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * return (
 *   <SlidingPanelLayout
 *     title="Settings"
 *     isOpen={isOpen}
 *     toggle={() => setIsOpen(!isOpen)}
 *   >
 *     <div>Panel content goes here</div>
 *   </SlidingPanelLayout>
 * );
 * ```
 */
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
