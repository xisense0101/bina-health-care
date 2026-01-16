import { Button } from '../components/ui/button';
import { TeamMemberCard } from '../components/TeamMemberCard';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useQuery } from '@tanstack/react-query';
import { getTeamMembers } from '../lib/supabaseQueries';
import { useSupabaseData } from '../lib/config';
import type { TeamMember } from '../lib/supabase';

export function TeamPage() {
  const navigate = useNavigate();
  // Configurable: use Supabase or hardcoded team members
  const hardcodedTeam = [
    {
      id: '1',
      name: 'Manoj Gadal',
      role: 'Administrator',
      bio: 'Administrator',
      // image_url: 'https://drive.google.com/your-manjo-photo-share-link', // photo uploaded to Drive/Dropbox (commented out for now)
      email: 'manojgadal29@gmail.com',
      display_order: 1,
      is_active: true
    },
    {
      id: '2',
      name: 'Suraj Gurung',
      role: 'Facility Manager',
      bio: 'Head CNA',
      // image_url: 'https://drive.google.com/your-suraj-photo-share-link', // photo uploaded to Drive/Dropbox (commented out for now)
      email: 'surajgrg1284@gmail.com',
      display_order: 2,
      is_active: true
    },
    {
      id: '3',
      name: 'Bina Bishwokarma',
      role: 'House Manager',
      bio: '',
      // image_url: 'https://drive.google.com/your-bina-photo-share-link', // photo uploaded to Drive/Dropbox (commented out for now)
      email: 'binakarma534@gmail.com',
      display_order: 3,
      is_active: true
    }
  ];
  const { data: teamMembers = [] } = useSupabaseData ? useQuery({
    queryKey: ['team-members'],
    queryFn: () => getTeamMembers()
  }) : { data: [] };
  const displayTeam = useSupabaseData && teamMembers.length > 0 ? teamMembers : hardcodedTeam;
  const sortedTeam = [...displayTeam].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  return (
    <>
      <SEO
        title="Our Team"
        description="Meet the dedicated healthcare professionals at Bina Adult Care. Experienced, compassionate, and committed to providing the best senior care in USA."
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#5B9A9E]/10 to-[#E5D4C1]/20 section-padding">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl text-foreground">
            Meet Our Caring Team
          </h1>
          <p className="text-lg text-muted-foreground mt-4">
            Our dedicated professionals bring expertise, compassion, and commitment to every interaction. Get to know the team that makes Bina Adult Care special.
          </p>
        </div>
      </section>

      {/* Team Members */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-stretch">
            {sortedTeam.map((member) => (
              <TeamMemberCard
                key={member.id}
                name={member.name}
                role={member.role}
                bio={member.bio || ''}
                image={member.image_url}
                email={member.email}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="section-padding bg-muted">
        <div className="container-custom text-center">
          <h2>Join Our Team</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Want to make a difference in the lives of senior adults? We're always looking for caring, qualified professionals to join our growing team.
          </p>
          <Button 
            onClick={() => navigate('/careers')}
            size="lg"
            className="mt-8 bg-primary hover:bg-primary/90 group"
          >
            View Career Opportunities
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
    </>
  );
}
