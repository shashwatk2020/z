
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Tool {
  name: string;
  description: string;
  link: string;
  icon?: React.ReactNode;
}

interface ToolGridProps {
  tools: Tool[];
  className?: string;
}

const ToolGrid: React.FC<ToolGridProps> = ({ tools, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {tools.map((tool) => (
        <Link to={tool.link} key={tool.name} className="block group">
          <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
            {tool.icon && (
              <div className="flex items-center space-x-4 mb-2">
                <div>{tool.icon}</div>
              </div>
            )}
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ToolGrid;
