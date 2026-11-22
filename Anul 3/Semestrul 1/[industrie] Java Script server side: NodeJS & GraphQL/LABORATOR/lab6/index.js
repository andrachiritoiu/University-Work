import app from './app.js';

app.listen(3001, () => {
    console.log("Running a graphql server at port 3001");
});

export default app;