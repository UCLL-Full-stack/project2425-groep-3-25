import * as categoryDb from "../repository/Category.db"
import { CategoryInput } from "../types";

const createCategory = async (categoryData: CategoryInput) => {
    if (!categoryData.naam || !categoryData.beschrijving) {
        throw new Error("Name and description are required to create a category.");
      }
      return await categoryDb.createCategory(categoryData);
    };

const getAllCategories = async () => {
    return await categoryDb.getAllCategories();
    };
    
    const getCategoryById = async (id: number) => {
    if (!id) throw new Error("Category ID is required.");
    return await categoryDb.getCategoryById({id});
    };
    
    const updateCategory = async (id: number, updatedData: Partial<CategoryInput>) => {
    return await categoryDb.updateCategory(id, updatedData);
    };
    
    const deleteCategory = async (id: number) => {
    if (!id) throw new Error("Category ID is required.");
    return await categoryDb.deleteCategory({id});
    };
    
    export default {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    };