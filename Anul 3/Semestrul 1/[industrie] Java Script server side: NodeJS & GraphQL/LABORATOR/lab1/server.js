import express from "express";

const app = express();
const PORT = 3000;

const name = "andra";

app.get("/hello-world", (req, res) => {
  res.send(`Hello, ${name}!`);
});

app.get("/users/:userId", (req, res) => {
  res.send(`User ID: ${req.params.userId}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});