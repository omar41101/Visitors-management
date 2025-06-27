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

export async function updateVisitor(req, res) {
  try {
    const { id } = req.params;
    const { name, email, phone, company } = req.body;
    
    const visitor = await Visitor.findByIdAndUpdate(
      id, 
      { name, email, phone, company },
      { new: true, runValidators: true }
    );
    
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    
    res.json({ message: 'Visitor updated successfully', visitor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export async function deleteVisitor(req, res) {
  try {
    const { id } = req.params;
    const visitor = await Visitor.findByIdAndDelete(id);
    
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    
    res.json({ message: 'Visitor deleted successfully', visitor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}