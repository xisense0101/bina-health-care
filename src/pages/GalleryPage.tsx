

import { SEO } from '../components/SEO';
import { useSupabaseData } from '../lib/config';
import { useQuery } from '@tanstack/react-query';
import { getGalleryImages } from '../lib/supabaseQueries';

export function GalleryPage() {




  // Configurable: use Supabase or hardcoded images
  const hardcodedImages = [
    'IMG_0845.JPG','IMG_0846.JPG','IMG_0848.JPG','IMG_0849.JPG','IMG_0850.JPG','IMG_0851.JPG','IMG_0852.JPG','IMG_0853.JPG','IMG_0854.JPG','IMG_0855.JPG','IMG_0857.JPG','IMG_0858.JPG','IMG_0859.JPG','IMG_0860.JPG','IMG_0861.JPG','IMG_0862.JPG','IMG_0863.JPG','IMG_0864.JPG','IMG_0865.JPG','IMG_0866.JPG','IMG_0868.JPG','IMG_0869.JPG','IMG_0870.JPG','IMG_0873.JPG','IMG_0874.JPG','IMG_0875.JPG','IMG_0876.JPG','IMG_0877.JPG','IMG_0878.JPG','IMG_0879.JPG','IMG_0880.JPG','IMG_0881.JPG','IMG_0882.JPG','IMG_0883.JPG','IMG_0884.JPG','IMG_0885.JPG','IMG_0886.JPG','IMG_0887.JPG','IMG_0888.JPG','IMG_0889.JPG','IMG_0890.JPG','IMG_0891.JPG','IMG_0892.JPG','IMG_0893.JPG','IMG_0894.JPG','IMG_0895.JPG','IMG_0896.JPG','IMG_0897.JPG','IMG_0898.JPG','IMG_0899.JPG'
  ];
  const { data: supabaseImages = [] } = useSupabaseData ? useQuery({
    queryKey: ['gallery-images'],
    queryFn: () => getGalleryImages()
  }) : { data: [] };
  const galleryImages = useSupabaseData && supabaseImages.length > 0 ? supabaseImages : hardcodedImages;
  // Use full .webp images for grid (not thumbnails)
  const displayImages = galleryImages.length > 0
    ? galleryImages.map((img) => {
        let base = typeof img === 'string' ? img : img.image_url.split('/').pop();
        if (base && base.endsWith('.webp')) base = base.replace('.webp', '');
        if (base && base.endsWith('.JPG')) base = base.replace('.JPG', '');
        if (base && base.endsWith('.jpeg')) base = base.replace('.jpeg', '');
        if (base && base.endsWith('.jpg')) base = base.replace('.jpg', '');
        return {
          src: `/pictures/galleryImages/${base}.webp`,
          alt: typeof img === 'string' ? base : (img.alt_text || img.title || base),
          category: typeof img === 'string' ? 'General' : (img.category || 'General'),
          full: `/pictures/galleryImages/${base}.webp`,
        };
      })
    : [];

  return (
    <>
      <SEO
        title="Gallery"
        description="View photos of Bina Adult Care's facility, activities, and the warm environment we provide for senior adults in USA."
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#5B9A9E]/10 to-[#E5D4C1]/20 section-padding">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl text-foreground">
            Our Facility & Activities
          </h1>
          <p className="text-lg text-muted-foreground mt-4">
            Take a look at our warm, welcoming environment and the engaging activities we offer to our residents.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayImages.map((image, index) => (
              <div 
                key={index}
                className="group relative aspect-square rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={400}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              {galleryImages.length === 0 
                ? '📸 Photos for illustration purposes. Add your facility photos through the admin panel.'
                : ''}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom text-center">
          <h2>See Our Facility In Person</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            We'd love to show you around! Schedule a visit to experience our warm environment and meet our caring team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a href="/booking">
              <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Schedule a Tour
              </button>
            </a>
            <a href="/contact">
              <button className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors">
                Contact Us
              </button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
