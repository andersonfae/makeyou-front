import React from "react";
import Modal from "react-modal";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    width: "300px",
    height: "150px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
};

const DeleteConfirmationModal = ({ isOpen, onClose, onDelete }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Confirmação de Exclusão"
    >
      <h2>Deseja realmente excluir esta tarefa?</h2>
      <button
        className="bg-red-500 text-white px-4 py-1 rounded font-bold focus:outline-none"
        onClick={onDelete}
      >
        Deletar Tarefa
      </button>
      <button className="mt-2 text-sm" onClick={onClose}>
        Cancelar
      </button>
    </Modal>
  );
};

export default DeleteConfirmationModal;
