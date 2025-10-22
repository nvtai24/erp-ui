import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import CategoryList from "../../components/category/CategoryList";
import categoryService from "../../services/categoryService";
import { Category } from "../../types/category";
import CategoryFormProps from "../../components/category/CategoryForm";
import { useCallback } from "react";

export default function Categories() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterName, setFilterName] = useState(""); 
  const [filterStatus, setFilterStatus] = useState(""); 

  const fetchCategories = useCallback(async (page: number, pageSize: number) => {
    let data = await categoryService.getCategories();

    if (filterName) {
      data = data.filter(c => c.categoryName.toLowerCase().includes(filterName.toLowerCase()));
    }

    return {
      data: data.slice((page - 1) * pageSize, page * pageSize),
      totalItems: data.length,
    };
  }, [filterName]); // Chỉ tạo lại function khi filterName thay đổi

  const handleAdd = () => {
    setEditingCategory(null); // Add mới
    setShowCreateModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowCreateModal(true);
  };

  const handleDelete = (categoryId: number) => {
    if (confirm("Are you sure to delete this category?")) {
      console.log("Delete category", categoryId);
      // TODO: call API delete
    }
  };

  const handleSubmitForm = (data: { categoryName: string; description: string }) => {
    if (editingCategory) {
      console.log("Update category:", { id: editingCategory.categoryId, ...data });
      // TODO: call API update
    } else {
      console.log("Create new category:", data);
      // TODO: call API create
    }
    setShowCreateModal(false);
  };

  return (
    <>
      <PageMeta title="Category Management | Admin Dashboard" description="Manage categories" />

      <div className="mx-auto max-w-7xl mt-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Category Management
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={handleAdd}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Category
            </button>
          </div>
        </div>

        {/* Filter Form */}
        <div className="mb-4 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="border rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={() => setFilterName(filterName)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Filter
          </button>
        </div>

        {/* Category List */}
        <CategoryList
          fetchCategories={fetchCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          itemsPerPage={5}
        />
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateModal && (
        <CategoryFormProps
          category={
            editingCategory
              ? {
                  categoryName: editingCategory.categoryName,
                  description: editingCategory.description,
                }
              : undefined
          }
          onSubmit={handleSubmitForm}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </>
  );
}
