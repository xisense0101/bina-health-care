import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Image, Users, MapPin, FileText, Sparkles, TrendingUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  getGalleryImages,
  getAllHeroImages, 
  getTeamMembers, 
  getLocations, 
  getServices 
} from '../../lib/supabaseQueries';

export function AdminDashboard() {
  const navigate = useNavigate();
  
  const { data: heroImages } = useQuery({
    queryKey: ['hero-images-all'],
    queryFn: () => getAllHeroImages()
  });

  const { data: galleryImages } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: () => getGalleryImages()
  });

  const { data: teamMembers } = useQuery({
    queryKey: ['team-members'],
    queryFn: () => getTeamMembers()
  });

  const { data: locations } = useQuery({
    queryKey: ['locations-all'],
    queryFn: () => getLocations()
  });

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => getServices()
  });

  const stats = [
    {
      title: 'Hero Images',
      value: heroImages?.filter(img => img.is_active).length || 0,
      total: heroImages?.length || 0,
      icon: Sparkles,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/admin/hero-images'
    },
    {
      title: 'Gallery Images',
      value: galleryImages?.length || 0,
      icon: Image,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/admin/gallery'
    },
    {
      title: 'Team Members',
      value: teamMembers?.length || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/admin/team'
    },
    {
      title: 'Services',
      value: services?.length || 0,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/admin/services'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Hero Images',
      description: 'Update homepage carousel images',
      icon: Sparkles,
      color: 'border-purple-200 hover:border-purple-400 bg-purple-50/50',
      href: '/admin/hero-images'
    },
    {
      title: 'Manage Gallery',
      description: 'Add, edit, or remove gallery images',
      icon: Image,
      color: 'border-blue-200 hover:border-blue-400 bg-blue-50/50',
      href: '/admin/gallery'
    },
    {
      title: 'Manage Team',
      description: 'Add or update team member information',
      icon: Users,
      color: 'border-green-200 hover:border-green-400 bg-green-50/50',
      href: '/admin/team'
    },
    {
      title: 'Site Settings',
      description: 'Update contact info and site configuration',
      icon: MapPin,
      color: 'border-orange-200 hover:border-orange-400 bg-orange-50/50',
      href: '/admin/settings'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Welcome back! Here's what's happening with your website.
          </p>
        </div>
        <button 
          onClick={() => window.open('/', '_blank')}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all"
        >
          <Eye className="h-4 w-4" />
          View Site
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card 
            key={stat.title} 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2"
            onClick={() => navigate(stat.href)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold">{stat.value}</div>
                {stat.total !== undefined && (
                  <span className="text-sm text-muted-foreground">/ {stat.total} total</span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>Active now</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="text-2xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quickActions.map((action) => (
              <button
                key={action.title}
                onClick={() => navigate(action.href)}
                className={`p-6 border-2 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg text-left ${action.color}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${action.color.includes('purple') ? 'bg-purple-100' : action.color.includes('blue') ? 'bg-blue-100' : action.color.includes('green') ? 'bg-green-100' : 'bg-orange-100'}`}>
                    <action.icon className={`h-6 w-6 ${action.color.includes('purple') ? 'text-purple-600' : action.color.includes('blue') ? 'text-blue-600' : action.color.includes('green') ? 'text-green-600' : 'text-orange-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Placeholder */}
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="text-2xl">Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Add Hero Images</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Start by adding hero images to your homepage carousel. Recommended size: 1920x1080px
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Add Team Members</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Showcase your staff by adding team member profiles with photos and bios
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Image className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Populate Gallery</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Add photos of your facility, activities, and care services to the gallery
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
