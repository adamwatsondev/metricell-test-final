import { useEffect, useState } from "react";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";

interface Employee {
  id: number;
  name: string;
  value: number;
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState({ name: "", value: 0 });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const response = await fetch("api/employees");
    const data = await response.json();
    setEmployees(data);
  };

  //   const addEmployee = async () => {
  //     const response = await fetch("api/employees", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(newEmployee),
  //     });
  //     if (response.ok) {
  //       fetchEmployees();
  //       setNewEmployee({ name: "", value: 0 });
  //     }
  //   };

  //   const removeEmployee = async (id: number) => {
  //     const response = await fetch(`api/employees/${id}`, {
  //       method: "DELETE",
  //     });
  //     if (response.ok) {
  //       fetchEmployees();
  //     }
  //   };

  // const updateEmployee = async (id: number, updatedEmployee: Employee) => {
  //   const response = await fetch(`api/employees/${id}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(updatedEmployee),
  //   });
  //   if (response.ok) {
  //     fetchEmployees();
  //   }
  // };

  return (
    <>
      {/* <div>
        Connectivity check:{" "}
        {employees.length > 0 ? `OK (${employees.length})` : `NOT READY`}
      </div> */}
      <div className="fixed top-0 left-0 w-full z-10 bg-white shadow-md h-16">
        <Header />
      </div>
      <div className="flex pt-40 flex-col px-40 gap-20">
        <span className="text-2xl font-bold">
          Employees: {employees.length}
        </span>
        <ul>
          {employees.map((employee) => (
            <li key={employee.id}>
              {employee.name}: {employee.value}
              {/* <button onClick={() => removeEmployee(employee.id)}>
                Remove
              </button> */}
              {/* <button
                onClick={() =>
                  updateEmployee(employee.id, {
                    ...employee,
                    value: employee.value + 1,
                  })
                }
              >
                Increment Value
              </button> */}
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
}

export default App;
