import React, { useState, useEffect } from 'react';

interface MedicalRecord {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
}

interface MedicalRecordsManagementProps {
  userId: string;
}

const MedicalRecordsManagement: React.FC<MedicalRecordsManagementProps> = ({ userId }) => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch(`/api/medical-records?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMedicalRecords(data);
      }
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/medical-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, fileName, fileUrl }),
      });
      if (response.ok) {
        setFileName('');
        setFileUrl('');
        fetchMedicalRecords();
      }
    } catch (error) {
      console.error('Error adding medical record:', error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-2">Medical Records</h3>
      <ul>
        {medicalRecords.map((record) => (
          <li key={record.id} className="mb-2">
            <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">
              {record.fileName}
            </a>
            {' - '}
            {new Date(record.uploadDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          placeholder="File Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
        <input
          type="text"
          placeholder="File URL"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Medical Record
        </button>
      </form>
    </div>
  );
};

export default MedicalRecordsManagement;