
import { Suspense } from "react";
import PaymentSuccess from "../components/PaymentSuccess";

export default function page() {
    return (
        <div>
            <Suspense fallback={<p>Đang tải...</p>}>
                <PaymentSuccess />
            </Suspense>
        </div>
    )
}