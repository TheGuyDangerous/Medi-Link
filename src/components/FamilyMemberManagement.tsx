import React, { useState, useEffect } from 'react';

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
}

interface FamilyMemberManagementProps {
  userId: string;
}

const FamilyMemberManagement: React.FC<FamilyMemberManagementProps> = ({ userId }) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      const response = await fetch(`/api/family-members?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setFamilyMembers(data);
      }
    } catch (error) {
      console.error('Error fetching family members:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/family-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, relation, userId }),
      });
      if (response.ok) {
        setName('');
        setRelation('');
        fetchFamilyMembers();
      }
    } catch (error) {
      console.error('Error adding family member:', error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-2">Family Members</h3>
      <ul>
        {familyMembers.map((member) => (
          <li key={member.id} className="mb-2">
            {member.name} - {member.relation}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
        <input
          type="text"
          placeholder="Relation"
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Family Member
        </button>
      </form>
    </div>
  );
};

export default FamilyMemberManagement;