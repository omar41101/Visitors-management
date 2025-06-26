import Visitor from '../models/visitorModel.js';

export async function createVisitor(req, res) {
  const { name, email, phone, company } = req.body;
  try {
    const visitor = new Visitor({ name, email, phone, company });
    await visitor.save();
    res.status(201).json(visitor);
  } catch (error) {
    res.status(400).json({ message: 'Error creating visitor.', error: error.message });
  }
}

export async function getVisitors(req, res) {
  try {
    const visitors = await Visitor.find();
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
}