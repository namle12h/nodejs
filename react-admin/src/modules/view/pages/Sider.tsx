import '@ant-design/v5-patch-for-react-19';
import { Carousel, Button } from 'antd';



export const slides = [
    {
        id: 1,
        title: 'Thư Giãn & Làm',
        accent: 'Đẹp',
        desc: 'Trải nghiệm dịch vụ spa cao cấp với không gian thư giãn tuyệt vời và đội ngũ chuyên gia hàng đầu.',
        image: '/upload/hero1.jpg'
    },
    {
        id: 2,
        title: 'Liệu Trình Chuyên Nghiệp',
        accent: 'Chăm Sóc',
        desc: 'Tận hưởng liệu trình chăm sóc da & cơ thể được cá nhân hoá bởi chuyên gia.',
        image: '/upload/hero2.jpg'
    },
    {
        id: 3,
        title: 'Không Gian',
        accent: 'Sang Trọng',
        desc: 'Thiết kế hiện đại, ấm cúng giúp bạn thư giãn ngay từ bước đầu.',
        image: '/upload/hero3.jpg'
    },
];


export default function HeroCarousel() {
    return (
        <Carousel autoplay effect="fade">
            {slides.map((s) => (
                <div key={s.id}>
                    <div
                        className="h-screen flex items-center justify-center bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${s.image})` }}
                    >
                        <div className="absolute inset-0 bg-black/40 "></div>
                        <div className="relative z-10 text-center text-white max-w-2xl py-2">
                            <h1 className="text-4xl md:text-6xl font-bold ">
                                {s.title} <span className="text-pink-500">{s.accent}</span>
                            </h1>
                            <p className="mt-4 text-lg md:text-xl">{s.desc}</p>
                            <div className="mt-6 flex justify-center gap-4">
                                <Button size="large" className="!bg-pink-600 opacity-70 "><span className='text-white'> Đặt Lịch Ngay</span></Button>
                                <Button size="large" className='border border-pink-500'><span className='text-pink-500'> Xem Dịch Vụ</span></Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </Carousel>
    );
}