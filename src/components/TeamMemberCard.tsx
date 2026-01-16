import { Card, CardContent } from './ui/card';
import { Mail, Phone } from 'lucide-react';

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  image?: string;
  email?: string;
  phone?: string;
}

export function TeamMemberCard({ name, role, bio, image, email, phone }: TeamMemberCardProps) {
  const initials = (name || '').split(' ').filter(Boolean).map(n => n[0]).slice(0,2).join('').toUpperCase();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 min-h-[320px] flex flex-col items-center text-center">
      <div className="mt-6">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-24 w-24 rounded-full object-cover border-2 border-white shadow-sm mx-auto"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-24 w-24 rounded-full flex items-center justify-center bg-gradient-to-br from-[#5B9A9E] to-[#E5D4C1] text-white text-2xl font-semibold shadow mx-auto">
            {initials || '?'}
          </div>
        )}
      </div>

      <CardContent className="p-6 pt-4 space-y-3 w-full">
        <div>
          <h4 className="text-lg font-semibold">{name}</h4>
          <p className="text-primary text-sm mt-1">{role}</p>
        </div>

        <p className="text-sm text-muted-foreground mt-2 line-clamp-4">
          {bio || '—'}
        </p>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-4">
          {email && (
            <a href={`mailto:${email}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition">
              <Mail className="h-4 w-4" />
              Email
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
