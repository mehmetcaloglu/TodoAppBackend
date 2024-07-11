import todoModel from "../models/Todo.js";

export const createTodo = async (req, res) => {
  const { title, description, tags } = req.body;
  const imagePath = req.files.image ? req.files.image[0].path : null;
  const filePath = req.files.file ? req.files.file[0].path : null;
  try {
    const todo = new todoModel({
      user: req.user, // Giriş yapan kullanıcının ID'si
      title,
      description,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      imagePath,
      filePath,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTodos = async (req, res) => {
  const { tag, search } = req.query;
  try {
    let query = { user: req.user };

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const todos = await todoModel.find(query);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const todo = await todoModel.findOne({
      _id: req.params.id,
      user: req.user,
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTodo = async (req, res) => {
  const { title, description, tags } = req.body;
  const imagePath = req.files.image ? req.files.image[0].path : null;
  const filePath = req.files.file ? req.files.file[0].path : null;
  try {
    let todo = await todoModel.findOne({ _id: req.params.id, user: req.user });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.tags = tags ? tags.split(",").map((tag) => tag.trim()) : todo.tags;
    todo.imagePath = imagePath || todo.imagePath;
    todo.filePath = filePath || todo.filePath;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    let todo = await todoModel.findOne({ _id: req.params.id, user: req.user });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    await todo.remove();
    res.json({ message: "Todo removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
