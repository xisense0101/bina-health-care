import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ServiceCard } from '../components/ServiceCard';
import { ImageCarousel } from '../components/ImageCarousel';
import { AnimatedSection } from '../components/AnimatedSection';
import {
  Heart,
  Users,
  Clock,
  Shield,
  Star,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Award,
  Phone,
  Sparkles,
  Quote,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getHeroSection,
  getServices,
  getTestimonials,
  getWhyChooseUs,
  getGalleryImages
} from '../lib/supabaseQueries';
import { useSupabaseData } from '../lib/config';
import type {
  HeroSection,
  Service,
  Testimonial,
  WhyChooseUs
} from '../lib/supabase';

export function HomePage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Configurable: use Supabase or hardcoded data

  const galleryImages = [
    '/pictures/galleryImages/IMG_0845.JPG', '/pictures/galleryImages/IMG_0846.JPG', '/pictures/galleryImages/IMG_0847.JPG', '/pictures/galleryImages/IMG_0848.JPG', '/pictures/galleryImages/IMG_0849.JPG', '/pictures/galleryImages/IMG_0850.JPG', '/pictures/galleryImages/IMG_0851.JPG', '/pictures/galleryImages/IMG_0852.JPG', '/pictures/galleryImages/IMG_0853.JPG', '/pictures/galleryImages/IMG_0854.JPG', '/pictures/galleryImages/IMG_0855.JPG', '/pictures/galleryImages/IMG_0857.JPG', '/pictures/galleryImages/IMG_0858.JPG', '/pictures/galleryImages/IMG_0859.JPG', '/pictures/galleryImages/IMG_0860.JPG', '/pictures/galleryImages/IMG_0861.JPG', '/pictures/galleryImages/IMG_0862.JPG', '/pictures/galleryImages/IMG_0863.JPG', '/pictures/galleryImages/IMG_0864.JPG', '/pictures/galleryImages/IMG_0865.JPG', '/pictures/galleryImages/IMG_0866.JPG', '/pictures/galleryImages/IMG_0868.JPG', '/pictures/galleryImages/IMG_0869.JPG', '/pictures/galleryImages/IMG_0870.JPG', '/pictures/galleryImages/IMG_0873.JPG', '/pictures/galleryImages/IMG_0874.JPG', '/pictures/galleryImages/IMG_0875.JPG', '/pictures/galleryImages/IMG_0876.JPG', '/pictures/galleryImages/IMG_0877.JPG', '/pictures/galleryImages/IMG_0878.JPG', '/pictures/galleryImages/IMG_0879.JPG', '/pictures/galleryImages/IMG_0880.JPG', '/pictures/galleryImages/IMG_0881.JPG', '/pictures/galleryImages/IMG_0882.JPG', '/pictures/galleryImages/IMG_0883.JPG', '/pictures/galleryImages/IMG_0884.JPG', '/pictures/galleryImages/IMG_0885.JPG', '/pictures/galleryImages/IMG_0886.JPG', '/pictures/galleryImages/IMG_0887.JPG', '/pictures/galleryImages/IMG_0888.JPG', '/pictures/galleryImages/IMG_0889.JPG', '/pictures/galleryImages/IMG_0890.JPG', '/pictures/galleryImages/IMG_0891.JPG', '/pictures/galleryImages/IMG_0892.JPG', '/pictures/galleryImages/IMG_0893.JPG', '/pictures/galleryImages/IMG_0894.JPG', '/pictures/galleryImages/IMG_0895.JPG', '/pictures/galleryImages/IMG_0896.JPG', '/pictures/galleryImages/IMG_0897.JPG', '/pictures/galleryImages/IMG_0898.JPG', '/pictures/galleryImages/IMG_0899.JPG'
  ];

  // Only fetch from Supabase if enabled
  const { data: heroData } = useSupabaseData ? useQuery({
    queryKey: ['hero-section'],
    queryFn: () => getHeroSection()
  }) : { data: null };
  // Set heroImagesLoading to false (no async loading for hardcoded images)
  const heroImagesLoading = false;
  const { data: services = [] } = useSupabaseData ? useQuery({
    queryKey: ['services'],
    queryFn: () => getServices()
  }) : { data: [] };
  const { data: testimonials = [] } = useSupabaseData ? useQuery({
    queryKey: ['testimonials-featured'],
    queryFn: () => getTestimonials(true)
  }) : { data: [] };
  const { data: whyChooseUsItems = [] } = useSupabaseData ? useQuery({
    queryKey: ['why-choose-us'],
    queryFn: () => getWhyChooseUs()
  }) : { data: [] };
  const { data: supabaseGalleryImages = [], isLoading: galleryImagesLoading } = useSupabaseData ? useQuery({
    queryKey: ['gallery-images'],
    queryFn: () => getGalleryImages()
  }) : { data: [], isLoading: false };

  // Testimonials rotation
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Fallback testimonials if Sanity data not available
  const fallbackTestimonials = [
    {
      quote: "Bina Adult Care has been a blessing for our family. The staff treats my mother with such love and respect. We couldn't ask for better care.",
      author: "Rajesh Sharma",
      role: "Family Member",
      image: { asset: null }
    },
    {
      quote: "The compassionate care and attention to detail at Bina Adult Care is outstanding. I feel safe, valued, and part of a warm community.",
      author: "Sita Devi",
      role: "Resident",
      image: { asset: null }
    },
    {
      quote: "Professional, caring, and always going above and beyond. Bina Adult Care has exceeded all our expectations in senior care services.",
      author: "Prakash Thapa",
      role: "Family Member",
      image: { asset: null }
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % displayTestimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displayTestimonials.length]);

  // Move shuffle into useMemo so it only happens once per mount
  const displayHeroImages = useMemo(() => {
    const defaultImages = [
      '/pictures/heroImages/IMG_0855.webp',
      '/pictures/heroImages/IMG_0859.webp',
      '/pictures/heroImages/IMG_0860.webp',
      '/pictures/heroImages/IMG_0870.webp',
      '/pictures/heroImages/IMG_0874.webp',
      '/pictures/heroImages/IMG_0879.webp',
      '/pictures/heroImages/IMG_0895.webp',
    ];

    const heroImagesFromData = (heroData && (heroData as any).heroImages && Array.isArray((heroData as any).heroImages))
      ? (heroData as any).heroImages as Array<{ image_url: string; alt_text?: string }>
      : [];

    const baseList = useSupabaseData && heroImagesFromData.length > 0
      ? heroImagesFromData.map(img => ({ url: img.image_url, alt: img.alt_text || 'Senior care' }))
      : defaultImages.map(url => ({ url, alt: 'Senior care' }));

    // Shuffling
    const arr = [...baseList];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [heroData]); // Only reshuffle if database data changes

  // Gallery images - use Supabase or hardcoded
  const galleryList = useSupabaseData && supabaseGalleryImages.length > 0 ? supabaseGalleryImages : galleryImages;
  // Use WebP thumbnails for About Us gallery
  function getThumb(img: string | { image_url: string }): string {
    let base = '';
    if (typeof img === 'string') {
      base = img.split('/').pop() || img;
    } else if (img && img.image_url) {
      base = img.image_url.split('/').pop() || '';
    }
    if (base.endsWith('.webp')) base = base.slice(0, -5);
    if (base.endsWith('.JPG')) base = base.slice(0, -4);
    if (base.endsWith('.jpeg')) base = base.slice(0, -5);
    if (base.endsWith('.jpg')) base = base.slice(0, -4);
    return `/pictures/galleryImages/${base}_thumb.webp`;
  }
  const aboutImages = galleryList
    .filter((img: string | { image_url: string }, index: number) => {
      let base = '';
      if (typeof img === 'string') base = img;
      else if (img && (img as any).image_url) base = (img as any).image_url.split('/').pop() || '';
      return index % 2 === 0 && !base.includes('IMG_0847');
    })
    .slice(0, 12)
    .map((img: string | { image_url: string }) => ({ url: getThumb(img), alt: 'Gallery image' }));
  const programImages = galleryList
    .filter((img: string | { image_url: string }, index: number) => {
      let base = '';
      if (typeof img === 'string') base = img;
      else if (img && (img as any).image_url) base = (img as any).image_url.split('/').pop() || '';
      return index % 2 === 1 && !base.includes('IMG_0847');
    })
    .slice(0, 12)
    .map((img: string | { image_url: string }) => ({ url: getThumb(img), alt: 'Gallery image' }));

  return (
    <>
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-[90vh] overflow-hidden" style={{ position: 'relative' }}>
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#5B9A9E]/10 via-[#E5D4C1]/15 to-[#5B9A9E]/5"
          style={{ y }}
        />

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-[#E5D4C1]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="container-custom relative z-10 section-padding"
          style={{ opacity }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {(heroData?.badge || true) && (
                <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm">
                  {heroData?.badge || "Trusted Senior Care Since"}
                </div>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl text-foreground">
                {heroData?.headline || "Compassionate Care for Your Loved Ones"}
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl">
                {heroData?.description || "Providing professional residential and home care services to senior adults with dignity, respect, and compassion. Available 24/7 in USA."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/booking')}
                  className="bg-primary hover:bg-primary/90 group"
                >
                  Schedule a Visit
                  <Calendar className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/contact')}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Us Now
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Licensed & Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">24/7 Support</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white">
                {heroImagesLoading || displayHeroImages.length === 0 ? (
                  <div className="w-full h-full bg-white" />
                ) : (
                  <ImageCarousel
                    images={displayHeroImages}
                    autoPlayInterval={4000}
                    showControls={true}
                  />
                )}
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
            <h2>Why Choose Bina Adult Care</h2>
            <p className="text-muted-foreground mt-4">
              We're committed to providing the highest quality care with compassion and professionalism.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(whyChooseUsItems.length > 0 ? whyChooseUsItems : [
              {
                id: '1',
                icon: 'Heart',
                title: 'Compassionate Care',
                description: 'Every resident receives personalized attention with dignity and respect.',
                display_order: 1,
                is_active: true
              },
              {
                id: '2',
                icon: 'Award',
                title: 'Experienced Team',
                description: 'Certified professionals with years of experience in senior care.',
                display_order: 2,
                is_active: true
              },
              {
                id: '3',
                icon: 'Clock',
                title: '24/7 Availability',
                description: 'Round-the-clock care and support whenever you need us.',
                display_order: 3,
                is_active: true
              },
              {
                id: '4',
                icon: 'Shield',
                title: 'Safe Environment',
                description: 'Secure facilities with medical monitoring and emergency response.',
                display_order: 4,
                is_active: true
              }
            ]).map((feature, index) => {
              const IconComponent = (Icons as any)[feature.icon || 'Heart'] || Heart;
              return (
                <AnimatedSection key={feature.id} delay={index * 0.1} direction="up">
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <h4>{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Us with Scrolling Image Gallery */}
      <section className="section-padding bg-white">
        <div className="container-custom">

          {/* Two Column Layout - SIDE BY SIDE */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* LEFT COLUMN - Text Content */}
            <div className="space-y-5">
              <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                About Us
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Providing Care to the Needy Senior Adults
              </h2>

              <p className="text-base text-muted-foreground leading-relaxed">
                At Bina Adult Care, we understand that choosing care for your loved ones is one of the most important decisions you'll make. Our mission is to provide compassionate, professional care that honors the dignity and independence of every senior adult we serve.
              </p>

              <p className="text-base text-muted-foreground leading-relaxed">
                Founded with a commitment to excellence in elder care, we combine modern healthcare practices with traditional values of respect and family. Our team of dedicated professionals works tirelessly to create a warm, supportive environment where seniors can thrive.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold mb-0.5">Expert Team</h4>
                    <p className="text-sm text-muted-foreground">Trained healthcare professionals</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold mb-0.5">Quality Care</h4>
                    <p className="text-sm text-muted-foreground">Personalized care plans</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-secondary/30 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold mb-0.5">Compassionate</h4>
                    <p className="text-sm text-muted-foreground">Care with love and respect</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold mb-0.5">24/7 Available</h4>
                    <p className="text-sm text-muted-foreground">Round-the-clock support</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/contact')}
                  className="bg-primary hover:bg-primary/90 group"
                >
                  Get in Touch
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            {/* RIGHT COLUMN - Scrolling Image Gallery with Fade Effect */}
            <div className="w-full flex justify-center items-center">
              <div className="relative h-[400px] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">

                {galleryImagesLoading || (aboutImages.length === 0 && programImages.length === 0) ? (
                  <div className="w-full h-full bg-white" />
                ) : (
                  <>
                    {/* Two Scrolling Columns Side by Side */}
                    <div className="flex gap-3 h-full">

                      {/* Column 1 - Scrolling Down */}
                      <div className="w-1/2 relative overflow-hidden">
                        <motion.div
                          className="flex flex-col gap-3"
                          animate={{ y: ["0%", "-50%"] }}
                          transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                          }}
                        >
                          {[...programImages, ...programImages].map((image, index) => (
                            <div
                              key={`down-${index}`}
                              className="relative rounded-lg overflow-hidden shadow-md bg-white"
                              style={{ height: '140px', flexShrink: 0 }}
                            >
                              <img
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                                width={400}
                                height={140}
                              />
                            </div>
                          ))}
                        </motion.div>
                      </div>

                      {/* Column 2 - Scrolling Up */}
                      <div className="w-1/2 relative overflow-hidden">
                        <motion.div
                          className="flex flex-col gap-3"
                          animate={{ y: ["-50%", "0%"] }}
                          transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                          }}
                        >
                          {[...aboutImages, ...aboutImages].map((image, index) => (
                            <div
                              key={`up-${index}`}
                              className="relative rounded-lg overflow-hidden shadow-md bg-white"
                              style={{ height: '140px', flexShrink: 0 }}
                            >
                              <img
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                                width={400}
                                height={140}
                              />
                            </div>
                          ))}
                        </motion.div>
                      </div>
                    </div>

                    {/* Fade Effect - Top Shadow */}
                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-100 via-gray-100/50 to-transparent pointer-events-none z-10" />

                    {/* Fade Effect - Bottom Shadow */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-100 via-gray-100/50 to-transparent pointer-events-none z-10" />
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
            <h2>Our Care Services</h2>
            <p className="text-muted-foreground mt-4">
              We offer two comprehensive care options designed to meet the unique needs of every senior and their family.
              Choose the service that best fits your loved one's lifestyle and care requirements.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Residential Care */}
            <AnimatedSection delay={0.1} direction="up">
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                <CardContent className="p-8 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto">
                    <Shield className="h-8 w-8 text-white" />
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-3">Residential Care</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      A safe, comfortable living environment where seniors receive round-the-clock professional care.
                      Our residential facility provides a warm, community-focused atmosphere with 24/7 medical supervision,
                      nutritious meals, engaging activities, and comprehensive health monitoring.
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">24/7 professional nursing care</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Secure and comfortable living spaces</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Daily activities and social programs</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Nutritious meal planning and preparation</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 group"
                    size="lg"
                    onClick={() => navigate('/services')}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Home Care */}
            <AnimatedSection delay={0.2} direction="up">
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                <CardContent className="p-8 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto">
                    <Heart className="h-8 w-8 text-white" />
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-3">Home Care</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Professional care delivered in the comfort and familiarity of your loved one's own home.
                      Our trained caregivers provide personalized assistance with daily activities, medication management,
                      companionship, and health monitoring while allowing seniors to maintain their independence.
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Personalized care in familiar surroundings</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Flexible scheduling to meet your needs</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Assistance with daily living activities</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Companionship and emotional support</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 group"
                    size="lg"
                    onClick={() => navigate('/services')}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              Not sure which service is right for your family? We're here to help you make the best decision.
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/contact')}
              className="group"
            >
              <Phone className="mr-2 h-5 w-5" />
              Contact Us for Guidance
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      {/* <section className="section-padding bg-muted">
        <div className="container-custom">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
            <h2>Resources & Insights</h2>
            <p className="text-muted-foreground mt-4">
              Helpful information about senior care, health tips, and family guidance.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: '10 Signs Your Loved One May Need Additional Care',
                excerpt: 'Learn to recognize the early warning signs that indicate a senior may benefit from professional care assistance.',
                category: 'Family Guide'
              },
              {
                title: 'Understanding the Difference: Residential vs. Home Care',
                excerpt: 'A comprehensive guide to help families choose the right care option for their loved ones.',
                category: 'Care Options'
              },
              {
                title: 'Nutrition Tips for Healthy Aging',
                excerpt: 'Essential dietary guidelines and meal planning strategies to support senior health and wellbeing.',
                category: 'Health & Wellness'
              }
            ].map((post, index) => (
              <AnimatedSection key={index} delay={index * 0.15} direction="up">
                <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {post.category}
                    </div>
                    <h4>{post.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Read More →
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              📝 Blog posts to be created by client or content writer. Titles and summaries provided as examples.
            </p>
          </div>
        </div>
      </section> */}
    </>
  );
}
