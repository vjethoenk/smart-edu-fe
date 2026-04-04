import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <Hero />
      <main>{children}</main>
    </div>
  );
}
