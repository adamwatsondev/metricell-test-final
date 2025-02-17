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
                        ID = reader.GetInt32(0),  // Make sure you get the ID
                        Name = reader.GetString(1),
                        Value = reader.GetInt32(2)
                    });
                }
            }
        }

        return employees;
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        using (var connection = new SqliteConnection("Data Source=./SqliteDB.db"))
        {
            connection.Open();
            var deleteCmd = connection.CreateCommand();
            deleteCmd.CommandText = "DELETE FROM Employees WHERE ID = @id";
            deleteCmd.Parameters.AddWithValue("@id", id);
            int affectedRows = deleteCmd.ExecuteNonQuery();

            return affectedRows > 0 ? Ok() : NotFound();
        }
    }
}
}