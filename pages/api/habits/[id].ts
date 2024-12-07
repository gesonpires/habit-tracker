import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

// Instância do Prisma
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query; // Captura o ID do hábito na URL

  if (req.method === "PUT") {
    // Atualizar hábito
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    try {
      const updatedHabit = await prisma.habit.update({
        where: { id: Number(id) },
        data: { title, description },
      });
      return res.status(200).json(updatedHabit);
    } catch (error) {
      console.error("Error updating habit:", error);
      return res.status(500).json({ error: "Failed to update habit" });
    }
  } else if (req.method === "DELETE") {
    // Deletar hábito
    try {
      await prisma.habit.delete({
        where: { id: Number(id) },
      });
      return res.status(200).json({ message: "Habit deleted successfully" });
    } catch (error) {
      console.error("Error deleting habit:", error);
      return res.status(500).json({ error: "Failed to delete habit" });
    }
  } else {
    // Método HTTP não permitido
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
