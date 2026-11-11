const express = require('express');
const { users, getNextUserId } = require('./db');

const app = express();
const router = express.Router();

app.use(express.json());

const PORT = 3000;

//middleware global care afiseaza in consola fiecare request
//nu specifici o ruta => se executa pentru toate rutele
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); 
})


/* Conventii pentru toate exercitiile:
 * - Raspunsurile de eroare au forma { error: String } (ex: { error: 'Email is required' }).
 * - 400 = date invalide trimise de client, 404 = user-ul cu id-ul cerut nu exista.
 * - id-ul unui user este un numar unic, generat automat la creare. Nu refolositi id-urile
 *   userilor stersi.
 */

/* E1 - Create Users
 * Definiti o ruta care sa primeasca un request de tip POST la adresa /users.
 * Ruta va primi un obiect de forma { name: String, email: String }.
 * Daca obiectul nu are ambele proprietati, se va returna status 400 si un mesaj de eroare.
 * Daca exista deja un user cu acelasi email, se va returna status 400 si un mesaj de eroare.
 * Altfel, user-ul se va adauga in array-ul users din memorie.
 * Ruta va returna status 201 si obiectul adaugat, impreuna cu id-ul generat automat.
 */

// router.get("/users", (req, res) => {
//     res.json(users);
// })

router.post("/users", (req,res) => {
    const {name, email} = req.body || {};

    if(!name || !email){
        return res.status(400).json({error: "Invalid params"});
    }

    const user = users.find((user) => user.email === email);

    if(user){
        return res.status(400).json({error: "An user with this email already exist"});
    }

    const new_user = {id: getNextUserId(), name, email};
    users.push(new_user);
    return res.status(201).json(new_user);
})


/* E2 - Update Users
 * Definiti o ruta care sa primeasca un request de tip PUT la adresa /users/:id.
 * Ruta va primi un obiect de forma { name: String, email: String }.
 * Daca obiectul nu are ambele proprietati, se va returna status 400 si un mesaj de eroare.
 * Se va cauta in array-ul users din memorie user-ul cu id-ul primit in ruta.
 * Daca user-ul nu exista, se va returna status 404 si un mesaj de eroare.
 * Daca user-ul exista, i se vor actualiza proprietatile cu valorile din obiect
 * si se va returna status 200 si obiectul actualizat.
 */

router.put("/users/:id", (req,res) => {
    const {name, email} = req.body || {};

    if(!name || !email){
        return res.status(400).json({error: "Invalid params"});
    }

    const id = Number(req.params.id);

    const user = users.find((user) => user.id === id);

    if(!user){
        return res.status(404).json({error: "An user with this email doesn't exist"});
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;

    return res.status(200).json(user);
})


/* E3 - List Users
 * Definiti o ruta care sa primeasca un request de tip GET la adresa /users.
 * Ruta poate accepta doua query params optionale: page si limit.
 * Daca nu sunt trimise, page si limit vor avea valorile implicite 0 si 10.
 * Daca sunt trimise, page trebuie sa fie un numar intreg >= 0, iar limit un numar intreg >= 1.
 * Altfel, se va returna status 400 si un mesaj de eroare.
 * page incepe de la 0: page=0 inseamna primii `limit` useri, page=1 urmatorii `limit` useri etc.
 * Ruta va returna status 200 si un array cu userii din pagina ceruta.
 * Daca nu exista useri in pagina ceruta, se va returna un array gol.
 */

router.get("/users/", (req, res) => {    
    const page = Number(req.query.page ?? 0);
    const limit = Number(req.query.limit ?? 10);

    if(!Number.isInteger(page) || page < 0 || !Number.isInteger(limit) || limit < 1){
        return res.status(400).json({error: "Invalid params"});
    }

    const limit_users = users.slice(page * limit, page * limit + limit);
    res.status(200).json(limit_users);
})


/* E4 - Delete Users
 * Definiti o ruta care sa primeasca un request de tip DELETE la adresa /users/:id.
 * Ruta va cauta in array-ul users din memorie user-ul cu id-ul primit in ruta.
 * Daca user-ul nu exista, se va returna status 404 si un mesaj de eroare.
 * Daca user-ul exista, se va sterge din array si se va returna status 200.
 */
router.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "User not found!" });
  }

  const [deleted] = users.splice(index, 1);
  res.status(200).json(deleted);
});



app.use(router);

app.listen(PORT, () =>{
    console.log("Server is running;")
})

module.exports = app;
