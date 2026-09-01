import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold text-cyan-400 mb-2">404 - Trang Không Tìm Thấy</h2>
      <p className="text-sm text-slate-400 mb-6">Vui lòng quay lại bảng điều khiển DevOps Pipeline.</p>
      <Link href="/" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-colors">
        Về Trang Chủ
      </Link>
    </div>
  );
}
