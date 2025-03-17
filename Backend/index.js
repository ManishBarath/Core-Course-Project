const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3001" }));

// Mount your search router
const searchRouter = require('./controller/search');
app.use('/search', searchRouter);

// Also mount any other routers you need
const curdRouter = require('./controller/curd');
app.use('/curd', curdRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
