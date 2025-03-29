import React from "react";

const EditModal = ({
  isOpen,
  onClose,
  initialTitle,
  initialCover,
  initialEndCover,
  onSave,
}) => {
  const [editedTitle, setEditedTitle] = React.useState(initialTitle);
  const [editedCover, setEditedCover] = React.useState(initialCover);
  const [editedEndCover, setEditedEndCover] = React.useState(initialEndCover);

  const handleSave = () => {
    onSave({ editedTitle, editedCover, editedEndCover });
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] isolation-isolate"> {/* Added z-[1000] and isolation-isolate */}
      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Edit Book Details</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-800 text-white"
              placeholder="Book Title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Cover Image URL</label>
              <input
                value={editedCover}
                onChange={(e) => setEditedCover(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>
            <div>
              <label className="block text-white mb-2">End Cover URL</label>
              <input
                value={editedEndCover}
                onChange={(e) => setEditedEndCover(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-white"
            >
              Update
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;