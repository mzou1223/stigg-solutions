import logo from './logo.svg';
import './App.css';
import ProductGrid from './components/ProductGrid';
import SearchBar from './components/SearchBar';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Stigg Pet Shop </h1>
      </header>

      <main className="app-main">

        <section className="search-section">
          <SearchBar />
        </section>

        <section className="products-section">
          <ProductGrid />
        </section>
      </main>
    </div>
  );
}

export default App;
