
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FeaturedTool {
  name: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

interface FeaturedToolCardProps {
  tool: FeaturedTool;
}

const FeaturedToolCard: React.FC<FeaturedToolCardProps> = ({ tool }) => {
  return (
    <Link to={tool.link} className="block group">
      <Card className="h-full hover:shadow-lg hover:border-blue-500 transition-all duration-300">
        <CardHeader className="flex flex-row items-center space-x-4">
          <div>{tool.icon}</div>
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
              {tool.name}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{tool.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FeaturedToolCard;
