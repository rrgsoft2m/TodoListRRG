const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTodos = async (req, res) => {
    try {
        const todos = await prisma.todo.findMany({
            where: { userId: req.user.id }
        });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTodo = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        const todo = await prisma.todo.create({
            data: {
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : null,
                userId: req.user.id
            }
        });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed, dueDate } = req.body;

        const todo = await prisma.todo.findUnique({ where: { id: parseInt(id) } });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.userId !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedTodo = await prisma.todo.update({
            where: { id: parseInt(id) },
            data: {
                title: title || todo.title,
                description: description || todo.description,
                completed: completed !== undefined ? completed : todo.completed,
                dueDate: dueDate ? new Date(dueDate) : todo.dueDate
            }
        });

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await prisma.todo.findUnique({ where: { id: parseInt(id) } });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.userId !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await prisma.todo.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Todo removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
