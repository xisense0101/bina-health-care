import { Button } from '../components/ui/button';
import { TeamMemberCard } from '../components/TeamMemberCard';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useQuery } from '@tanstack/react-query';
import { getTeamMembers } from '../lib/supabaseQueries';
import type { TeamMember } from '../lib/supabase';

export function TeamPage() {
  const navigate = useNavigate();
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team-members'],
    queryFn: () => getTeamMembers()
  });

  // Fallback team members if no data available
  const fallbackTeam: TeamMember[] = [
    {
      id: '1',
      name: 'Dr. [Name]',
      role: 'Medical Director',
      bio: 'Board-certified physician with over 15 years of experience in geriatric medicine. Oversees all medical care and treatment plans.',
      image_url: 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      email: 'doctor@binaadultcare.com',
      display_order: 1,
      is_active: true
    },
    {
      id: '2',
      name: '[Name]',
      role: 'Director of Nursing',
      bio: 'Registered nurse with extensive experience in long-term care. Leads our nursing team and ensures quality care delivery.',
      image_url: 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      email: 'nursing@binaadultcare.com',
      display_order: 2,
      is_active: true
    },
    {
      id: '3',
      name: '[Name]',
      role: 'Activities Coordinator',
      bio: 'Creates engaging programs and activities that promote social interaction, physical wellness, and mental stimulation for residents.',
      image_url: 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      email: 'activities@binaadultcare.com',
      display_order: 3,
      is_active: true
    },
    {
      id: '4',
      name: '[Name]',
      role: 'Facility Manager',
      bio: 'Ensures smooth operations and maintains a safe, comfortable environment. Your first point of contact for facility matters.',
      image_url: 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      email: 'manager@binaadultcare.com',
      display_order: 4,
      is_active: true
    }
  ];

  const displayTeam = teamMembers.length > 0 ? teamMembers : fallbackTeam;

  return (
    <>
      <SEO
        title="Our Team"
        description="Meet the dedicated healthcare professionals at Bina Adult Care. Experienced, compassionate, and committed to providing the best senior care in Nepal."
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayTeam.map((member) => (
              <TeamMemberCard
                key={member.id}
                name={member.name}
                role={member.role}
                bio={member.bio || ''}
                image={member.image_url || 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'}
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
