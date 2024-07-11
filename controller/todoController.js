import todoModel from "../models/Todo.js";

export const createTodo = async (req, res) => {
  const { title, description, tags } = req.body;
  const imagePath = req.files.image ? req.files.image[0].path : null;
  const filePath = req.files.file ? req.files.file[0].path : null;
  try {
    const todo = new todoModel({
      user: req.user,
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
  const { tag, page = 1 } = req.query;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const baseUrl = `${req.protocol}:/${req.get('host')}`;

  try {
    let query = { user: req.user };

    if (tag) {
      query.tags = { $regex: tag, $options: 'i' };
    }

    const totalTodos = await todoModel.countDocuments(query);
    const todos = await todoModel.find(query)
      .skip(skip)
      .limit(pageSize)
      .lean();

    const normalizePath = (filePath) => filePath.replace(/\\/g, '/');


    todos.forEach(todo => {
      if (todo.imagePath) {
        todo.imageUrl = normalizePath(`${baseUrl}/${todo.imagePath}`);

      }
      if (todo.filePath) {
        todo.fileUrl = normalizePath(`${baseUrl}/${todo.filePath}`);
      }
      // send filename too
      if (todo.filePath) {
        todo.fileName = todo.filePath.split('\\').pop();
      }
    });

    res.json({
      todos,
      totalTodos,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(totalTodos / pageSize)
    });
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Failed to fetch todos' });
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
    await todoModel.deleteOne({ _id: req.params.id, user: req.user });
    res.json({ message: "Todo removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
