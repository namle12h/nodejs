import Footer from "../../../shared/components/Footer";
import Header from "../../../shared/components/Header";
import FeaturedProducts from "../components/FeaturedProducts";
import ProductDetailHead from "../components/ProductDetailHead";
import ProductTabs from "../components/ProductTabs";

export default function ProductDetailPage() {
  return (
    <div>
        <Header/>
        <ProductDetailHead/>
        <ProductTabs/>
        <FeaturedProducts/>
        <Footer/>
    </div>
  )
}
