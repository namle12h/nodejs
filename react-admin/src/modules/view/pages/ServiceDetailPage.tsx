import { useParams } from "react-router-dom";
import Footer from "../../../shared/components/Footer";
import BenefitsAndResults from "../components/Benefit";
import CustomerReviews from "../components/CustomerReview";
import HeadServiceDetail from "../components/HeadServiceDetail";
import ImportantNotes from "../components/ImportantNotes";
import ProcessSteps from "../components/ProcessStep";
import UsedProducts from "../components/UsedProducts";


export default function ServiceDetailPage() {

   const { id } = useParams<{ id: string }>();
  const serviceId = Number(id);
  return (
    <div>
      <HeadServiceDetail />
      <ProcessSteps />
      <BenefitsAndResults />
      <UsedProducts serviceId={serviceId} />
      <ImportantNotes/>
      <CustomerReviews/>
      <Footer/>
    </div>
  )
}
