
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
  getInitials: (name: string) => string;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, getInitials }) => {
  return (
    <div className="flex items-center space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{member.name}</p>
        <p className="text-xs text-gray-500">{member.role}</p>
      </div>
    </div>
  );
};
