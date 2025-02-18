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

[HttpGet("sum-values-grouped")]
public IActionResult GetGroupedSummedEmployees()
{
    var groupedResults = new Dictionary<char, (int sum, List<string> employees)>();

    using (var connection = new SqliteConnection("Data Source=./SqliteDB.db"))
    {
        connection.Open();

        var queryCmd = connection.CreateCommand();
        queryCmd.CommandText = @"
            SELECT Name, Value
            FROM Employees
            WHERE Name LIKE 'A%' OR Name LIKE 'B%' OR Name LIKE 'C%';
        ";

        using (var reader = queryCmd.ExecuteReader())
        {
            while (reader.Read())
            {
                var name = reader.GetString(0);
                var value = reader.GetInt32(1);

                char firstLetter = name[0];
                if (groupedResults.ContainsKey(firstLetter))
                {
                    groupedResults[firstLetter] = (
                        groupedResults[firstLetter].sum + value,
                        groupedResults[firstLetter].employees.Append(name).ToList()
                    );
                }
                else
                {
                    groupedResults[firstLetter] = (value, new List<string> { name });
                }
            }
        }
    }

    var filteredResults = groupedResults
        .Where(kv => kv.Value.sum >= 11171)
        .Select(kv => new 
        {
            key = kv.Key.ToString(),
            value = kv.Value.sum,
            employees = kv.Value.employees
        })
        .ToList();

    if (filteredResults.Any())
    {
        return Ok(filteredResults);
    }

    return NoContent();
}



    }
}