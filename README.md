# Simple Todo App – Interview Assignment
### Technologies: Node.js + TypeScript, NO external dependencies
### Lightweight: gzipped size of generated javascript: 8K
### Time of completion: 1.5 days

![Screenshot 2023-05-24 at 13 08 32](https://github.com/apodgorny/todo_demo/assets/2205877/c334438f-911d-4757-bafc-ced52c98af9a)

This project is an interview assignment with the following requirements:

- User comes to main page and sees a list of todos.
- Creation/Updating/Deleteion must be done without page refresh.
- Size of js must be less then 50Mb (gzipped).
- Amount of dependencies must be minimal.
- Todos must be saved into SQLite database.
- Tables in DB must be created with migrations.

In this project I am featuring the following:

- Typescript and Node.js
- No external dependencies in server or client side code.
- Lightweight – Only 8K js
- Layered server architecture: router/view/model/sqlite layers.
- Fully Ajax driven – no page refresh
- Create/Read/Update/Delete features are in place and are RESTful
- All code is OOP
- In-house built simple migration feature that keeps track of order and version
- Secure. Access restricted to a clearly defined set of resources
- Settings, libraries, sqlite adapter are abstracted into separate classes
- Client side HTML is generated with JS class on–the–fly.
- Fast and furious time of completion of project: 1.5 days.

To build service, install sqlite3:

`npm install sqlite3`

To run typescript transpiler:

`npx tsc`

To start service run:

`node js/server/app.js`

The migrations run on every server start:

![Screenshot 2023-05-24 at 12 47 22](https://github.com/apodgorny/todo_demo/assets/2205877/a55d9252-1e5d-452e-938a-a44f5bd1f51e)
