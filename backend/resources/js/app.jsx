import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import FamilyTree from './components/FamilyTree';

const mountFamilyTree = () => {
    const rootElement = document.getElementById('family-tree-root');
    if (rootElement && !rootElement._reactRoot) {
        const initialMembers = JSON.parse(rootElement.dataset.members || '[]');
        const root = createRoot(rootElement);
        rootElement._reactRoot = root;
        root.render(<FamilyTree initialMembers={initialMembers} />);
    }
};

document.addEventListener('DOMContentLoaded', mountFamilyTree);
document.addEventListener('livewire:navigated', mountFamilyTree);
