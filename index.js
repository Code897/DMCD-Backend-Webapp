import express from 'express'
import cors from 'cors'
import router from './routes/route.js';
import chalk from 'chalk';
import { PORT } from './config.js';
const app = express();

app.use(cors({
    origin:"*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('', (req, res) => {
    res.send('Backend Online')
})

app.use('/api', router)

app.listen(PORT || 8000, () => {
    console.log(chalk.bgYellow(`Server is running on port:${PORT || 8000}}`));
});