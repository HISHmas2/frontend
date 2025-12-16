import Header from '@/src/components/common/Header';
import MailboxButton from '@/src/app/tree/components/buttons/MailboxButton';

export default function TreeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen flex justify-center bg-white">
      <div className="relative w-full max-w-[414px] min-h-screen bg-white">
        {/* Header */}
        <Header />

        {/* ✅ page가 화면을 책임짐 */}
        <div className="relative w-full mt-[56px]">{children}</div>

        {/* 우측 상단 편지함 */}
        <div className="fixed top-[calc(8px+env(safe-area-inset-top))] right-2 z-[9999]">
          <MailboxButton />
        </div>
      </div>
    </div>
  );
}
