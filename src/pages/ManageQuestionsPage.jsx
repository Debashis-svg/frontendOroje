import React, { useState, useEffect } from "react";
import api from "../services/api";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import QuestionFormModal from "../components/admin/QuestionFormModal";

export default function ManageQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/questions");
      setQuestions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      await api.delete(`/questions/${id}`);
      setQuestions(questions.filter((q) => q._id !== id));
    }
  };

  const openAddModal = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const openEditModal = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const onSave = (savedQuestion) => {
    if (editingQuestion) {
      setQuestions(questions.map((q) => (q._id === savedQuestion._id ? savedQuestion : q)));
    } else {
      setQuestions([savedQuestion, ...questions]);
    }
    setIsModalOpen(false);
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Questions</h1>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <PlusIcon className="h-5 w-5" /> Add New Question
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-sm font-semibold uppercase">Title</th>
              <th className="p-4 text-sm font-semibold uppercase">Round</th>
              <th className="p-4 text-sm font-semibold uppercase">Type</th>
              <th className="p-4 text-sm font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {questions.map((q) => (
              <tr key={q._id} className="hover:bg-blue-50 transition">
                <td className="p-4">{q.title}</td>
                <td className="p-4">{q.round}</td>
                <td className="p-4 uppercase">{q.type}</td>
                <td className="p-4 space-x-3">
                  <button onClick={() => openEditModal(q)} className="text-blue-600 hover:text-blue-800">
                    <PencilIcon className="h-5 w-5 inline" />
                  </button>
                  <button onClick={() => handleDelete(q._id)} className="text-red-600 hover:text-red-800">
                    <TrashIcon className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <QuestionFormModal
          question={editingQuestion}
          onClose={() => setIsModalOpen(false)}
          onSave={onSave}
        />
      )}
    </div>
  );
}
