import express, { type Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import path from "path";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Serve attached assets
  app.use('/attached_assets', express.static(path.join(process.cwd(), 'attached_assets')));
  
  // Seed data on startup
  await storage.seedEmails();

  app.get(api.emails.list.path, async (req, res) => {
    const emails = await storage.getEmails();
    res.json(emails);
  });

  app.get(api.emails.get.path, async (req, res) => {
    const email = await storage.getEmail(Number(req.params.id));
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }
    res.json(email);
  });

  app.post(api.emails.create.path, async (req, res) => {
    try {
      const input = api.emails.create.input.parse(req.body);
      const email = await storage.createEmail(input);
      res.status(201).json(email);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.emails.toggleStar.path, async (req, res) => {
    try {
      const { isStarred } = req.body;
      const email = await storage.toggleStar(Number(req.params.id), isStarred);
      if (!email) {
        return res.status(404).json({ message: 'Email not found' });
      }
      res.json(email);
    } catch (err) {
      res.status(400).json({ message: 'Invalid request' });
    }
  });

  return httpServer;
}
