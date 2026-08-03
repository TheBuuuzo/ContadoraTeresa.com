import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { QuoteChecklist } from "./components/QuoteChecklist";
import { Structure } from "./components/Structure";
import { Support } from "./components/Support";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Structure />
        <Support />
        <QuoteChecklist />
      </main>
      <Footer />
    </>
  );
}
