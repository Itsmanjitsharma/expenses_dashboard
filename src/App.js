import logo from './logo.svg';
import './App.css';
import Dashboard from './components/Dashboard';
import AddExpenses from './components/Add_Expenses';
import Transaction from './components/Transaction';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <div className='expensesContainer'>
      <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/AddExpenses" element={<AddExpenses />} />
        <Route path="/Transaction" element={<Transaction />} />
      </Routes>
    </Router>
      </div>
    </div>
  );
}

export default App;
