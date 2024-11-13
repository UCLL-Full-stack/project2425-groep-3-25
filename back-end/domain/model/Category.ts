import { Category as CategoryPrisma } from '@prisma/client';

export class Category {
    readonly id: number;
    readonly naam: string;
    readonly beschrijving: string;

    constructor(category: { id: number; naam: string; beschrijving: string }) {
        this.validate(category);

        this.id = category.id;
        this.naam = category.naam;
        this.beschrijving = category.beschrijving;
    }

    private validate(category: { id: number; naam: string; beschrijving: string }) {
        if (!category.naam?.trim() || !category.beschrijving?.trim()) {
            throw new Error('All fields are required.');
        }
    }

    // Static from method to convert Prisma object to domain model
    static from(data: CategoryPrisma): Category {
        return new Category({
            id: data.id,
            naam: data.naam,
            beschrijving: data.beschrijving,
        });
    }
}
