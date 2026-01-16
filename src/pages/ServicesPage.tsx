import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Home, Heart, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';

export function ServicesPage() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Services"
        description="Comprehensive residential and home care services for seniors in USA. 24/7 professional care, personalized attention, and dignity-focused support."
      />

      {/* Detailed Services Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <Tabs defaultValue="residential" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 h-auto p-2">
              <TabsTrigger value="residential" className="gap-2 py-4 text-base">
                <Home className="h-5 w-5" />
                Residential Care
              </TabsTrigger>
              <TabsTrigger value="home" className="gap-2 py-4 text-base">
                <Heart className="h-5 w-5" />
                Home Care
              </TabsTrigger>
            </TabsList>

            <TabsContent value="residential" className="mt-8">
              <Card className="border-2 shadow-lg">
                <CardContent className="p-8 md:p-10 space-y-8">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                      <Home className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-primary">Residential Care Services</h2>
                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                      Our residential facility provides a safe, comfortable, and engaging environment where seniors can enjoy their golden years with dignity and independence.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">What We Offer:</h3>
                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                      {[
                        'Private and semi-private accommodation',
                        '24/7 nursing care and medical supervision',
                        'Nutritious meals tailored to dietary needs',
                        'Daily activities and recreational programs',
                        'Physical therapy and rehabilitation services',
                        'Medication management',
                        'Personal care assistance (bathing, dressing, grooming)',
                        'Housekeeping and laundry services',
                        'Social events and community engagement',
                        'Emergency response systems',
                        'Family visitation areas',
                        'Beautiful gardens and common spaces'
                      ].map((service, index) => (
                        <div key={index} className="flex items-start gap-3 group">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="text-sm leading-relaxed">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t-2 border-border">
                    <h3 className="text-xl font-semibold">Eligibility & Admission:</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Our residential care is suitable for seniors who need assistance with daily activities or medical monitoring. We conduct comprehensive assessments to ensure we can meet each individual's needs.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Pricing:</strong> Contact us for detailed pricing information based on accommodation type and care level required.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button 
                      onClick={() => navigate('/booking')}
                      className="bg-primary hover:bg-primary/90 text-base py-6"
                      size="lg"
                    >
                      Schedule a Tour
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/contact')}
                      className="text-base py-6 border-2"
                      size="lg"
                    >
                      Ask Questions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="home" className="mt-8">
              <Card className="border-2 shadow-lg">
                <CardContent className="p-8 md:p-10 space-y-8">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                      <Heart className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-primary">Home Care Services</h2>
                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                      Professional care delivered in the comfort and familiarity of your loved one's own home. We create personalized care plans that respect independence while ensuring safety and wellbeing.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Our Home Care Services Include:</h3>
                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                      {[
                        'Personal care (bathing, grooming, dressing)',
                        'Companionship and emotional support',
                        'Meal preparation and nutrition support',
                        'Medication reminders',
                        'Light housekeeping and laundry',
                        'Transportation to appointments',
                        'Mobility assistance',
                        'Health monitoring and reporting',
                        'Respite care for family caregivers',
                        'Alzheimer\'s and dementia care',
                        'Post-surgery recovery support',
                        'Chronic condition management'
                      ].map((service, index) => (
                        <div key={index} className="flex items-start gap-3 group">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="text-sm leading-relaxed">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t-2 border-border">
                    <h3 className="text-xl font-semibold">Flexible Care Plans:</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We offer flexible scheduling from a few hours per week to 24/7 live-in care. Our caregivers are carefully matched to each client's personality and needs.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Pricing:</strong> Rates vary based on care hours and services required. Contact us for a personalized quote.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button 
                      onClick={() => navigate('/booking')}
                      className="bg-primary hover:bg-primary/90 text-base py-6"
                      size="lg"
                    >
                      Request Consultation
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/contact')}
                      className="text-base py-6 border-2"
                      size="lg"
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom text-center">
          <h2>Have Questions About Our Services?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            We're here to help you understand which care option is best for your loved one. Contact us for a personalized consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              size="lg"
              onClick={() => navigate('/contact')}
              className="bg-primary hover:bg-primary/90"
            >
              Contact Us
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/booking')}
            >
              Schedule a Visit
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
