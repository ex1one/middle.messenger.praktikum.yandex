import express from 'express';

const PORT = 3000;
const app = express();
app.use(express.static('./dist'));

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
