import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { QuoteChecklist } from "./components/QuoteChecklist";
import { Structure } from "./components/Structure";
import { Support } from "./components/Support";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Structure />
        <Support />
        <QuoteChecklist />
      </main>
      <Footer />
    </>
  );
}
