import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './Logo';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getSiteSettings } from '../lib/supabaseQueries';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: siteSettings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: getSiteSettings
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Our Team', path: '/team' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white backdrop-blur-xl shadow-xl border-b border-gray-200' : 'bg-white shadow-sm'
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={scrolled ? { backgroundColor: 'rgba(255, 255, 255, 0.98)' } : {}}
    >
      {/* Top Bar */}
      <motion.div
        className={`bg-primary transition-all duration-300 ${scrolled ? 'py-1' : 'py-2'
          }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <motion.div
              className="flex flex-wrap items-center gap-4 text-white text-sm"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.a
                href={`tel:${siteSettings?.phone || '+977-1-XXXXXXX'}`}
                className="flex items-center gap-1 transition-opacity"
                whileHover={{ opacity: 0.8, scale: 1.05 }}
              >
                <Phone className="h-3 w-3" />
                {siteSettings?.phone || '5107104392'}
              </motion.a>
              <motion.a
                href={`mailto:${siteSettings?.email || 'info@binaadultcare.com'}`}
                className="flex items-center gap-1 transition-opacity"
                whileHover={{ opacity: 0.8, scale: 1.05 }}
              >
                <Mail className="h-3 w-3" />
                {siteSettings?.email || 'binasadultcare@gmail.com'}
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <nav className="container-custom">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'
          }`}>
          {/* Logo */}
          <motion.button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className={`transition-all duration-300 ${scrolled ? 'w-10 h-10' : 'w-12 h-12'
                }`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Logo />
            </motion.div>
            <div className={`flex flex-col items-start transition-all duration-300 overflow-hidden ${scrolled ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              }`}>
              <span
                className="whitespace-nowrap"
                style={{
                  fontFamily: "'Lora', serif",
                  fontWeight: 700,
                  fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                  color: '#1B365D',
                  lineHeight: '1.1'
                }}
              >
                Bina Adult Care
              </span>
              <span
                className="whitespace-nowrap"
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
                  color: '#1E4D2B',
                  marginTop: '-0.1rem'
                }}
              >
                Compassionate Senior Care
              </span>
            </div>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`relative transition-colors ${isActive(item.path) ? 'text-primary' : 'text-foreground'
                  }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -2 }}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activeNav"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => handleNavClick('/booking')}
                className="bg-primary hover:bg-primary/90"
              >
                Book a Visit
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="lg:hidden border-t border-border py-4 space-y-2"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${isActive(item.path) ? 'bg-muted text-primary' : 'hover:bg-muted'
                    }`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navItems.length * 0.05 }}
              >
                <Button
                  onClick={() => handleNavClick('/booking')}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Book a Visit
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
