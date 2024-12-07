import { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';

// Instância do Prisma
const prisma = new PrismaClient();

// Handler da API
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {
  if (req.method === 'GET') {
    // Retornar todos os hábitos
    const habits = await prisma.habit.findMany();
    res.status(200).json(habits);
  } else if (req.method === 'POST') {
    // Criar um novo hábito
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const habit = await prisma.habit.create({
      data: { title, description },
    });
    res.status(201).json(habit);
  } else {
    // Método HTTP não permitido
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
