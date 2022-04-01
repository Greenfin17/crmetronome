import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import '../styles/index.scss';
import NavBar from '../components/Navbar';
import RouterComponent from '../data/Routes';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <NavBar />
          <RouterComponent />
        </Router>
      </header>
    </div>
  );
}

export default App;
