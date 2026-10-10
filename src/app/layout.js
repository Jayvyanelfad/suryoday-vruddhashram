import "./globals.css";

export const metadata = {
  title: {
    default: "Suryoday Vruddhashram | Elder Care in Pune",
    template: "%s | Suryoday Vruddhashram",
  },
  description: "Learn about Suryoday Vruddhashram, elder care, companionship, and ways to connect with the organization in Pune, India.",
  applicationName: "Suryoday Vruddhashram",
  openGraph: {
    title: "Suryoday Vruddhashram",
    description: "Elder care and community support in Pune, India.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
