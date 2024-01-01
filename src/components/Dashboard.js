import "./Dashboard.css";
import { IoSettings } from "react-icons/io5";
import { FaCircleArrowDown } from "react-icons/fa6";
import { FaArrowCircleUp } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
import { AiOutlineShopping } from "react-icons/ai";
import { FaHandHoldingWater } from "react-icons/fa";
import { FcEnteringHeavenAlive } from "react-icons/fc";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuPlus } from "react-icons/lu";
import axios from "axios";
import { GiShoppingBag } from "react-icons/gi";
import { FaMoneyBills } from "react-icons/fa6";
import { MdEmojiTransportation } from "react-icons/md";
import {Legend,
    Pie,
    PieChart,
    ResponsiveContainer, // Add this line to import ResponsiveContainer
    Tooltip,
    Cell,
  } from 'recharts';


const Dashboard = () => {
  const navigate = useNavigate();
  const iconMapping = {
    Food: <IoFastFoodOutline size={32} color="var(--primary)" />,
    Electricity: <AiOutlineShopping size={32} color="red" />,
    Water: <FaHandHoldingWater size={32} color="green" />,
    Entertainment: <FcEnteringHeavenAlive size={32} color="white" />,
    Travel: <FcEnteringHeavenAlive size={32} color="white" />,
    Shopping: <GiShoppingBag size={32} color="white" />,
    Other: <FcEnteringHeavenAlive size={32} color="white" />,
    Bills: <FaMoneyBills size={32} color="white" />,
    Transportation: <MdEmojiTransportation size={32} color="white" />
  };

  const [data, setData] = useState([]);
  const [filteredData,setFilteredData] = useState([]);
  const [totalExpenses,setTotalExpenses] = useState(0);
  const [income] = useState(0);
  const [chartData,setChartData] = useState([]);
  const [selectedPeriod,setSelectedPeriod] = useState('Select Period'); 
  const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#999966'];
  const handlePeriodChange = (e) => {
    const period = e.target.value;
    setSelectedPeriod(period);
    const currentDate = new Date();
    const filteredTransaction = data.filter((item) => {
      const itemDate = new Date(item.date);
      if (period === 'Today') {
        return itemDate.toDateString() === currentDate.toDateString();
      } else if (period === 'Yesterday') {
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);
        return itemDate.toDateString() === yesterday.toDateString();
      } else if (period === 'Week') {
        const sevenDaysAgo = new Date(currentDate);
        sevenDaysAgo.setDate(currentDate.getDate() - 7);
        return itemDate >= sevenDaysAgo && itemDate <= currentDate;
      } else if (period === 'Month') {
        return itemDate.getMonth() === currentDate.getMonth() && itemDate.getFullYear() === currentDate.getFullYear();
      } else if (period === 'Six Months') {
        const sixMonthsAgo = new Date(currentDate);
        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
        return itemDate >= sixMonthsAgo && itemDate <= currentDate;
      } else if (period === 'Year') {
        return itemDate.getFullYear() === currentDate.getFullYear();
      } else {
        return true; // Return all data if no condition matches
      }
    });
    const transformedData = filteredTransaction.map((item) => {
        return {
          icon: iconMapping[item.category],
          title: item.category,
          value: item.expenseValue,
          time: item.date,
        };
      });
      const totalExpenseValue = transformedData.reduce(
        (accumulator, currentItem) => accumulator + currentItem.value,
        0
      );
      const groupedData = transformedData.reduce((acc, item) => {
        if (!acc[item.title]) {
          acc[item.title] = { title: item.title, totalValue: 0 };
        }
        acc[item.title].totalValue += item.value;
        return acc;
      }, {});
      const formattedChartData = Object.entries(groupedData).map(([title, { totalValue }]) => ({
        name: title,
        value: totalValue,
      }));
      setChartData(formattedChartData);
      setTotalExpenses(totalExpenseValue);
    setFilteredData(transformedData);
  };
  useEffect(() => {
    fetchDataDetails();
  }, []);
  const fetchDataDetails = () => {
    axios
    .get(`http://localhost:9090/getAllRecords?period=${selectedPeriod}`)
    .then((response) => {
      const fetchedData = response.data;
      setData(fetchedData);
      const sortedData = [...fetchedData].sort((a, b) => {
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        
        // Sort in ascending order based on time
        return dateB - dateA; // Reverse the comparison for descending order
      });
      const transformedData = sortedData.map((item) => {
        return {
          icon: iconMapping[item.category],
          title: item.category,
          value: item.expenseValue,
          time: item.date,
        };
      });
      const totalExpenseValue = transformedData.reduce(
        (accumulator, currentItem) => accumulator + currentItem.value,
        0
      );
      const groupedData = transformedData.reduce((acc, item) => {
        if (!acc[item.title]) {
          acc[item.title] = { title: item.title, totalValue: 0 };
        }
        acc[item.title].totalValue += item.value;
        return acc;
      }, {});
      
      // Transform groupedData into an array of objects for recharts Pie component
      const formattedChartData = Object.entries(groupedData).map(([title, { totalValue }]) => ({
        name: title,
        value: totalValue,
      }));
      setChartData(formattedChartData);
      setTotalExpenses(totalExpenseValue);
      setFilteredData(transformedData)
    })
    .catch((error) => {
      console.error("Error while fetching data:", error);
    });
  }
  const handleAddExpensesView = () => {
    navigate("/AddExpenses");
  };
  const handleTransactionView = () => {
    navigate("/Transaction");
  };

 
  return (
    <div className="dashboard">
      <div className="stickyHeader">
        <div className="dashboard_header">
          <div className="profile">
            <div className="profileImage">
              <img
                src="https://img.freepik.com/premium-photo/cartoon-man-shirt-tie-standing-with-his-hands-his-hips-generative-ai_902846-28479.jpg"
                style={{ width: "40px", height: "40px", borderRadius: "100%" }}
              alt=""
              ></img>
            </div>
            <div className="profileDetails">
              <p>Welcome</p>
              <h4>Manjit</h4>
            </div>
          </div>
          <div className="icons">
            <div className="settingIcon">
              <LuPlus
                onClick={handleAddExpensesView}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="settingIcon">
              <IoSettings
                onClick={handleTransactionView}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="description">
            <div className="incomes">
              <div>
                <FaCircleArrowDown />
              </div>
              <div>
                <p>Income</p>
                <h3>₹{income}</h3>
              </div>
            </div>
            <div className="expensess">
              <div>
                <FaArrowCircleUp />
              </div>
              <div>
                <p>Expenses</p>
                <h3>₹{totalExpenses}</h3>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="45%"
                cy="62%"
                outerRadius={50}
              >
                {chartData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
      ))}
                </Pie>
              <Tooltip />
              <Legend 
              align="right"
              verticalAlign="bottom"
              layout="vertical"
              />
            </PieChart>
      </ResponsiveContainer>
        </div>
        <div className="headings">
		<h2>Transactions</h2>
          <select value={selectedPeriod} onChange={(e)=>handlePeriodChange(e)}>
            <option value="">Select Period</option>
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="Week">Week</option>
            <option value="Month">Month</option>
            <option value="Quarter">Quarter</option>
            <option value="Six Months">Six Months</option>
            <option value="Year">Year</option>
            {/* Add other time period options as needed */}
          </select>
        </div>
      </div>
      {filteredData.map((every, index) => (
        <div className="dailyTransaction">
          <div className="itemsDescription">
            {every.icon}
            <p> {every.title}</p>
          </div>
          <div className="valueAndDay">
            <h3>₹{every.value}</h3>
            <p>{every.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Dashboard;
