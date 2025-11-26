import { SEO } from '../components/SEO';
import { useQuery } from '@tanstack/react-query';
import { getGalleryImages } from '../lib/supabaseQueries';

export function GalleryPage() {
  const { data: galleryImages = [] } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: () => getGalleryImages()
  });

  // Fallback images if no data from Supabase
  const fallbackImages = [
    {
      src: 'https://images.unsplash.com/photo-1760540167216-00b806b5aeae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBsaXZpbmclMjBjb21tdW5pdHl8ZW58MXx8fHwxNzYyMjI3OTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Senior living community',
      category: 'Facility'
    },
    {
      src: 'https://images.unsplash.com/photo-1761666519794-ad6fbcef058b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwY2FyZSUyMHNtaWxpbmd8ZW58MXx8fHwxNzYyMzE2NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Happy residents',
      category: 'Residents'
    },
    {
      src: 'https://images.unsplash.com/photo-1648365300669-e7b760c6d240?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwYWN0aXZpdGllc3xlbnwxfHx8fDE3NjIzMTY0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Activities',
      category: 'Activities'
    },
    {
      src: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      alt: 'Medical checkup',
      category: 'Medical'
    },
    {
      src: 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMHNlbmlvciUyMGNhcmV8ZW58MXx8fHwxNzYyMjgzNTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Medical care',
      category: 'Medical'
    },
    {
      src: 'https://images.unsplash.com/photo-1664555633392-806ba3eccdc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGVsZGVybHklMjBwZXJzb258ZW58MXx8fHwxNzYyMjUxMTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Residents',
      category: 'Residents'
    },
    {
      src: 'https://images.unsplash.com/photo-1669215526535-08ee346103f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGNhcmUlMjBmYWNpbGl0eXxlbnwxfHx8fDE3NjIzMTU4MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Facility',
      category: 'Facility'
    },
    {
      src: 'https://images.unsplash.com/photo-1758874960646-5df575d0bbe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBob21lJTIwY2FyZXxlbnwxfHx8fDE3NjIzMTU4MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Home care',
      category: 'Home Care'
    },
    {
      src: 'https://images.unsplash.com/photo-1761666519794-ad6fbcef058b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      alt: 'Senior care moment',
      category: 'Care'
    },
    {
      src: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      alt: 'Healthcare consultation',
      category: 'Medical'
    },
    {
      src: 'https://images.unsplash.com/photo-1648365300669-e7b760c6d240?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      alt: 'Group activities',
      category: 'Activities'
    },
    {
      src: 'https://images.unsplash.com/photo-1664555633392-806ba3eccdc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      alt: 'Happy senior moment',
      category: 'Residents'
    },
    {
      src: 'https://images.unsplash.com/photo-1760540167216-00b806b5aeae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      alt: 'Community living',
      category: 'Facility'
    },
    {
      src: 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      alt: 'Professional medical care',
      category: 'Medical'
    },
    {
      src: 'https://images.unsplash.com/photo-1669215526535-08ee346103f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      alt: 'Care facility interior',
      category: 'Facility'
    },
    {
      src: 'https://images.unsplash.com/photo-1758874960646-5df575d0bbe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      alt: 'Home care services',
      category: 'Home Care'
    }
  ];

  const displayImages = galleryImages.length > 0 
    ? galleryImages.map(img => ({
        src: img.image_url,
        alt: img.alt_text || img.title,
        category: img.category || 'General'
      }))
    : fallbackImages;

  return (
    <>
      <SEO
        title="Gallery"
        description="View photos of Bina Adult Care's facility, activities, and the warm environment we provide for senior adults in Nepal."
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
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="inline-block px-3 py-1 bg-primary text-white text-xs rounded-full">
                      {image.category}
                    </span>
                  </div>
                </div>
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
