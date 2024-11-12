import express from 'express'; 
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use(cors({
    origin: ("http://localhost:5173", "http://localhost:3000", "http://localhost:8080"),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],  
  }));



const NODE_SERVICE_URL = "http://localhost:4000";
const SPRING_SERVICE_URL = "http://localhost:8080";



app.use("/node-api", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${NODE_SERVICE_URL}${req.originalUrl}`,
      data: req.body,
      headers: req.headers,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({
      message: error.message,
      ...(error.response ? { data: error.response.data } : {}),
    });
  }
});


app.use("/spring-api", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SPRING_SERVICE_URL}${req.path}`,
      data: req.body,
      headers: req.headers,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({
      message: error.message,
      ...(error.response ? { data: error.response.data } : {}),
    });
  }
});

// Start the API Gateway
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
