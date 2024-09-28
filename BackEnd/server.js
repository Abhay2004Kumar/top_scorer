import express from 'express';

const app = express();
app.use(express.json());

const port = 5000;

// Route to serve the HTML with an input tag
app.get('/', (req, res) => {
    res.send(`
       "listening";
    `);
});

// Route to handle form submission
app.post('/submit', (req, res) => {
    const { name } = req.body;
    res.send(`Hello, ${name}!`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
