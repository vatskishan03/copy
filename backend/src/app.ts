// backend/src/app.ts

import express from 'express';
import snippetRoutes from './routes/snippet';

// ... other setup ...

app.use('/api/snippet', snippetRoutes);
