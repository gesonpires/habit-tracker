// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Habit = {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
};

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch inicial dos hábitos
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await fetch("/api/habits");
        if (!res.ok) throw new Error("Failed to fetch habits");
        const data: Habit[] = await res.json();
        setHabits(data);
      } catch (error) {
        console.error(error);
        alert("Could not load habits. Please try again.");
      }
    };

    fetchHabits();
  }, []);

  // Função para adicionar hábito
  const addHabit = async () => {
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) throw new Error("Failed to add habit");

      const newHabit: Habit = await res.json();
      setHabits((prev) => [...prev, newHabit]);
      setTitle("");
      setDescription("");
      setSuccessMessage("Habit added successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error adding habit:", err);
      alert("Failed to add habit. Please try again.");
    }
  };

  // Função para atualizar hábito
  const updateHabit = async (id: number) => {
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) throw new Error("Failed to update habit");

      const updatedHabit: Habit = await res.json();
      setHabits((prev) =>
        prev.map((habit) => (habit.id === id ? updatedHabit : habit))
      );
      setTitle("");
      setDescription("");
      alert("Habit updated successfully!");
    } catch (err) {
      console.error("Error updating habit:", err);
      alert("Failed to update habit. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Daily Habit Tracker
      </h1>

      {/* Formulário */}
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4 mb-6">
        <Input
          type="text"
          placeholder="Enter a habit title (e.g., Morning Exercise)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Add a short description (e.g., 30 minutes of jogging)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button onClick={addHabit} className="w-full">
          Add Habit
        </Button>
        {successMessage && (
          <p className="text-green-600 text-center">{successMessage}</p>
        )}
      </div>

      {/* Lista de Hábitos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((habit) => (
          <Card key={habit.id} className="shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {habit.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{habit.description}</p>
              <div className="mt-4 flex space-x-2">
                {/* Botão para abrir o Dialog de edição */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Habit</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        type="text"
                        placeholder="Update title"
                        defaultValue={habit.title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="Update description"
                        defaultValue={habit.description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => updateHabit(habit.id)}
                        className="w-full"
                      >
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
