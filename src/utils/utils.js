import fs from 'fs/promises';
import path from 'path';

const topicsDirectory = path.join(process.cwd(), 'public', 'topics');

/**
 * Returns an array of all arguments with their id, title, subtitle, date and description
 * @returns {Promise<Array>} Array of argument summaries
 */
export async function getAllTopics() {
    try {
        const files = await fs.readdir(topicsDirectory);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        const argumentsList = await Promise.all(
            jsonFiles.map(async (file) => {
                const filePath = path.join(topicsDirectory, file);
                const fileContent = await fs.readFile(filePath, 'utf8');
                const parsed = JSON.parse(fileContent);

                return {
                    id: parsed.id,
                    title: parsed.title,
                    subtitle: parsed.subtitle,
                    date: parsed.date,
                    description: parsed.description
                };
            })
        );

        // Sort by date (extract start year from date string like "1914–1918" or "1871–1914")
        // Sort in reverse chronological order (newest first, oldest last)
        argumentsList.sort((a, b) => {
            const getStartYear = (dateStr) => {
                const match = dateStr.match(/^(\d{4})/);
                return match ? parseInt(match[1]) : 0;
            };
            return getStartYear(b.date) - getStartYear(a.date);
        });

        return argumentsList;
    } catch (error) {
        console.error('Error reading topics:', error);
        return [];
    }
}

/**
 * Returns a specific argument by id with all its information
 * @param {string} id - The id of the argument to retrieve
 * @returns {Promise<Object|null>} The argument object or null if not found
 */
export async function getTopicById(id) {
    try {
        const filePath = path.join(topicsDirectory, `${id}.json`);

        try {
            const fileContent = await fs.readFile(filePath, 'utf8');
            const parsed = JSON.parse(fileContent);
            return parsed;
        } catch (fileError) {
            if (fileError.code === 'ENOENT') {
                return null;
            }
            throw fileError;
        }
    } catch (error) {
        console.error(`Error reading argument ${id}:`, error);
        return null;
    }
}
