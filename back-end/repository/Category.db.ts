import { PrismaClient } from '@prisma/client';
import { Category } from '../domain/model/Category';

const prisma = new PrismaClient();

const createCategory = async (categoryData: { naam: string; beschrijving: string }) => {
  // Check if a category with the same name already exists
  const existingCategory = await prisma.category.findUnique({
    where: { naam: categoryData.naam },
  });

  if (existingCategory) {
    throw new Error(`Category with name "${categoryData.naam}" already exists.`);
  }

  // Create the category if it doesn't exist
  const newCategory = await prisma.category.create({
    data: {
      naam: categoryData.naam,
      beschrijving: categoryData.beschrijving,
    },
  });

  return newCategory;
};

const getCategoryById = async ({
  id,
}: {
  id: number;
}): Promise<Category | null> => {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { projects: true }
    });
    return category ? Category.from(category) : null;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while finding the category by ID');
  }
};

const getAllCategories = async (): Promise<Category[]> => {
  try {
    const categories = await prisma.category.findMany({
      include: { projects: true }
    });
    return categories.map(Category.from);
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while retrieving all categories');
  }
};

const updateCategory = async (
  id: number,
  updatedData: { naam?: string; beschrijving?: string }
): Promise<Category | null> => {
  try {
    const categoryExists = await prisma.category.findUnique({ where: { id } });
    if (!categoryExists) return null;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updatedData,
      include: { projects: true }
    });
    return Category.from(updatedCategory);
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while updating the category');
  }
};

const deleteCategory = async ({
  id,
}: {
  id: number;
}): Promise<void> => {
  try {
    await prisma.category.delete({
      where: { id },
    });
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while deleting the category');
  }
};

export {
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
