import Navbar from "./components/navbar/navbar";
import CustomCursor from "./components/cursor/cursor";
import Main from "./components/main/main";
import Works from "./components/works/works";
import About from "./components/about/about";
import Contact from "./components/contact/contact";
import "./App.css";

function App() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <Main />
        <Works />
        <About />
        <Contact />
      </main>
    </>
  );
}

export default App;
