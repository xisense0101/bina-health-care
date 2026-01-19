import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSiteSettings } from '../lib/supabaseQueries';
import { siteConfig } from '../lib/config';
import { formatTel } from '../lib/formatContact';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { data: siteSettings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => getSiteSettings()
  });

  return (
    <footer className="bg-[#2C3E50] text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div>
            <h3 className="text-white mb-4">{siteSettings?.site_name || 'Bina Adult Care'}</h3>
            <p className="text-gray-300 mb-4">
              {siteSettings?.tagline || 'Providing compassionate, professional care to senior adults in residential and home settings.'}
            </p>
            <div className="flex gap-4">
              {siteSettings?.facebook_url && (
                <a href={siteSettings.facebook_url} className="hover:text-[#5B9A9E] transition-colors" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {siteSettings?.instagram_url && (
                <a href={siteSettings.instagram_url} className="hover:text-[#5B9A9E] transition-colors" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {siteSettings?.linkedin_url && (
                <a href={siteSettings.linkedin_url} className="hover:text-[#5B9A9E] transition-colors" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/')} className="text-gray-300 hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="text-gray-300 hover:text-white transition-colors">
                  Our Services
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/team')} className="text-gray-300 hover:text-white transition-colors">
                  Our Team
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/careers')} className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/services')} className="text-gray-300 hover:text-white transition-colors">
                  Residential Care
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="text-gray-300 hover:text-white transition-colors">
                  Home Care Services
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/booking')} className="text-gray-300 hover:text-white transition-colors">
                  Book a Visit
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/gallery')} className="text-gray-300 hover:text-white transition-colors">
                  Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-[#5B9A9E] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  {siteSettings?.address || '5667 San Pablo Dam Rd, El Sobrante, CA 94803, USA'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#5B9A9E] flex-shrink-0" />
                <a href={`tel:${formatTel(siteSettings?.phone || siteConfig.contact.phone)}`} className="text-gray-300 hover:text-white transition-colors">
                  {siteSettings?.phone || siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#5B9A9E] flex-shrink-0" />
                <a href={`mailto:${siteSettings?.email || siteConfig.contact.email}`} className="text-gray-300 hover:text-white transition-colors">
                  {siteSettings?.email || siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-5 w-5 text-[#5B9A9E] flex-shrink-0" />
                <a href={siteSettings?.instagram_url || 'https://www.instagram.com/binasadultcare?igsh=anF0bnFjbTM1am9w&utm_source=qr'} className="text-gray-300 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  @binasadultcare
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} {siteSettings?.site_name || 'Bina Adult Care'}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
