import { useEffect, useState } from "react";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import {
  Button,
  Dialog,
  Flex,
  Table,
  Text,
  TextField,
  Theme,
} from "@radix-ui/themes";
import { Toaster, toast } from "sonner";

interface Employee {
  id: number;
  name: string;
  value: number;
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState({ name: "", value: 0 });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const response = await fetch("api/employees");
    const data = await response.json();
    setEmployees(data);
  };

  const addEmployee = async () => {
    try {
      const response = await fetch("api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      if (response.ok) {
        fetchEmployees();
        setNewEmployee({ name: "", value: 0 });
        toast.success("Employee added successfully.");
      } else {
        const errorMessage = await response.text();
        console.error("Failed to add employee:", errorMessage);
        toast.error("Failed to add employee");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee");
    }
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
      toast.error("Failed to remove employee");
      fetchEmployees();
    }
  };

  const updateEmployee = async () => {
    if (editingEmployee) {
      try {
        const response = await fetch(`api/employees/${editingEmployee.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingEmployee),
        });

        if (response.ok) {
          fetchEmployees();
          toast.success("Employee updated successfully.");
          setEditingEmployee(null);
        } else {
          const errorMessage = await response.text();
          console.error("Failed to update employee:", errorMessage);
          toast.error("Failed to update employee");
        }
      } catch (error) {
        console.error("Error updating employee:", error);
        toast.error("Failed to update employee");
      }
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
              <Table.Cell className="flex justify-end gap-2 items-center">
                <Dialog.Root
                  onOpenChange={(open) => open || setEditingEmployee(null)}
                >
                  <Dialog.Trigger>
                    <Button color="gray">
                      <img
                        src="/icons/edit.svg"
                        className="text-white size-6"
                        alt="edit"
                      />
                    </Button>
                  </Dialog.Trigger>

                  <Dialog.Content maxWidth="450px">
                    <Dialog.Title>Edit Employee</Dialog.Title>

                    <Flex direction="column" gap="3">
                      <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                          Name
                        </Text>
                        <TextField.Root
                          value={editingEmployee?.name || ""}
                          onChange={(e) =>
                            setEditingEmployee({
                              ...editingEmployee!,
                              name: e.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                          Value
                        </Text>
                        <TextField.Root
                          value={editingEmployee?.value || ""}
                          type="number"
                          onChange={(e) =>
                            setEditingEmployee({
                              ...editingEmployee!,
                              value: e.target.value
                                ? parseInt(e.target.value)
                                : 0,
                            })
                          }
                        />
                      </label>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                      <Dialog.Close>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </Dialog.Close>
                      <Dialog.Close>
                        <Button
                          onClick={updateEmployee}
                          variant="solid"
                          color="green"
                        >
                          Update
                        </Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>

                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button color="red">
                      <img
                        src="/icons/delete.svg"
                        className="text-white size-6"
                        alt="delete"
                      />
                    </Button>
                  </Dialog.Trigger>

                  <Dialog.Content maxWidth="450px">
                    <Dialog.Title>Delete Confirmation</Dialog.Title>

                    <Flex direction="column" gap="3">
                      <label>
                        <Text as="div" size="2" mb="1" weight="regular">
                          Are you sure you want to delete this Employee?
                        </Text>
                      </label>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                      <Dialog.Close>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </Dialog.Close>
                      <Dialog.Close>
                        <Button
                          onClick={() => removeEmployee(employee.id)}
                          variant="solid"
                          color="red"
                        >
                          Delete
                        </Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>
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
            <Dialog.Root>
              <Dialog.Trigger>
                <Button color="green">
                  <img
                    src="/icons/plus.svg"
                    className="text-white size-6"
                    alt="add"
                  />
                </Button>
              </Dialog.Trigger>

              <Dialog.Content maxWidth="450px">
                <Dialog.Title>Add Employee</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                  Add an Employee to the database.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                  <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Name
                    </Text>
                    <TextField.Root
                      placeholder="Enter a first name"
                      value={newEmployee.name}
                      onChange={(e) =>
                        setNewEmployee({ ...newEmployee, name: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Value
                    </Text>
                    <TextField.Root
                      placeholder="Enter a value"
                      type="number"
                      value={newEmployee.value || ""}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setNewEmployee({
                          ...newEmployee,
                          value: newValue === "" ? 0 : parseInt(newValue) || 0,
                        });
                      }}
                    />
                  </label>
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <Button onClick={addEmployee} variant="solid" color="green">
                      Add
                    </Button>
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
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
