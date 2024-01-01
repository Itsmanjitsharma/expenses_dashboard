import { HiAdjustments } from "react-icons/hi";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import "./Transaction.css";
import { useEffect, useState } from "react";
import { SiExpensify } from "react-icons/si";
import DatePicker from "react-datepicker";
import { FaSearch } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Transaction = () => {

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const navigate = useNavigate();
  const [selected, setSelected] = useState("Income");

  useEffect(() => {
    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Calculate one week ago
    setStartDate(oneWeekAgo);
    setEndDate(currentDate);
    handleSearchButton();
  }, []);

  const handleSelected = (option) => {
    setSelected(option);
  };
  const [transaction_histories ,setTrasaction_histories] = useState([
  ]);
  const [data,setData] = useState([
]);
  const [totalAmountForPeriod, setTotalAmountForPeriod] = useState(0);
  const handleDashboard = () => {
    navigate("/");
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  const formatToMMDDYYYY = (date) => {
    if (date instanceof Date) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return date.toLocaleDateString('en-US', options).replace(/\//g, '-');    
    } else {
      return ''; // Return a default value or handle it accordingly
    }
  };
  
  const handleSearchButton = () => {
    const formattedStartDate = formatToMMDDYYYY(startDate);
    const formattedEndDate = formatToMMDDYYYY(endDate);
    axios
      .get(`http://localhost:9090/getExpenses?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
      .then((response) => {
        const totalExpenses = response.data.reduce((total, item) => total + item.expenseValue, 0);
        setTotalAmountForPeriod(totalExpenses);
        const aggregatedData = response.data.reduce((acc, item) => {
            const dateKey = new Date(item.date).toLocaleString('en-US');
            const existingDate = acc.find((data) => data.axises === dateKey);
            if (existingDate) {
              existingDate.amount += item.expenseValue;
            } else {
              acc.push({
                axises: new Date(dateKey).getDate(),
                amount: item.expenseValue,
              });
            }
      
            return acc;
          }, []);
      
          // Update the data state with aggregatedData
          setData(aggregatedData);
        

        const updatedTransactionHistories = response.data.reduce((acc, item) => {
            const existingCategory = acc.find((accItem) => accItem.category === item.category);
    
            if (existingCategory) {
              existingCategory.amount += item.expenseValue;
            } else {
              acc.push({
                category: item.category,
                amount: item.expenseValue,
              });
            }
    
            return acc;
          }, []);  
        // Update transaction_histories state
        setTrasaction_histories(updatedTransactionHistories);
  
      })
      .catch((e) => {
        console.error(e);
      });
  };
  return (
    <div className="transaction">
      <div className="stickyHeader">
        <div className="transaction_header">
          <BsArrowLeftCircleFill
            onClick={handleDashboard}
            style={{ cursor: "pointer" }}
          />
          <h3>Transaction</h3>
          <HiAdjustments />
        </div>
        <div className="moveableDiv">
          <div
            className={`income ${selected === "Income" ? "selected" : ""}`}
            onClick={() => handleSelected("Income")}
          >
            Income
          </div>
          <div
            className={`expenses ${selected === "Expenses" ? "selected" : ""}`}
            onClick={() => handleSelected("Expenses")}
          >
            Expenses
          </div>
        </div>
      </div>
      <div className="graph">
      <div className="data-and-button">
            <div className="Dates"><DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              placeholderText="Start Date"
            /> to <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            placeholderText="End Date"
          /></div>
            <div className="search-button-container">
            <FaSearch onClick={handleSearchButton}/>
      </div>
    </div>
        <div className="graph_heading">
          <p>
          {formatToMMDDYYYY(startDate)} - {formatToMMDDYYYY(endDate)}
         </p>
          <h3>{totalAmountForPeriod}</h3>
          <div className="ResponsiveContainer">
            <ResponsiveContainer width="90%" height={250}>
              <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                barSize={10}
              >
                <XAxis
                  dataKey="axises"
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="amount"
                  fill="#8884d8"
                  background={{ fill: "#eee" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="transaction_history">
        {transaction_histories.map((history, index) => (
          <div className="history">
            <div className="item item1">
              <SiExpensify style={{ fontSize: "25px" }} />
              <h3>{history.category}</h3>
            </div>
            <div className="item item2">
              <h5>{history.amount}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Transaction;
