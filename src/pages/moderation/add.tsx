
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ModerationReportForm from '@/components/moderation/ModerationReportForm';

const AddModerationPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/moderation');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">إضافة تقرير مودريشن جديد</h1>
        <p className="text-muted-foreground">أدخل بيانات تقرير المودريشن للموظفين</p>
      </div>

      <ModerationReportForm onSuccess={handleSubmit} />
    </div>
  );
};

export default AddModerationPage;
