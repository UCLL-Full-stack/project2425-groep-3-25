import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
    // Seed Companies
    const company1 = await prisma.company.create({
        data: {
            naam: 'Tech Innovators',
            locatie: 'New York, USA',
            contact_informatie: 'contact@techinnovators.com',
        },
    });

    const company2 = await prisma.company.create({
        data: {
            naam: 'Green Solutions',
            locatie: 'Berlin, Germany',
            contact_informatie: 'info@greensolutions.de',
        },
    });

    // Seed Categories
    const category1 = await prisma.category.create({
        data: {
            naam: 'Renewable Energy',
            beschrijving: 'Projects focused on renewable energy solutions',
        },
    });

    const category2 = await prisma.category.create({
        data: {
            naam: 'Healthcare AI',
            beschrijving: 'Projects focused on AI applications in healthcare',
        },
    });

    // Seed Projects
    await prisma.project.createMany({
        data: [
            {
                naam: 'Solar Energy Research',
                beschrijving: 'Research project focusing on innovative solar energy solutions.',
                datum_voltooid: new Date('2024-06-15'),
                bedrijf_id: company1.id, // Using `bedrijf_id` as defined in the schema
                categorie_id: category1.id,
            },
            {
                naam: 'AI in Healthcare',
                beschrijving: 'Exploring AI applications in healthcare to improve diagnostics.',
                datum_voltooid: new Date('2024-09-01'),
                bedrijf_id: company2.id,
                categorie_id: category2.id,
            },
            {
                naam: 'Sustainable Materials',
                beschrijving: 'Developing sustainable materials for reducing environmental impact.',
                datum_voltooid: new Date('2025-01-20'),
                bedrijf_id: company1.id,
                categorie_id: category1.id,
            },
        ],
    });

    // Seed Employees
    const employee1 = await prisma.employee.create({
        data: {
            naam: 'Alice Smith',
            email: 'alice@techinnovators.com',
            telefoonnummer: '123-456-7890',
            bedrijf_id: company1.id,
        },
    });

    const employee2 = await prisma.employee.create({
        data: {
            naam: 'Bob Johnson',
            email: 'bob@greensolutions.de',
            telefoonnummer: '987-654-3210',
            bedrijf_id: company2.id,
        },
    });

    // Seed Employee_Project (many-to-many relationship)
    await prisma.employee_Project.createMany({
        data: [
            {
                employee_id: employee1.id,
                project_id: 1, // ID of "Solar Energy Research" project
                rol: 'Lead Researcher',
            },
            {
                employee_id: employee2.id,
                project_id: 2, // ID of "AI in Healthcare" project
                rol: 'Data Scientist',
            },
        ],
    });

    console.log('Data seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
