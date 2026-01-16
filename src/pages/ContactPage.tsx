import { Card, CardContent } from '../components/ui/card';
import { ContactForm } from '../components/ContactForm';
import { LocationMap } from '../components/LocationMap';
import { Phone, Clock, Mail, MapPin } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useQuery } from '@tanstack/react-query';
import { getSiteSettings, getLocations } from '../lib/supabaseQueries';

export function ContactPage() {
  const { data: siteSettings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => getSiteSettings()
  });

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: () => getLocations()
  });

  const primaryLocation = locations?.find(loc => loc.is_primary) || locations?.[0];

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Bina Adult Care. Available 24/7 to answer questions about our senior care services in USA. Call, email, or visit us."
      />

      {/* Hero Section */}
      {/* <section className="relative bg-gradient-to-br from-[#5B9A9E]/10 to-[#E5D4C1]/20 section-padding">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl text-foreground">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground mt-4">
            Have questions about our services? We're here to help. Reach out and we'll respond promptly.
          </p>
        </div>
      </section> */}

      {/* Contact Form, Info, and Map - Compact Modern Layout */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="flex-1 flex flex-col justify-center">
              <Card className="shadow-md">
                <CardContent className="p-8">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            {/* Contact Info & Map - Single Card */}
            <div className="flex-1 flex flex-col justify-center">
              <Card className="shadow-md">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-stretch">
                    {/* Contact Info */}
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
                      <p className="text-muted-foreground mb-4">
                        We're available 24/7 to answer your questions and provide support.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Phone className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Phone</h4>
                            <a href={`tel:${siteSettings?.phone || '5107104392'}`} className="text-muted-foreground hover:text-primary">
                              {siteSettings?.phone || '5107104392'}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Email</h4>
                            <a href={`mailto:${siteSettings?.email || 'binasadultcare@gmail.com'}`} className="text-muted-foreground hover:text-primary">
                              {siteSettings?.email || 'binasadultcare@gmail.com'}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Hours</h4>
                            <p className="text-muted-foreground">Open 24/7</p>
                            <p className="text-sm text-muted-foreground"></p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Address</h4>
                            <p className="text-muted-foreground">{siteSettings?.address || '5667 San Pablo Dam Rd, El Sobrante, CA 94803, USA'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Map Side-by-Side */}
                    <div className="flex-1 flex items-stretch">
                      <div className="w-full h-full rounded-lg overflow-hidden border border-border shadow-sm min-h-[240px] md:min-h-0">
                        <iframe
                          title="Bina Adult Care Location"
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3167.073073013422!2d-122.273792!3d37.9585286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808579efbf61cdf9%3A0xe08e656e8eaa555b!2s5667%20San%20Pablo%20Dam%20Rd%2C%20El%20Sobrante%2C%20CA%2094803%2C%20USA!5e0!3m2!1sen!2sus!4v1705440000000!5m2!1sen!2sus"
                          width="100%"
                          height="100%"
                          style={{ border: 0, minHeight: '240px' }}
                          allowFullScreen={true}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h3>Need Immediate Assistance?</h3>
          <p className="text-muted-foreground mt-4">
            For urgent matters or emergencies, please call us directly at <a href={`tel:${siteSettings?.phone || '5107104392'}`} className="text-primary hover:underline">{siteSettings?.phone || '5107104392'}</a>. We're available 24/7 to provide support and answer your questions.
          </p>
        </div>
      </section>
    </>
  );
}
