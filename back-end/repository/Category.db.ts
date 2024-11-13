import { PrismaClient } from '@prisma/client';
import { Category } from '../domain/model/Category';

const prisma = new PrismaClient();

export class CategoryRepository {
    // Create a new category in the database
    async create(categoryData: { naam: string; beschrijving: string }): Promise<Category> {
        const newCategoryData = await prisma.category.create({
            data: {
                naam: categoryData.naam,
                beschrijving: categoryData.beschrijving,
            },
        });
        return Category.from(newCategoryData); // Convert Prisma object to domain model
    }

    // Find a category by its ID
    async findById(id: number): Promise<Category | undefined> {
        const categoryData = await prisma.category.findUnique({
            where: { id },
        });
        return categoryData ? Category.from(categoryData) : undefined;
    }

    // Retrieve all categories from the database
    async findAll(): Promise<Category[]> {
        const categoriesData = await prisma.category.findMany();
        return categoriesData.map(Category.from); // Map each Prisma object to a Category instance
    }

    // Update a category in the database
    async update(
        id: number,
        updatedData: { naam?: string; beschrijving?: string }
    ): Promise<Category | undefined> {
        const categoryExists = await prisma.category.findUnique({ where: { id } });
        if (!categoryExists) return undefined;

        const updatedCategoryData = await prisma.category.update({
            where: { id },
            data: updatedData,
        });
        return Category.from(updatedCategoryData);
    }

    // Delete a category from the database
    async delete(id: number): Promise<void> {
        await prisma.category.delete({
            where: { id },
        });
    }
}
