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
        description="Get in touch with Bina Adult Care. Available 24/7 to answer questions about our senior care services in Nepal. Call, email, or visit us."
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

      {/* Contact Form & Info */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Card>
                <CardContent className="p-8">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h3>Contact Information</h3>
                    <p className="text-muted-foreground mt-2">
                      We're available 24/7 to answer your questions and provide support.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm">Phone</h4>
                        <a href={`tel:${siteSettings?.phone || '+977-XXXXXXXXXX'}`} className="text-muted-foreground hover:text-primary">
                          {siteSettings?.phone || '+977-XXXXXXXXXX'}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm">Email</h4>
                        <a href={`mailto:${siteSettings?.email || 'info@binaadultcare.com'}`} className="text-muted-foreground hover:text-primary">
                          {siteSettings?.email || 'info@binaadultcare.com'}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm">Hours</h4>
                        <p className="text-muted-foreground">Open 24/7</p>
                        <p className="text-sm text-muted-foreground">Office hours: Mon-Fri 9 AM - 6 PM</p>
                      </div>
                    </div>

                    {siteSettings?.address && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm">Address</h4>
                          <p className="text-muted-foreground">{siteSettings.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {primaryLocation && (
                <LocationMap
                  location={{
                    name: primaryLocation.name,
                    address: primaryLocation.address || '',
                    lat: primaryLocation.latitude || 0,
                    lng: primaryLocation.longitude || 0
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h3>Need Immediate Assistance?</h3>
          <p className="text-muted-foreground mt-4">
            For urgent matters or emergencies, please call us directly at <a href={`tel:${siteSettings?.phone || '+977-XXXXXXXXXX'}`} className="text-primary hover:underline">{siteSettings?.phone || '+977-XXXXXXXXXX'}</a>. We're available 24/7 to provide support and answer your questions.
          </p>
        </div>
      </section>
    </>
  );
}
