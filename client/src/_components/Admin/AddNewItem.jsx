import { useState } from "react";
import { Save, Upload } from "lucide-react";
import useFormData from "@/hooks/useFormData.js";
import restoApiInstance from "../../service/api/api";
import useModalStore from "../../store/use-modal";
import Toast from "../Toasts/Toast";

const AddNewItem = () => {
  const {
    handleChange,
    data: formData,
    isLoading,
    resetData
  } = useFormData(
    {
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: ""
    },
    restoApiInstance.updateMenu
  );

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const { closeModal } = useModalStore();

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store the image file separately since useFormData doesn't handle files
    setImageFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Custom submit handler to wrap the form submission
  const handleUpload = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name || !formData.price || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    if (!imageFile) {
      alert("Please select an image");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("image", imageFile);
      const imageUploadResponse = await restoApiInstance.uploadImage(
        formDataToSend
      );
      const image = imageUploadResponse.imageUrl;
      const updatedFormData = {
        payload: {
          ...formData,
          imageUrl: image
        },
        action: "ADD_ITEM"
      };

      const response = await restoApiInstance.updateMenu(updatedFormData);

      if (response) {
        resetData();
        setImageFile(null);
        setImagePreview("");
        closeModal();
        Toast({ type: response.type, message: response.message });
      }
    } catch (error) {
      console.error("Error uploading menu item:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Item</h2>

      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              <option value="North Indian Curries">North Indian Curries</option>
              <option value="South Indian">South Indian</option>
              <option value="Rice & Biryani">Rice & Biryani</option>
              <option value="Street Food">Street Food</option>
              <option value="Indian Breads">Indian Breads</option>
              <option value="Desserts">Desserts</option>
              <option value="Beverages">Beverages</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image *
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative border-2 border-dashed border-gray-300 rounded-md p-6 flex justify-center items-center bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <input
                  type="file"
                  id="image"
                  name="image"
                  key={imageFile ? imageFile.name : "new"} //
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-500">
                    {imageFile
                      ? imageFile.name
                      : "Click to upload or drag and drop"}
                  </p>
                </div>
              </div>
            </div>

            {imagePreview && (
              <div className="w-24 h-24 relative border rounded-md overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Add Item
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddNewItem;
