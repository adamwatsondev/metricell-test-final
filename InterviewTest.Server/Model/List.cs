using InterviewTest.Server.Model;

public class EmployeeData
{
    public string Name { get; set; }
    public int Value { get; set; }

    public EmployeeData(string name, int value)
    {
        Name = name;
        Value = value;
    }
}