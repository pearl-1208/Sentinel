import './globals.css';
import { ToastProvider } from '@/components/ToastProvider';

export const metadata = {
  title: 'Sentinel — Enterprise Security Operations Platform',
  description: 'Phase 3 Advanced Security Assessment, Threat Intelligence & Compliance Engine',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#080C14] text-slate-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
