import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve BWA logo for email signatures with optimized headers
  app.get('/api/logo/bwa-30th.png', (req, res) => {
    const logoPath = path.join(process.cwd(), 'attached_assets', 'LogoBuildBWA30sm_1752522862500.jpg');
    
    // Set headers for email client compatibility and reduced warnings
    res.set({
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000', // 1 year cache
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': "default-src 'self'",
      'X-Content-Type-Options': 'nosniff'
    });
    
    res.sendFile(logoPath);
  });

  const httpServer = createServer(app);

  return httpServer;
}
