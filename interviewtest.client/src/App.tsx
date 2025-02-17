import { useEffect, useState } from "react";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import { Button, Table, Theme } from "@radix-ui/themes";
import { Toaster, toast } from "sonner";
import { XIcon } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  value: number;
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  //   const [newEmployee, setNewEmployee] = useState({ name: "", value: 0 });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const response = await fetch("api/employees");
    const data = await response.json();
    setEmployees(data);
  };

  const removeEmployee = async (id: number) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => employee.id !== id)
    );

    try {
      const response = await fetch(`api/employees/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      toast.success("Removed Successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
      fetchEmployees();
    }
  };

  const EmployeeTable = ({
    employees,
    removeEmployee,
  }: {
    employees: Employee[];
    removeEmployee: (id: number) => void;
  }) => {
    return (
      <Table.Root variant="surface">
        <Table.Header>
          <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
        </Table.Header>

        <Table.Body>
          {employees.map((employee) => (
            <Table.Row key={employee.id}>
              <Table.Cell>{employee.id}</Table.Cell>
              <Table.Cell>{employee.name}</Table.Cell>
              <Table.Cell>{employee.value}</Table.Cell>
              <Table.Cell className="flex justify-end items-center">
                <Button
                  color="red"
                  variant="classic"
                  highContrast
                  onClick={() => removeEmployee(employee.id)}
                >
                  <XIcon />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    );
  };

  return (
    <>
      <Theme>
        <div className="fixed top-0 left-0 w-full z-10 bg-white shadow-md h-16">
          <Header />
        </div>
        <div className="flex pt-40 flex-col px-40 gap-4">
          <div className="flex justify-between">
            <span className="text-2xl font-bold">
              Employees: {employees.length}
            </span>
            <span className="text-2xl font-bold">Add</span>
          </div>
          <div className="flex flex-col gap-4">
            <EmployeeTable
              employees={employees}
              removeEmployee={removeEmployee}
            />
          </div>
          <Toaster />
        </div>
        <Footer />
      </Theme>
    </>
  );
}

export default App;
