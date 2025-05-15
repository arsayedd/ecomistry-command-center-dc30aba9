
import React from "react";
import { Commission } from "@/types";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCommissionForm } from "@/hooks/useCommissionForm";
import { CommissionDetailsFields } from "./CommissionDetailsFields";
import { CommissionValueFields } from "./CommissionValueFields";
import { CommissionDateField } from "./CommissionDateField";

interface CommissionFormProps {
  onSave: (data: any) => void;
  initialData?: Commission;
}

export default function CommissionForm({ onSave, initialData }: CommissionFormProps) {
  const { form, employees, isSubmitting, handleSubmit } = useCommissionForm(initialData, onSave);

  // Create a compatible employees array for the commission form
  const formattedEmployees = employees.map(emp => ({
    id: emp.id,
    full_name: emp.full_name,
    // Include all other required User properties
    email: emp.email,
    department: emp.department,
    role: emp.role,
    permission_level: emp.permission_level,
    employment_type: emp.employment_type,
    salary_type: emp.salary_type,
    status: emp.status,
    access_rights: emp.access_rights,
    commission_type: emp.commission_type,
    commission_value: emp.commission_value,
    job_title: emp.job_title,
    created_at: emp.created_at,
    updated_at: emp.updated_at
  }));

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <CommissionDetailsFields form={form} employees={formattedEmployees} />
            <div className="mt-6">
              <CommissionValueFields form={form} />
            </div>
            <div className="mt-6">
              <CommissionDateField form={form} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "جاري الحفظ..." : "حفظ العمولة"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
