import { Card, CardContent } from '../components/ui/card';
import { BookingForm } from '../components/BookingForm';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useQuery } from '@tanstack/react-query';
import { getSiteSettings } from '../lib/supabaseQueries';

export function BookingPage() {
  const { data: siteSettings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => getSiteSettings()
  });
  return (
    <>
      <SEO
        title="Schedule a Visit"
        description="Book a visit to Bina Adult Care facility or request a consultation for home care services. Schedule a convenient time to discuss your senior care needs."
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#5B9A9E]/10 to-[#E5D4C1]/20 section-padding">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl text-foreground">
            Schedule a Visit
          </h1>
          <p className="text-lg text-muted-foreground mt-4">
            We'd love to show you around and discuss how we can help your loved one. Book a convenient time to visit our facility or discuss home care options.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <BookingForm />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm">Visit Duration</h4>
                      <p className="text-sm text-muted-foreground">Approximately 60 minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h4>What to Expect:</h4>
                <div className="space-y-3">
                  {[
                    'Tour of our facility and rooms',
                    'Meet our professional staff',
                    'Discussion of care needs',
                    'Review of services and pricing',
                    'Q&A session',
                    'Personalized care plan options'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-muted rounded-lg p-6 space-y-2">
                <h4 className="text-sm">Need Help?</h4>
                <p className="text-sm text-muted-foreground">
                  If you have questions or need to reschedule, call us at{' '}
                  <a href={`tel:${siteSettings?.phone || '5107104392'}`} className="text-primary hover:underline">
                    {siteSettings?.phone || '5107104392'}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="section-padding bg-muted">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h3>Not Ready to Visit Yet?</h3>
          <p className="text-muted-foreground mt-4">
            We understand that choosing care is a big decision. Feel free to <a href="/contact" className="text-primary hover:underline">contact us</a> with any questions or to request more information about our services. We're here to help guide you through the process.
          </p>
        </div>
      </section>
    </>
  );
}
