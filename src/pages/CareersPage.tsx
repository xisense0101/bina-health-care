import { Card, CardContent } from '../components/ui/card';
import { JobApplicationForm } from '../components/JobApplicationForm';
import { CheckCircle2, Briefcase } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useQuery } from '@tanstack/react-query';
import { getJobPositions } from '../lib/supabaseQueries';

export function CareersPage() {
  const { data: jobPositions = [] } = useQuery({
    queryKey: ['job-positions'],
    queryFn: () => getJobPositions()
  });

  return (
    <>
      <SEO
        title="Careers"
        description="Join the Bina Adult Care team. We're hiring compassionate healthcare professionals including nurses, caregivers, and support staff in USA."
      />

      {/* Hero Section */}
      {/* <section className="relative bg-gradient-to-br from-[#5B9A9E]/10 to-[#E5D4C1]/20 section-padding">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl text-foreground">
            Join Our Team
          </h1>
          <p className="text-lg text-muted-foreground mt-4">
            Make a difference in the lives of senior adults. We're looking for compassionate, dedicated professionals to join our growing team.
          </p>
        </div>
      </section> */}

      {/* Why Work With Us & Application Form */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3>Why Work With Us?</h3>
              
              <div className="space-y-4">
                {[
                  {
                    title: 'Meaningful Work',
                    description: 'Make a real difference in the lives of seniors every day.'
                  },
                  {
                    title: 'Professional Development',
                    description: 'Ongoing training and career advancement opportunities.'
                  },
                  {
                    title: 'Supportive Environment',
                    description: 'Work alongside experienced, caring professionals.'
                  },
                  {
                    title: 'Competitive Benefits',
                    description: 'Fair compensation and comprehensive benefits package.'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-base">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                {jobPositions.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {jobPositions.map((position) => (
                      <li key={position.id} className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        {position.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-6 space-y-4">
                <h4>What We Look For:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Compassion and empathy for senior adults</li>
                  <li>• Relevant qualifications and certifications</li>
                  <li>• Strong communication skills</li>
                  <li>• Reliability and professionalism</li>
                  <li>• Team player mentality</li>
                  <li>• Commitment to continuous learning</li>
                </ul>
              </div>
            </div>

            <Card>
              <CardContent className="p-8">
                <h3 className="mb-6">Apply Now</h3>
                <JobApplicationForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Equal Opportunity Statement */}
      <section className="section-padding bg-muted">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h3>Equal Opportunity Employer</h3>
          <p className="text-muted-foreground mt-4">
            Bina Adult Care is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees. All qualified applicants will receive consideration for employment without regard to race, color, religion, gender, gender identity or expression, sexual orientation, national origin, genetics, disability, age, or veteran status.
          </p>
        </div>
      </section>
    </>
  );
}
