import express from "express";
import path from "path";
const app = express();
const PORT = process.env.PORT || 6500;

app.use(express.static(path.join(path.resolve(), 'public')));

app.get('/', (req, res) => {
    res.sendFile("./index.html");
});

const startserver = async () => {
    try {
        await new Promise((res) => {
            app.listen(PORT, () => {
                console.log(`Server running on http://localhost:${PORT}`);
                res();
            });
        })
    } catch (error) {
        throw error("server can not start");
    }
}

startserver();