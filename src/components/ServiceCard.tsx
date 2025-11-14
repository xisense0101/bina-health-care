import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  image: string;
  onLearnMore: () => void;
}

export function ServiceCard({ title, description, features, image, onLearnMore }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="overflow-hidden h-full group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-video w-full overflow-hidden relative">
          <motion.img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute bottom-4 left-4 right-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-white text-xl font-medium">{title}</h3>
          </motion.div>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              {description}
            </motion.p>
            
            <ul className="space-y-2.5">
              {features.map((feature, index) => (
                <motion.li 
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="flex items-start gap-2"
                >
                  <motion.div
                    className="mt-0.5"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  </motion.div>
                  <span className="text-sm text-foreground">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={onLearnMore}
              className="w-full bg-primary hover:bg-primary/90 group mt-4"
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
