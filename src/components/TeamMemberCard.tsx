import { Card, CardContent } from './ui/card';
import { Mail, Phone } from 'lucide-react';

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  email?: string;
  phone?: string;
}

export function TeamMemberCard({ name, role, bio, image, email, phone }: TeamMemberCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-square w-full overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6 space-y-3">
        <div>
          <h4>{name}</h4>
          <p className="text-primary text-sm">{role}</p>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3">
          {bio}
        </p>

        {(email || phone) && (
          <div className="space-y-2 pt-2 border-t border-border">
            {email && (
              <a 
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                {email}
              </a>
            )}
            {phone && (
              <a 
                href={`tel:${phone}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                {phone}
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
