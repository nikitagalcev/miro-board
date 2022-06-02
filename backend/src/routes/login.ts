import { Express, Request, Response } from 'express';
import { ISuperDatabase } from '../database/super_storage';

export const register_routes = (app: Express, storage: ISuperDatabase) => {
  app.post('/api/login', async (req: Request, res: Response) => {
    const { userName: user_name } = req.body;

    if (user_name) {
      res.status(200);
      storage.add_user(user_name);
    } else {
      res.status(400);
    }

    res.end();
  })
};
