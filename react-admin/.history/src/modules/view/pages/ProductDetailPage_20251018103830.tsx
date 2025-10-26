import Footer from "../../../shared/components/Footer";
import Header from "../../../shared/components/Header";
import ProductDetailHead from "../components/ProductDetailHead";
import ProductTabs from "../components/ProductTabs";
import RelatedProducts from "../components/RalatedProducts";

export default function ProductDetailPage() {
  return (
    <div>
        <Header/>
        <ProductDetailHead/>
        <ProductTabs/>
        <RelatedProducts/>
        <Footer/>
    </div>
  )
}
