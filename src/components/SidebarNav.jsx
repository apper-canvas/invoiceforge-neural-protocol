import { NavLink } from 'react-router-dom';
import getIcon from '../utils/iconUtils';

// Icons
const DashboardIcon = getIcon('LayoutDashboard');
const InvoiceIcon = getIcon('FileText');
const ClientsIcon = getIcon('Users');
const ProductsIcon = getIcon('Package');
const ReportsIcon = getIcon('BarChart');
const SettingsIcon = getIcon('Settings');
const HelpIcon = getIcon('HelpCircle');
const PlusIcon = getIcon('Plus');

const SidebarNav = ({ closeSidebar }) => {
  const navLinkClasses = ({ isActive }) => 
    isActive ? 'nav-link active' : 'nav-link';
    
  const handleNavClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  };
  
  return (
    <nav>
      <ul className="space-y-2">
        <li>
          <NavLink to="/" end className={navLinkClasses} onClick={handleNavClick}>
            <DashboardIcon className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/invoices" className={navLinkClasses} onClick={handleNavClick}>
            <InvoiceIcon className="w-5 h-5 mr-3" />
            <span>Invoices</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/clients" className={navLinkClasses} onClick={handleNavClick}>
            <ClientsIcon className="w-5 h-5 mr-3" />
            <span>Clients</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" className={navLinkClasses} onClick={handleNavClick}>
            <ProductsIcon className="w-5 h-5 mr-3" />
            <span>Products</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className={navLinkClasses} onClick={handleNavClick}>
            <ReportsIcon className="w-5 h-5 mr-3" />
            <span>Reports</span>
          </NavLink>
        </li>
      </ul>
      
      <div className="mt-8 mb-3 px-4 text-xs font-medium text-surface-500 dark:text-surface-400 uppercase">
        Quick Actions
      </div>
      
      <ul className="space-y-2">
        <li>
          <NavLink to="/invoices/new" className={navLinkClasses} onClick={handleNavClick}>
            <div className="flex items-center">
              <PlusIcon className="w-5 h-5 mr-3" />
              <span>New Invoice</span>
            </div>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default SidebarNav;