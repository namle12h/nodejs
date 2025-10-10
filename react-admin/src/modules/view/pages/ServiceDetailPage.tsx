import Footer from "../../../shared/components/Footer";
import BenefitsAndResults from "../components/Benefit";
import CustomerReviews from "../components/CustomerReview";
import HeadServiceDetail from "../components/HeadServiceDetail";
import ImportantNotes from "../components/ImportantNotes";
import ProcessSteps from "../components/ProcessStep";
import UsedProducts from "../components/UsedProducts";

export default function ServiceDetailPage() {
  return (
    <div>
      <HeadServiceDetail />
      <ProcessSteps />
      <BenefitsAndResults />
      <UsedProducts />
      <ImportantNotes/>
      <CustomerReviews/>
      <Footer/>
    </div>
  )
}
