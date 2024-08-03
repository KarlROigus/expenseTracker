import { useState, useEffect } from 'react'
import { v4 as uuid} from 'uuid';
import './App.css'
import PieChart from './PieChart';

function App() {

  const labels = ["Utilities", "Insurances", "PhoneAndInternet", "Gym",
  "Subscriptions", "Groceries", "EatingOut", "Loan", "Clothes", "SkinCare", "Other"];

  function createParsedValues(input) {

    const placeholder = labels.reduce((pack, label) => {
      pack[label] = 0;
      return pack;
    }, {});

    input.forEach(element => {
      if (placeholder.hasOwnProperty(element.expenseType)) {
        placeholder[element.expenseType] += parseFloat(element.cost);
      }
    });
    return placeholder;
  }

  const [totalCosts, setTotalCosts] = useState(() => {
    const initial = localStorage.getItem("TOTALCOSTS");
    if (initial == null) {
      return labels.reduce((pack, label) => {
        pack[label] = 0;
        return pack;
      }, {})
    } else {
      const asObject = JSON.parse(initial);
      return createParsedValues(asObject);
    }
  });


  const [expenseList, setExpenseList] = useState(() => {
    const runner = localStorage.getItem("EXPENSES")
    if (runner == null) return [];
    return JSON.parse(runner);
  });

  const [isListVisible, setListVisible] = useState(false);
  const [isNewExpenseFormVisible, setNewExpenseFormVisible] = useState(false);


  useEffect(() => {
    localStorage.setItem("EXPENSES", JSON.stringify(expenseList))
  }, [expenseList]);

  useEffect(() => {
    localStorage.setItem("TOTALCOSTS", JSON.stringify(expenseList))
  }, [totalCosts]);

  function toggleListVisibility() {
    setListVisible(!isListVisible);
  }

  function toggleNewExpenseForm() {
    setNewExpenseFormVisible(!isNewExpenseFormVisible);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const newExpense = {expenseType: e.target.expenseType.value,
      cost: e.target.cost.value,
      id: uuid(),
      date: e.target.date.value,
      information: e.target.other.value};
    
    setExpenseList(currentList => {
      return [...currentList, newExpense]
    })

    setTotalCosts(currentTotal => {
      const newTotal = { ...currentTotal };
      newTotal[newExpense.expenseType] += parseFloat(newExpense.cost);
      return newTotal;
    })

    toggleNewExpenseForm();
  }

  function resetExpenses() {
    setExpenseList([]);
    localStorage.removeItem("EXPENSES");
    localStorage.removeItem("TOTALCOSTS");
    setTotalCosts(() => {
      return labels.reduce((pack, label) => {
        pack[label] = 0;
        return pack;
      }, {})
    })
  }

  function deleteAnExpense(id, cost, type) {
    setExpenseList(currentExpenses => {
      return currentExpenses.filter(expense => expense.id !== id)
    })
    setTotalCosts(currentTotal => {
      const updatedTotal = { ...currentTotal };
      if (updatedTotal[type] != 0) {
        updatedTotal[type] -= parseFloat(cost);
      }
      return updatedTotal;
    })

  }


  return (
    <>
      <div className="header">
        <div>
          <h1>Expense Tracker</h1>
        </div>
      </div>
      <div className="content">
      <div className="leftPart">
        <div className="buttonarea">
          <button className="expensebutton" onClick={toggleListVisibility}>
              {isListVisible ? "Hide Expenses" : "Show Expenses"}
          </button>
          <button className="expensebutton" onClick={toggleNewExpenseForm}>
            Add New Expense
          </button>
          <button className="expensebutton" onClick={resetExpenses}>
            Reset All Expenses
          </button>
        </div>
        
        {isListVisible && 
              <div className="listarea">
                <ul>
                  {expenseList.map(each => <li key={each.id}>
                    Date: {each.date}
                    <br></br>
                    Expense Type: {each.expenseType} 
                    <br></br>
                    Cost: {each.cost}
                    <br />
                    Information: {each.information}
                    <button className="deletebutton" onClick={() => deleteAnExpense(each.id, each.cost, each.expenseType)}>
                      Delete Expense
                    </button>
                    </li>)}
                </ul>
              </div>
        }

        {isNewExpenseFormVisible && 
          <fieldset>
              <legend>Expense</legend>
              <form action="#" className="newexpenseform" onSubmit={handleFormSubmit}>
                <label htmlFor="expenseType">Expense Type: </label>
                <select name="cars" id="expenseType">
                  <option value=""></option>
                  <option value="Utilities">Utility</option>
                  <option value="Insurances">Insurance</option>
                  <option value="PhoneAndInternet">Phone And Internet</option>
                  <option value="Gym">Gym Membership</option>
                  <option value="Subscriptions">Subscription</option>
                  <option value="Groceries">Groceries</option>
                  <option value="EatingOut">Eating Out</option>
                  <option value="Loan">Loan</option>
                  <option value="Clothes">Clothes</option>
                  <option value="Skincare">Skin Care</option>
                  <option value="Other">Other</option>
                </select>

                <label htmlFor="cost">Cost: </label>
                <input type="number" id="cost" step="0.01" min="0.01"/>

                <label htmlFor="date">Date: </label>
                <input type="date" id="date"/>

                <label htmlFor="other">Information: </label>
                <textarea name="other" id="other" cols="30" rows="10"></textarea>

                <input type="submit" className="submitBtn"/>
              </form>
          </fieldset>
          }
        </div>
      <div className="rightPart">
        <PieChart labels={labels} values={Object.values(totalCosts)}/>
      </div>
      </div>

    </>
  )
}

export default App
