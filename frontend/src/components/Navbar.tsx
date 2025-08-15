// src/components/Navbar.tsx
import React from 'react';
import { Section, Theme } from '../types'; // Assuming types are in types.ts

// Define LucideIcon as a type for any Lucide React component
import { IconType } from 'lucide-react';

interface NavbarProps {
  sections: Array<{
    id: Section;
    icon: IconType; // Use IconType from lucide-react for correct typing
    label: string;
  }>;
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  theme: Theme;
}

const Navbar: React.FC<NavbarProps> = ({ sections, activeSection, onSectionChange, theme }) => {
  return (
    <nav className={`rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex">
        {sections.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors
              ${activeSection === id
                ? theme === 'dark'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-blue-600 border-b-2 border-blue-600'
                : theme === 'dark'
                  ? 'text-gray-400 hover:text-blue-400'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;