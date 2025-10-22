import { useState, useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import CategoryList from "../../components/category/CategoryList";
import categoryService from "../../services/categoryService";
import { Category } from "../../types/category";
import CategoryForm from "../../components/category/CategoryForm";
import { ToastProvider, useToast } from "../../components/ui/toast/ToastProvider"; // ✅ import toast

function CategoriesContent() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useToast(); // ✅ hook toast

  const fetchCategories = useCallback(
    async (page: number, pageSize: number) => {
      try {
        const res = await categoryService.getCategories({
          Keyword: filterName || undefined,
          Status: filterStatus || undefined,
          PageIndex: page,
          PageSize: pageSize,
        });

        return {
          data: res.data,
          totalItems: res.metaData.totalItems,
        };
      } catch (error) {
        console.error("Fetch categories error:", error);
        return { data: [], totalItems: 0 };
      }
    },
    [filterName, filterStatus]
  );

  const handleAdd = () => {
    setEditingCategory(null);
    setShowCreateModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowCreateModal(true);
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm("Are you sure to delete this category?")) return;

    try {
      await categoryService.deleteCategory(categoryId);
      addToast({ type: "success", message: "Category deleted successfully!" });
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      console.error("Delete error:", error);
      addToast({ type: "error", message: error.response?.data?.message || "Failed to delete category" });
    }
  };

  const handleSubmitForm = async (data: { categoryName: string; description: string }) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.categoryId, data);
        addToast({ type: "success", message: "Category updated successfully!" });
      } else {
        await categoryService.createCategory(data);
        addToast({ type: "success", message: "Category created successfully!" });
      }

      setShowCreateModal(false);
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      console.error("Submit error:", error);
      addToast({ type: "error", message: error.response?.data?.message || "Failed to save category" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="Category Management | Admin Dashboard" description="Manage categories" />

      <div className="mx-auto max-w-7xl mt-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Category Management</h1>
          <button
            onClick={handleAdd}
            className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Category
          </button>
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
          <button onClick={() => setRefreshKey((prev) => prev + 1)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Filter
          </button>
        </div>

        {/* Category List */}
        <CategoryList key={refreshKey} fetchCategories={fetchCategories} onEdit={handleEdit} onDelete={handleDelete} itemsPerPage={5} />
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <CategoryForm
          category={editingCategory ? { categoryId: editingCategory.categoryId, categoryName: editingCategory.categoryName, description: editingCategory.description } : undefined}
          onSubmit={handleSubmitForm}
          onClose={() => setShowCreateModal(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}

// Wrap page với ToastProvider
export default function Categories() {
  return (
    <ToastProvider>
      <CategoriesContent />
    </ToastProvider>
  );
}
