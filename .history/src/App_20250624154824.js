import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div>
      <header style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Living Dead Design Co.</h1>
        <p>Handcrafted Gothic Goods for the Living & the Dead</p>
      </header>

      <main style={{ padding: "2rem" }}>
        <button>Shop Now</button>
      </main>

      <footer style={{ padding: "1rem", textAlign: "center", marginTop: "3rem" }}>
        &copy; {new Date().getFullYear()} Living Dead Design Co.
      </footer>
    </div>
  );
}

export default App;

