const array = [1,2,3];
array.push(4);

// console.log(array);
// console.log(typeof 12);

function square(n){
    return n * n;
}

const cube = function(n){
    return n * n * n;
}

const arrwSquare = (n) => {
    return n * n;
}

const arrowSquare2 = (n) => n * n;

const add = (a, b) => a + b;
// console.log(add(2,5));

const applyTwice = (fn, value) => fn(fn(value));
// console.log(applyTwice(square, 2));

const city = "Bucuresti";
// console.log("Hello " + city);
// console.log(`Hello ${city}`);
// console.log(city.length);
// console.log(city.toUpperCase());
// console.log(city.toLowerCase());
// console.log(city.includes("u"));


const switchFunction = (n) =>{
    switch(n){
        case n<0:
            console.log("negativ");
            break;
        case n>0:
            console.log("pozitiv");
            break;
        default:
            console.log("neutru");
            break;
    }
}

switchFunction(-1);  //neutru -> -1<0 e true si apoi compara true===-1 si ajunge pe default

const getPromovat = (n) =>{
    if(n>=5){
        console.log("promovat");
    } else {
        console.log("respins");
    }
}

const getPromovat2 = (n) => n>=5 ? "promovat" : "respins";

// console.log(10/0) // Infinity
// console.log(0.1+0.2 === 0.3) // false

const grades = [9, 10, 6, 3];
secondGrades = [10,8]
// console.log(grades[0]);
// console.log(grades.length);

// console.log(...grades, ...secondGrades);
// console.log(...grades, secondGrades);


for(const key in grades){
    // console.log(key);
}


for(const value of grades){
    // console.log(value);
}


// while(true){
//     const a = 0;
//     continue;
//     break;
//     return;
// }

// grades.forEach((value, index) => {
//     console.log(`grades[${index}] = ${value}`);
// });


const add2 = (a,b) => a + b;
console.log(grades.map(add2));

const array2 = [
  {
    "id": 1,
    "firstName": "Andrei",
    "lastName": "Popescu",
    "location": "Bucharest, Romania"
  },
  {
    "id": 2,
    "firstName": "Maria",
    "lastName": "Ionescu",
    "location": "Cluj-Napoca, Romania"
  },
  {
    "id": 3,
    "firstName": "Lukas",
    "lastName": "Schneider",
    "location": "Berlin, Germany"
  },
  {
    "id": 4,
    "firstName": "Sofia",
    "lastName": "Rossi",
    "location": "Milan, Italy"
  },
  {
    "id": 5,
    "firstName": "James",
    "lastName": "Carter",
    "location": "London, United Kingdom"
  }
]

console.log(array2.map((user) => user.firstName))

// const newarray = array2.map((user) => user.location)
// console.log(newarray);

const newarray = array2.filter((user) => user.id > 1)
console.log(newarray);

const user = {
    id: 1,
    firstName: "Andrei",
    lastName: "Popescu",
    location: "Bucharest, Romania"
}
console.log(user.firstName);

for(const key in user){
    console.log(key);
    console.log(user[key]);
}




//for .. in .. -> indexurile
//for .. of .. -> valorile