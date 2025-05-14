import * as icons from 'lucide-react';

/**
 * Get icon component by name from lucide-react library
 * @param {string} name - Name of the icon in PascalCase (e.g., 'FileText', 'ChevronDown')
 * @returns {React.Component} - Icon component or default fallback
 */
const getIcon = (name) => {
  if (!name) return icons.HelpCircle;

  // Get the icon from the icons object
  const Icon = icons[name];
  
  if (!Icon) {
    console.warn(`Icon "${name}" not found, using fallback`);
    return icons.HelpCircle;
  }
  
  return Icon;
};

export default getIcon;