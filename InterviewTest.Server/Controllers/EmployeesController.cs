using InterviewTest.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace InterviewTest.Server.Controllers
{
    [ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    [HttpGet]
    public List<Employee> Get()
    {
        var employees = new List<Employee>();

        var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
        using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
        {
            connection.Open();

            var queryCmd = connection.CreateCommand();
            queryCmd.CommandText = @"SELECT ID, Name, Value FROM Employees";
            using (var reader = queryCmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    employees.Add(new Employee
                    {
                        ID = reader.GetInt32(0),
                        Name = reader.GetString(1),
                        Value = reader.GetInt32(2)
                    });
                }
            }
        }

        return employees;
    }

    // Deletes an employee from the database by ID.
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        using (var connection = new SqliteConnection("Data Source=./SqliteDB.db"))
        {
            connection.Open();

            // Prepare the SQL command to delete an employee by ID
            var deleteCmd = connection.CreateCommand();
            deleteCmd.CommandText = "DELETE FROM Employees WHERE ID = @id";
            deleteCmd.Parameters.AddWithValue("@id", id);

            // Execute the deletion and check how many rows were affected
            int affectedRows = deleteCmd.ExecuteNonQuery();

            return affectedRows > 0 ? Ok() : NotFound();
        }
    }

    // Add a new employee to the database.
    [HttpPost]
    public IActionResult AddEmployee([FromBody] Employee newEmployee)
    {
        // Validate that Name and Value are provided and valid
        if (string.IsNullOrEmpty(newEmployee.Name) || newEmployee.Value <= 0)
        {
            return BadRequest("Name and Value are required fields.");
        }

        using (var connection = new SqliteConnection("Data Source=./SqliteDB.db"))
        {
            connection.Open();

            // Prepare the SQL command to insert a new employee
            var insertCmd = connection.CreateCommand();
            insertCmd.CommandText = @"INSERT INTO Employees (Name, Value) 
                                    VALUES (@name, @value)";
            insertCmd.Parameters.AddWithValue("@name", newEmployee.Name);
            insertCmd.Parameters.AddWithValue("@value", newEmployee.Value);

            // Execute the insert and check how many rows were affected
            int affectedRows = insertCmd.ExecuteNonQuery();

            if (affectedRows > 0)
            {
                return Ok();
            }
            else
            {
                return StatusCode(500, "Failed to add employee.");
            }
        }
    }

            // Updates the details of an existing employee.
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Employee updatedEmployee)
    {
        using (var connection = new SqliteConnection("Data Source=./SqliteDB.db"))
        {
            connection.Open();
            // Prepare the SQL command to update the employee data
            var updateCmd = connection.CreateCommand();
            updateCmd.CommandText = "UPDATE Employees SET Name = @name, Value = @value WHERE ID = @id";
            updateCmd.Parameters.AddWithValue("@id", id);
            updateCmd.Parameters.AddWithValue("@name", updatedEmployee.Name);
            updateCmd.Parameters.AddWithValue("@value", updatedEmployee.Value);

            // Execute the update and check how many rows were affected
            int affectedRows = updateCmd.ExecuteNonQuery();
            
            return affectedRows > 0 ? Ok() : NotFound();
        }
    }
}}