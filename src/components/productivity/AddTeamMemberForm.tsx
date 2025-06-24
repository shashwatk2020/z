
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface NewMember {
  name: string;
  email: string;
  role: string;
}

interface AddTeamMemberFormProps {
  newMember: NewMember;
  setNewMember: (member: NewMember) => void;
  onAddMember: () => void;
}

export const AddTeamMemberForm: React.FC<AddTeamMemberFormProps> = ({
  newMember,
  setNewMember,
  onAddMember
}) => {
  return (
    <div className="border-t pt-3 mt-3 space-y-2">
      <Input
        placeholder="Name"
        value={newMember.name}
        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
        className="text-sm"
      />
      <Input
        placeholder="Email"
        value={newMember.email}
        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
        className="text-sm"
      />
      <Input
        placeholder="Role"
        value={newMember.role}
        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
        className="text-sm"
      />
      <Button onClick={onAddMember} size="sm" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Member
      </Button>
    </div>
  );
};
