using InterviewTest.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;

namespace InterviewTest.Server.Controllers
{
    [ApiController]
    [Route("api/list")]
    public class ListController : ControllerBase
    {
        private const string ConnectionString = "Data Source=./SqliteDB.db";

        [HttpPost("update-values")]
        public IActionResult UpdateValues()
        {
            using (var connection = new SqliteConnection(ConnectionString))
            {
                connection.Open();

                var updateCmd = connection.CreateCommand();
                updateCmd.CommandText = @"
                    UPDATE Employees
                    SET Value = 
                        CASE 
                            WHEN Name LIKE 'E%' THEN Value + 1
                            WHEN Name LIKE 'G%' THEN Value + 10
                            ELSE Value + 100
                        END;
                ";

                int affectedRows = updateCmd.ExecuteNonQuery();

                return affectedRows > 0 ? Ok(new { message = "Values updated successfully." }) : StatusCode(500, "No values were updated.");
            }
        }

[HttpGet("sum-values")]
public IActionResult GetSummedEmployees()
{
    var employees = new List<Employee>();
    int totalSum = 0;

    using (var connection = new SqliteConnection("Data Source=./SqliteDB.db"))
    {
        connection.Open();

        var queryCmd = connection.CreateCommand();
        queryCmd.CommandText = @"
            SELECT ID, Name, Value 
            FROM Employees 
            WHERE Name LIKE 'A%' OR Name LIKE 'B%' OR Name LIKE 'C%';
        ";

        using (var reader = queryCmd.ExecuteReader())
        {
            while (reader.Read())
            {
                var employee = new Employee
                {
                    ID = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Value = reader.GetInt32(2)
                };
                employees.Add(employee);
                totalSum += employee.Value;
            }
        }
    }

    if (totalSum >= 11171)
    {
        return Ok(new { totalSum, employees });
    }

    return NoContent();
}

    }
}
