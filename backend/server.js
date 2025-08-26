const express = require('express');
const cors = require('cors'); // For development
const resourcesRouter = require('./api/resources');
// ... other routers for templates, variables, and exports

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/resources', resourcesRouter);
// app.use('/api/templates', templatesRouter);
// app.use('/api/variables', variablesRouter);
// app.use('/api/export', exportRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});