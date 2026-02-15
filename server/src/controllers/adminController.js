const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { todos: true }
                }
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalTodos = await prisma.todo.count();
        const completedTodos = await prisma.todo.count({ where: { completed: true } });

        const completionRate = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

        res.json({
            totalUsers,
            totalTodos,
            completedTodos,
            completionRate: Math.round(completionRate)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, getStats, deleteUser };
