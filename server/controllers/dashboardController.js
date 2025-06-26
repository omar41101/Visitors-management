import Visitor from '../models/visitorModel.js';
import Visit from '../models/visitModel.js';

export async function getStats(req, res) {
  try {
    const totalVisitors = await Visitor.countDocuments();
    const activeVisits = await Visit.countDocuments({ status: 'active' });
    const completedVisits = await Visit.countDocuments({ status: 'completed' });
    res.json({ totalVisitors, activeVisits, completedVisits });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
}