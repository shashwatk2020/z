
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface Tool {
  name: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

interface FeaturedToolsGridProps {
  tools: Tool[];
}

const FeaturedToolsGrid = ({ tools }: FeaturedToolsGridProps) => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Link to={tool.link} key={tool.name} className="block group">
              <Card className="h-full hover:shadow-lg hover:border-blue-500 transition-all duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div>{tool.icon}</div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tool.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedToolsGrid;
