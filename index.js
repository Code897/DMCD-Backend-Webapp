import express from 'express'
import cors from 'cors'
import router from './routes/route.js';
import chalk from 'chalk';
import { PORT } from './config.js';
const app = express();

const allowedOrigins = [
    "https://drivemycardriver.com",
    "https://93.127.198.214",
    "https://[2a02:4780:12:3d48::1]",
];

app.use(cors({
    origin: allowedOrigins
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('', (req, res) => {
    res.send('Backend Online')
})

app.use('/api', router)

app.listen(PORT || 8000, () => {
    console.log(chalk.bgYellow(`Server is running on port:${PORT || 8000}`));
});