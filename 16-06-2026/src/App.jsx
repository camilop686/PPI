import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import AcercaDe from "./components/AcercaDe";
import Login from "./components/Login";
import Registro from "./components/Registro";
import VirusInformaticos from "./components/VirusInformaticos";
import TiposVirus from "./components/TiposVirus";
import MetodosPrevencion from "./components/MetodosPrevencion";

function App() {
  return (
    <>
      <Header />
      <Menu />
      <AcercaDe />
      <Login />
      <Registro />
      <VirusInformaticos />
      <TiposVirus />
      <MetodosPrevencion />
      <Footer />
    </>
  );
}

export default App;