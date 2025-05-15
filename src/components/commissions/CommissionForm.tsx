
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

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <CommissionDetailsFields form={form} employees={employees} />
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
