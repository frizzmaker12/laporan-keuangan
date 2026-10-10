import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

export { PORT };
