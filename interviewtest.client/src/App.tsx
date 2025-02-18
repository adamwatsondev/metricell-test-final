import { useEffect, useState } from "react";
import Header from "./components/layout/header";
import {
  Box,
  Button,
  Dialog,
  Flex,
  Table,
  Tabs,
  Text,
  TextField,
  Theme,
  Tooltip,
} from "@radix-ui/themes";
import { Toaster, toast } from "sonner";

interface Employee {
  id: number;
  name: string;
  value: number;
}

interface GroupedSummedEmployee {
  key: string;
  value: number;
  employees: string[];
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState({ name: "", value: 0 });
  const [summedEmployees, setSummedEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [groupedSummedEmployees, setGroupedSummedEmployees] = useState<
    GroupedSummedEmployee[]
  >([]);

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

  const editEmployee = async (employee: Employee) => {
    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
      });

      if (response.ok) {
        toast.success("Employee updated successfully.");
        fetchEmployees();
        setEditingEmployee(null); // Close the dialog
      } else {
        toast.error("Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee");
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
                  open={!!editingEmployee}
                  onOpenChange={(open) => !open && setEditingEmployee(null)}
                >
                  <Dialog.Trigger>
                    <Button
                      color="gray"
                      onClick={() => setEditingEmployee(employee)}
                    >
                      <img
                        src="/icons/edit.svg"
                        className="size-6"
                        alt="delete"
                      />
                    </Button>
                  </Dialog.Trigger>

                  <Dialog.Content maxWidth="450px">
                    <Dialog.Title>Edit Employee</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                      Edit the details of the employee.
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                      <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                          Name
                        </Text>
                        <TextField.Root
                          placeholder="Enter a name"
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
                          placeholder="Enter a value"
                          type="number"
                          value={editingEmployee?.value || ""}
                          onChange={(e) =>
                            setEditingEmployee({
                              ...editingEmployee!,
                              value: parseInt(e.target.value) || 0,
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
                          onClick={() => {
                            if (editingEmployee) {
                              editEmployee(editingEmployee);
                            }
                          }}
                          variant="solid"
                          color="green"
                        >
                          Save
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

  const updateValues = async () => {
    try {
      const response = await fetch("/api/list/update-values", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Values updated successfully.");
        fetchEmployees();
      } else {
        toast.error("Failed to update values.");
      }
    } catch (error) {
      console.error("Error updating values:", error);
      toast.error("Failed to update values.");
    }
  };

  const fetchSummedValues = async () => {
    try {
      const response = await fetch("/api/list/sum-values");
      if (response.ok) {
        const data = await response.json();
        setSummedEmployees(data.employees);
        toast.success(`Total Sum: ${data.totalSum}`);
      } else {
        toast.info("No sum data available.");
      }
    } catch (error) {
      console.error("Error fetching sum values:", error);
      toast.error("Failed to fetch sum values.");
    }
  };

  const fetchGroupedSummedValues = async () => {
    try {
      const response = await fetch("/api/list/sum-values-grouped");
      if (response.ok) {
        const data = await response.json();
        setGroupedSummedEmployees(data);
        toast.success("Grouped Summed Values fetched.");
      } else {
        toast.info("No data available for grouped sums.");
      }
    } catch (error) {
      console.error("Error fetching grouped summed values:", error);
      toast.error("Failed to fetch grouped summed values.");
    }
  };

  return (
    <>
      <Theme>
        <div className="fixed top-0 left-0 w-full z-10 bg-white shadow-md h-16">
          <Header />
        </div>
        <div className="flex pt-40 flex-col px-40 gap-4">
          <Tabs.Root defaultValue="account">
            <Tabs.List>
              <Tabs.Trigger value="employees">Employees</Tabs.Trigger>
              <Tabs.Trigger value="summed">
                Summed Employees - Attempt 1/Wrong
              </Tabs.Trigger>
              <Tabs.Trigger value="grouped">
                Grouped Employees - Attempt 2/Correct
              </Tabs.Trigger>
            </Tabs.List>

            <Box pt="3">
              <Tabs.Content className="flex flex-col gap-4" value="employees">
                <div className="flex justify-between">
                  <span className="text-2xl font-bold">
                    Employees: {employees.length}
                  </span>
                  <div className="flex gap-2">
                    <Tooltip content="Increment the field `Value` by 1 where the field `Name` starts with ‘E’, by 10 where `Name` starts with ‘G’ and all others by 100.">
                      <Button
                        onClick={updateValues}
                        variant="outline"
                        color="blue"
                      >
                        Update Employee Values
                      </Button>
                    </Tooltip>
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
                                setNewEmployee({
                                  ...newEmployee,
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
                              placeholder="Enter a value"
                              type="number"
                              value={newEmployee.value || ""}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setNewEmployee({
                                  ...newEmployee,
                                  value:
                                    newValue === ""
                                      ? 0
                                      : parseInt(newValue) || 0,
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
                            <Button
                              onClick={addEmployee}
                              variant="solid"
                              color="green"
                            >
                              Add
                            </Button>
                          </Dialog.Close>
                        </Flex>
                      </Dialog.Content>
                    </Dialog.Root>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <EmployeeTable
                    employees={employees}
                    removeEmployee={removeEmployee}
                  />
                </div>
              </Tabs.Content>

              <Tabs.Content value="summed">
                <div className="flex justify-center gap-4">
                  <Button onClick={fetchSummedValues} color="blue">
                    {summedEmployees.length > 0
                      ? "Refetch Summed Values"
                      : "Fetch Summed Values"}
                  </Button>
                </div>
                {summedEmployees.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <span className="text-2xl font-bold">
                      Summed Employees: {summedEmployees.length}
                    </span>
                    <Table.Root variant="surface">
                      <Table.Header>
                        <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
                      </Table.Header>
                      <Table.Body>
                        {summedEmployees.map((employee) => (
                          <Table.Row key={employee.id}>
                            <Table.Cell>{employee.id}</Table.Cell>
                            <Table.Cell>{employee.name}</Table.Cell>
                            <Table.Cell>{employee.value}</Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                    <span className="text-2xl font-bold text-end">
                      Total Sum:{" "}
                      {summedEmployees.reduce(
                        (acc, employee) => acc + employee.value,
                        0
                      )}
                    </span>
                  </div>
                )}
              </Tabs.Content>

              <Tabs.Content value="grouped">
                <div className="flex justify-center gap-4">
                  <Button onClick={fetchGroupedSummedValues} color="blue">
                    {summedEmployees.length > 0
                      ? "Refetch Grouped Values"
                      : "Fetch Grouped Values"}
                  </Button>
                </div>
                <div className="flex flex-col gap-4">
                  {groupedSummedEmployees.map((group) => (
                    <div key={group.key}>
                      <span className="text-2xl font-bold">{group.key}</span>
                      <Table.Root variant="surface">
                        <Table.Header>
                          <Table.ColumnHeaderCell>
                            Employees
                          </Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Sum</Table.ColumnHeaderCell>
                        </Table.Header>
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell>
                              <ul>
                                {group.employees.map((employee, index) => (
                                  <li key={index}>{employee}</li>
                                ))}
                              </ul>
                            </Table.Cell>
                            <Table.Cell>{group.value}</Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table.Root>
                    </div>
                  ))}
                </div>
              </Tabs.Content>
            </Box>
          </Tabs.Root>

          <Toaster />
        </div>
      </Theme>
    </>
  );
}

export default App;
