using InterviewTest.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;

namespace InterviewTest.Server.Controllers
{
    // handles operations related to employee data manipulation and querying.
    [ApiController]
    [Route("api/list")]
    public class ListController : ControllerBase
    {
        private const string ConnectionString = "Data Source=./SqliteDB.db";

        // Updates the values of employees based on their name's starting letter.
        [HttpPost("update-values")]
        public IActionResult UpdateValues()
        {
            using (var connection = new SqliteConnection(ConnectionString))
            {
                connection.Open();

                // SQL command to update employee values based on the name
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

                // Execute the update and return appropriate status
                int affectedRows = updateCmd.ExecuteNonQuery();

                return affectedRows > 0 ? Ok(new { message = "Values updated successfully." }) : StatusCode(500, "No values were updated.");
            }
        }

        // This was my first attempt at the second task, this is incorrect but left in
        // to show thought process
        // Retrieves employees whose names start with A, B, or C and calculates their total value.
        [HttpGet("sum-values")]
        public IActionResult GetSummedEmployees()
        {
            var employees = new List<Employee>();
            int totalSum = 0;

            using (var connection = new SqliteConnection("Data Source=./SqliteDB.db"))
            {
                connection.Open();
                
                // SQL command to retrieve employees whose names start with A, B, or C
                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"
                    SELECT ID, Name, Value 
                    FROM Employees 
                    WHERE Name LIKE 'A%' OR Name LIKE 'B%' OR Name LIKE 'C%';
                ";

                // Execute the query and read employee data
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

            // Return the employees and total sum if the sum is above the threshold
            if (totalSum >= 11171)
            {
                return Ok(new { totalSum, employees });
            }

            return NoContent();
        }

        // Retrieves employees whose names start with A, B, or C, grouped by the first letter of their name, 
        // and returns the sum of their values, filtering by the 11171 threshold.
        [HttpGet("sum-values-grouped")]
        public IActionResult GetGroupedSummedEmployees()
        {
            var groupedResults = new Dictionary<char, (int sum, List<string> employees)>();

            using (var connection = new SqliteConnection("Data Source=./SqliteDB.db"))
            {
                connection.Open();

                // SQL command to retrieve employees whose names start with A, B, or C
                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"
                    SELECT Name, Value
                    FROM Employees
                    WHERE Name LIKE 'A%' OR Name LIKE 'B%' OR Name LIKE 'C%';
                ";

                // Execute the query and group employees by the first letter of their name
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var name = reader.GetString(0);
                        var value = reader.GetInt32(1);

                        // Group employees by the first letter of their name
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

            // Filter results based on the sum threshold and return them
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