import "./Add_Expenses.css";
import { TbCategory2 } from "react-icons/tb";
import { MdOutlineToday } from "react-icons/md";
import { FaNoteSticky } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
const Add_Expenses = () => {
  const [category,setCategory] = useState('');
  const [note,setNote] = useState('');
  const [date, setDate] = useState(new Date);
  const [expenseValue,setExpenseValue] = useState(0);
  const [inputData, setInputData] = useState({
    category: '', // Initialize with an empty object
    note: '',
    date: '',
    expenseValue: '',
  });

  const availableCategories = ['Food','Dining', ,'Shopping', 'Bills', 'Transportation', 'Entertainment','Health','Home','Travel','Personal Care',
  'Education','Gifts Donations','Pet Care','Insurance','Taxes','Childcare','Hobbies','Loans','Phone','Others'];

  const navigate = useNavigate();
  const closeExpenses = () =>{
    navigate('/');
  }
  const handleOnChangeNote =(e)=>{
      setNote(e.target.value);

  }
  
  useEffect(() => {
    setInputData({
      ...inputData,
      category,
      note,
      date: date.toISOString(),
      expenseValue,
    });
  }, [category, note, date, expenseValue]);

  const handleOnChangeExpenseValue =(e)=>{
    setExpenseValue(e.target.value);
}

const handleOnChangeCategory =(e)=>{
  setCategory(e.target.value);
}
  const handleSaveMethod = () =>{
    axios.post('http://localhost:9090/save',inputData).then((response)=>(
      console.log("Successfully added expense"),
      setCategory(''),
        setNote(''),
        setDate(new Date()),
        setExpenseValue('')
      )).catch((e)=>(
      console.error(`Error ${e}`)
    ));
    
  }
  return (
    <div className="add_expenses">
      <div className="closediv">
        <span className="close" onClick={closeExpenses}>X</span>
      </div>
      <div>
        <h3>Add Expenses</h3>
      </div>
      <div className="inputSection">
        <div>
          <input placeholder="₹0" className="expensesValue" value={expenseValue} onChange={handleOnChangeExpenseValue}/>
        </div>
        <div class="categoryMain">
          <span class="icon">
            <TbCategory2 style={{ fontSize: '25px' }}/>
          </span>
          <select class="Category" value={category} onChange={handleOnChangeCategory}>
          <option value="" disabled selected>Select Category</option>
          {availableCategories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        </div>
        <div class="noteMain">
          <span class="icon">
            <FaNoteSticky style={{ fontSize: '25px' }}/>
          </span>
          <input placeholder="Note" class="Note" value={note} onChange={handleOnChangeNote}/>
        </div>
        <div class="dateMain">
          <span class="icon">
            <MdOutlineToday style={{ fontSize: '25px' }}/>
          </span>
          <input type="date" className="Date" value={date.toISOString().split('T')[0]} onChange={(e) => setDate(new Date(e.target.value))} />
        </div>
        <button className="expensesSaveButton" onClick={handleSaveMethod}>Save</button>
      </div>
    </div>
  );
};
export default Add_Expenses;
