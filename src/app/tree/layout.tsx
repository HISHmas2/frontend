import Header from '@/src/components/common/Header';
import MailboxButton from '@/src/app/tree/components/buttons/MailboxButton';
import AppHeightSetter from '@/src/components/AppHeightSetter';

export default function TreeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-[var(--app-height)] flex justify-center bg-transparent">
      <AppHeightSetter />

      <div className="relative w-full max-w-[414px] h-[var(--app-height)] bg-transparent overflow-hidden">
        <Header />

        {/* ✅ page가 화면을 책임 */}
        <div className="relative w-full mt-[56px] h-[calc(var(--app-height)-56px)]">{children}</div>

        <div className="fixed top-[calc(8px+env(safe-area-inset-top))] right-2 z-[9999]">
          <MailboxButton />
        </div>
      </div>
    </div>
  );
}
