import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { UserButton, useClerk } from '@clerk/clerk-react';
import { 
  LayoutDashboard, 
  Image, 
  Users, 
  MapPin, 
  Settings, 
  FileText,
  Home,
  MessageSquare,
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Briefcase
} from 'lucide-react';
import { cn } from './ui/utils';
import { Button } from './ui/button';
import { useState } from 'react';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/admin/dashboard', 
    icon: LayoutDashboard,
    children: []
  },
  { 
    name: 'Content', 
    icon: FileText,
    href: undefined,
    children: [
      { name: 'Hero Images', href: '/admin/hero-images', icon: Sparkles },
      { name: 'Gallery', href: '/admin/gallery', icon: Image },
      { name: 'Services', href: '/admin/services', icon: FileText },
      { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    ]
  },
  { 
    name: 'People', 
    icon: Users,
    href: undefined,
    children: [
      { name: 'Team Members', href: '/admin/team', icon: Users },
    ]
  },
  { 
    name: 'Locations', 
    href: '/admin/locations', 
    icon: MapPin,
    children: []
  },
  { 
    name: 'Job Positions', 
    href: '/admin/job-positions', 
    icon: Briefcase,
    children: []
  },
  { 
    name: 'Settings', 
    href: '/admin/settings', 
    icon: Settings,
    children: []
  },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Content', 'People']);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/sign-in');
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    );
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-50",
        isCollapsed ? "w-20" : "w-72"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo & Collapse Button */}
          <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-primary/10 flex-shrink-0">
            {!isCollapsed ? (
              <>
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
                >
                  <div className="p-2 bg-primary rounded-lg group-hover:scale-110 transition-transform">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-lg text-foreground block">Bina Admin</span>
                    <span className="text-xs text-muted-foreground">Content Management</span>
                  </div>
                </button>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 w-full">
                <button 
                  onClick={() => navigate('/')}
                  className="p-2 bg-primary rounded-lg hover:scale-110 transition-transform"
                >
                  <Home className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                {/* Parent Item */}
                {item.children && item.children.length > 0 ? (
                  <button
                    onClick={() => toggleSection(item.name)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                      'text-gray-700 hover:bg-gray-100',
                      isCollapsed && 'justify-center px-2'
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        {expandedSections.includes(item.name) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>
                ) : item.href ? (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                        isActive
                          ? 'bg-primary text-white shadow-md shadow-primary/25'
                          : 'text-gray-700 hover:bg-gray-100',
                        isCollapsed && 'justify-center px-2'
                      )
                    }
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </NavLink>
                ) : null}

                {/* Children Items */}
                {!isCollapsed && item.children && item.children.length > 0 && expandedSections.includes(item.name) && (
                  <div className="mt-1 ml-3 space-y-1 border-l-2 border-gray-200 pl-3">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.name}
                        to={child.href}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                            isActive
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          )
                        }
                      >
                        <child.icon className="h-4 w-4 flex-shrink-0" />
                        <span>{child.name}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3 flex-shrink-0">
            {!isCollapsed ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                  <UserButton 
                    afterSignOutUrl="/admin/sign-in"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 rounded-full ring-2 ring-primary/20"
                      }
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      Administrator
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      Manage content
                    </p>
                  </div>
                </div>
                
                {/* Logout Button */}
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <UserButton 
                  afterSignOutUrl="/admin/sign-in"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 rounded-full ring-2 ring-primary/20"
                    }
                  }}
                />
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        isCollapsed ? "ml-20" : "ml-72"
      )}>
        <div className="py-8 px-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
