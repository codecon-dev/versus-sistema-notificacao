import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthController {
  private userRepo = AppDataSource.getRepository(User);

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Login fixo do admin
      if (username === "admin" && password === "admin") {
        const token = jwt.sign(
          { id: 0, username: "admin", isAdmin: true },
          process.env.JWT_SECRET || "your-secret-key",
          { expiresIn: "24h" },
        );
        return res.json({ token, user: { username: "admin", isAdmin: true } });
      }

      // Login de usuários normais
      const user = await this.userRepo.findOne({ where: { username } });

      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash,
      );

      if (!isValidPassword) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, isAdmin: user.is_admin },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" },
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          isAdmin: user.is_admin,
        },
      });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ error: "Erro ao fazer login" });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const existingUser = await this.userRepo.findOne({ where: { username } });

      if (existingUser) {
        return res.status(400).json({ error: "Usuário já existe" });
      }

      const password_hash = await bcrypt.hash(password, 10);
      const user = this.userRepo.create({
        username,
        password_hash,
        is_admin: false,
      });

      await this.userRepo.save(user);

      res
        .status(201)
        .json({ message: "Usuário criado com sucesso", userId: user.id });
    } catch (error) {
      console.error("Erro ao registrar:", error);
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  }
}

export const authController = new AuthController();
