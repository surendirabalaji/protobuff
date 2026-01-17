# protobuff

## Project Description
A Protocol Buffers project for managing employee data using Node.js and protobufjs.

## Installation

```bash
# Install protobuf dependencies
npm install protobufjs@7.2.5 protobufjs-cli@1.1.2
```

## Creating Proto Files

### 1. Define your .proto schema

Create `employees.proto`:
```proto
syntax = "proto3";

package employees;

message Employee {
    int32 id = 1;
    string name = 2;
    float salary = 3;
}

message Employees {
    repeated Employee employees = 1;
}
```

### 2. Compile Proto File

```bash
# Generate JavaScript file from proto
npx pbjs -t static-module -w commonjs -o employees_pb.js employees.proto

# Generate TypeScript definitions (optional)
npx pbts -o employees_pb.d.ts employees_pb.js
```

## Usage Syntax

### Creating Employee Objects

```javascript
const Schema = require("./employees_pb");

// Create single employee
const employee = Schema.Employee.create({
    id: 1001,
    name: "Alex",
    salary: 2000
});

// Access properties directly
console.log(employee.name);    // "Alex"
console.log(employee.id);      // 1001
console.log(employee.salary);  // 2000
```

### Working with Employee Collections

```javascript
// Create multiple employees
const Alex = Schema.Employee.create({ id: 1001, name: "Alex", salary: 2000 });
const John = Schema.Employee.create({ id: 1002, name: "John", salary: 1000 });
const Sarah = Schema.Employee.create({ id: 1003, name: "Sarah", salary: 3000 });

// Create Employees collection
const employees = Schema.Employees.create({
    employees: [Alex, John, Sarah]
});

// Add more employees
const Mike = Schema.Employee.create({ id: 1004, name: "Mike", salary: 2800 });
employees.employees.push(Mike);

// Iterate through employees
employees.employees.forEach(emp => {
    console.log(`${emp.name} - $${emp.salary}`);
});
```

### Encoding and Decoding

```javascript
// Encode to binary format
const encodedBytes = Schema.Employees.encode(employees).finish();
console.log("Encoded:", encodedBytes);

// Decode from binary
const decodedBytes = Schema.Employees.decode(encodedBytes);
console.log("Decoded:", decodedBytes.employees);

// Save to file
const fs = require("fs");
fs.writeFileSync("EmployeesBinary", encodedBytes);

// Read from file
const data = fs.readFileSync("EmployeesBinary");
const loaded = Schema.Employees.decode(data);
```

## Work Log

### January 16, 2026

**Completed Tasks:**
- ✅ Set up project structure
- ✅ Created employees.proto schema with Employee and Employees messages
- ✅ Fixed proto file syntax errors (corrected "nessage" typo, moved package declaration)
- ✅ Installed protobufjs@7.2.5 and protobufjs-cli@1.1.2
- ✅ Compiled proto file to JavaScript using pbjs
- ✅ Generated TypeScript definitions using pbts
- ✅ Implemented employee creation with direct property access
- ✅ Created multiple employee objects (Alex, John, Sarah, Mike)
- ✅ Implemented Employees collection with repeated Employee messages
- ✅ Added functionality to push new employees to collection
- ✅ Implemented binary encoding using Schema.Employees.encode()
- ✅ Implemented binary decoding using Schema.Employees.decode()
- ✅ Added file I/O to save encoded data to "EmployeesBinary" file
- ✅ Tested complete serialization/deserialization workflow

**Key Learnings:**
- Protobufjs uses direct property access (not setter methods)
- Use `Schema.Employee.create({ })` to create objects
- Collections use array syntax: `{ employees: [emp1, emp2] }`
- `.finish()` is required after encoding to get the buffer
- Binary format significantly reduces data size

**Files Created:**
- `employees.proto` - Protocol buffer schema definition
- `employees_pb.js` - Compiled JavaScript protobuf code
- `employees_pb.d.ts` - TypeScript definitions
- `index.js` - Main implementation file
- `EmployeesBinary` - Serialized binary data file

### Next Steps
- [ ] Add error handling for encoding/decoding
- [ ] Implement data validation
- [ ] Add more complex nested message types
- [ ] Create unit tests
- [ ] Add performance benchmarks

## Project Structure

```
protobuffProject/
├── employees.proto       # Proto schema definition
├── employees_pb.js       # Generated protobuf code
├── index.js              # Main application
├── EmployeesBinary       # Serialized data file
├── package.json          # Node dependencies
└── README.md            # This file
```

## Running the Project

```bash
node index.js
```

---
**Last Updated:** January 16, 2026
