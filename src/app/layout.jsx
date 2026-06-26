import './globals.css';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider';
import NextAuthProvider from '@/components/NextAuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: {
    default: 'DocAppoint - Book Appointments with Top Doctors',
    template: '%s - DocAppoint',
  },
  description:
    'Book appointments with top doctors. Manage your health records, find specialists, and take control of your healthcare journey with DocAppoint.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <AuthProvider>
            <Navbar />
            <main className="pt-16">{children}</main>
            <Footer />
            <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1E293B',
                color: '#fff',
                borderRadius: '10px',
              },
              success: {
                iconTheme: { primary: '#007A87', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
