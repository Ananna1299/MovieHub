

//normal function is hoisted on top of their current scope(name+definition)
greet();

function greet() {
  console.log("Hello - function declaration hoisted");
}

//as arrow function is usually stored in a variable(let/const). it is hoisted but not initialized. it will in the the temporal dead zone.
sayHi(); 

const sayHi = () => {
    console.log("Hi");
};