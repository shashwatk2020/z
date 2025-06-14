
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface Tool {
  name: string;
  description: string;
  link: string;
}

interface ToolSectionProps {
  title: string;
  tools: Tool[];
}

const ToolSection = ({ title, tools }: ToolSectionProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link to={tool.link} key={tool.name} className="block group">
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ToolSection;
