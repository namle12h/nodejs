
export default function NoPage() {
  return (
     <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600">404</h1>
                <p className="mt-4 text-2xl">Trang không tìm thấy</p>
                <p className="mt-2 text-gray-600">Xin vui lòng kiểm tra lại URL hoặc quay lại trang chủ.</p>
                <a href="/" className="mt-4 inline-block px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Quay lại trang chủ
                </a>
            </div>
        </div>
  )
}
