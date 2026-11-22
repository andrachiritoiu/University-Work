const express = require("express");
const cors = require("cors");
const { createHandler } = require("graphql-http/lib/use/express");
const schema = require("./schema");
const { getUserFromRequest } = require("./middleware/auth");

const app = express();
const PORT = 3000;

app.all(
  "/graphql",
  createHandler({
    schema,
    context: (req) => ({ user: getUserFromRequest(req.raw) }),
  }),
);

// 404 handler for routes that don't exist
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});
