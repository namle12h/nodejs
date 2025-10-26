import { useParams } from "react-router-dom";
import Footer from "../../../shared/components/Footer";
import BenefitsAndResults from "../components/Benefit";
import CustomerReviews from "../components/CustomerReview";
import HeadServiceDetail from "../components/HeadServiceDetail";
import ImportantNotes from "../components/ImportantNotes";
import ProcessSteps from "../components/ProcessStep";
import UsedProducts from "../components/UsedProducts";
import BookingButton from "../components/ButtonBooking";
import BookingModal from "../components/BookingModal";
import { useState } from "react";
import BookingButtonFixed from "../components/ButtonBooking";



export default function ServiceDetailPage() {

  const { id } = useParams<{ id: string }>();
  const serviceId = Number(id);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <HeadServiceDetail />
      <ProcessSteps />
      <BenefitsAndResults />
      <UsedProducts serviceId={serviceId} />
      <ImportantNotes />
      <CustomerReviews serviceId={serviceId} />
      <BookingModal open={open} onClose={() => setOpen(false)} />
      <BookingButtonFixed onClick={() => setOpen(true)} // 👈 Khi click nút thì mở modal
        color="red" />
      <Footer />
    </div>
  )
}
