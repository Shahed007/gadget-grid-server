const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
  res.send('MY brand shop api was coming soon!');
})

app.listen(port, ()=>{
  console.log(`my server is running port ${port}`);
})