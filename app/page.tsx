"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Task } from "@/interfaces/Itask";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
  });
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:4000/tasks");
        console.log("Response:", response);

        const data: Task[] = await response.json();
        console.log("Data:", data);

        setTasks(data);
      } catch (error) {
        console.error("Erro ao buscar as tarefas:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    try {
      if (!newTask.title || !newTask.description) {
        toast.error(
          "Title e Description são obrigatórios para adicionar uma tarefa."
        );
        return;
      }

      const response = await fetch("http://localhost:4000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const addedTask = await response.json();
        setTasks([...tasks, addedTask]);
        setNewTask({ title: "", description: "" });
        toast.success("Tarefa adicionada com sucesso!");
      } else {
        console.error("Falha ao adicionar tarefa");
      }
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      toast.error("Erro ao adicionar tarefa.");
    }
  };

  const handleEditTask = async () => {
    try {
      if (!editTask || !editTask.title || !editTask.description) {
        console.error("Tarefa inválida para edição.");
        return;
      }

      const response = await fetch(
        `http://localhost:4000/tasks/${editTask._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editTask),
        }
      );

      if (response.ok) {
        const updatedTask = await response.json();
        const updatedTasks = tasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
        setTasks(updatedTasks);
        setEditTask(null);
      } else {
        console.error("Falha ao editar tarefa");
      }
    } catch (error) {
      console.error("Erro ao editar tarefa:", error);
    }
  };

  const handleAddInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTask((prevNewTask) => ({ ...prevNewTask, [name]: value }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditTask((prevEditTask) =>
      prevEditTask ? { ...prevEditTask, [name]: value } : null
    );
  };

  const handleEditButtonClick = (task: Task) => {
    setEditTask({ ...task });
  };

  const handleDeleteButtonClick = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      if (!taskToDelete) {
        console.error("Tarefa para exclusão não encontrada");
        return;
      }

      const response = await fetch(
        `http://localhost:4000/tasks/${taskToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updatedTasks = tasks.filter(
          (task) => task._id !== taskToDelete._id
        );
        setTasks(updatedTasks);
      } else {
        console.error("Falha ao excluir tarefa");
      }
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    } finally {
      setTaskToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="p-4 mt-8 bg-black h-full min-h-screen border-[20px] border-[#FF0145]">
      <h1 className="text-4xl text-center font-bold mb-4 text-white">
        Tarefas
      </h1>
      <form className="flex flex-col mb-4">
        <input
          type="text"
          placeholder="Título"
          name="title"
          value={editTask ? editTask.title : newTask.title}
          onChange={editTask ? handleEditInputChange : handleAddInputChange}
          className="mb-2 px-2 py-1 border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <textarea
          placeholder="Descrição"
          name="description"
          value={editTask ? editTask.description : newTask.description}
          onChange={editTask ? handleEditInputChange : handleAddInputChange}
          className="mb-2 px-2 py-1 border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={editTask ? handleEditTask : handleAddTask}
          className="bg-[#520EDD] uppercase text-white px-4 py-1 rounded focus:outline-none hover:bg-blue-600"
        >
          {editTask ? "Editar Tarefa" : "Adicionar Tarefa"}
        </button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="bg-gray-100 p-2 mb-2 rounded shadow">
            <div className="font-bold">{task.title}</div>
            <div>{task.description}</div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => handleEditButtonClick(task)}
                className="mt-2 bg-[#520EDD] text-white px-2 py-1 rounded focus:outline-none hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => handleDeleteButtonClick(task)}
                className="mt-2 bg-red-500 text-white px-2 py-1 rounded focus:outline-none hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteConfirmation}
      />
    </div>
  );
}
