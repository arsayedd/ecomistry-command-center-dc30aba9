
import { useNavigate } from "react-router-dom";
import ContentMediaBuyingForm from "@/components/content/ContentMediaBuyingForm";

export default function AddContentMediaBuyingPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إضافة حملة ميديا باينج جديدة</h1>
      </div>

      <ContentMediaBuyingForm />
    </div>
  );
}
