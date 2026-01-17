const Schema = require("./employees_pb");
const fs = require("fs")

const Alex = Schema.Employee.create({
    id: 1001,
    name: "Alex",
    salary: 2000
});

const Jhon = Schema.Employee.create({
    id:1002,
    name: "Jhon",
    salary:1000
});

const Sarah = Schema.Employee.create({
    id: 1003,
    name: "Sarah",
    salary: 3000
});

const employees = Schema.Employees.create({
    employees: [Alex, Jhon, Sarah]
});


const Mike = Schema.Employee.create({
    id: 1004,
    name: "Mike",
    salary: 2800
});

employees.employees.push(Mike);
console.log("Employees:",employees);

const encodedBytes = Schema.Employees.encode(employees).finish();
console.log("Encoded Value:",encodedBytes)

const decodedBytes = Schema.Employees.decode(encodedBytes);
console.log("Decoded Value:",decodedBytes.employees)


fs.writeFileSync("EmployeesBinary",encodedBytes);