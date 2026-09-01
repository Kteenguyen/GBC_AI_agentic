import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Antigravity Squad Arena — DevOps CI/CD & 1v1 Solo Arena',
  description: 'Hệ thống điều phối 13 AI Subagents, 8-Stage DevOps CI/CD Pipeline, Playwright 430px Visual Test Lab và Đấu trường Solo 1v1 GitHub Trending Hunter.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
