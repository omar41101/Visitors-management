import Visitor from '../models/visitorModel.js';
import Visit from '../models/visitModel.js';
import * as QRCode from 'qrcode';

export async function createVisit(req, res) {
  const { visitorId, purpose, host } = req.body;
  try {
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found.' });
    }
    const qrCode = await QRCode.toDataURL(`visit:${visitorId}:${Date.now()}`);
    const visit = new Visit({ visitor: visitorId, purpose, host, qrCode });
    await visit.save();
    // TODO: Implement email notifications
    res.status(201).json(visit);
  } catch (error) {
    res.status(400).json({ message: 'Error creating visit.', error: error.message });
  }
}

export async function updateVisitExit(req, res) {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit) {
      return res.status(404).json({ message: 'Visit not found.' });
    }
    visit.exitTime = new Date();
    visit.status = 'completed';
    await visit.save();
    res.json(visit);
  } catch (error) {
    res.status(400).json({ message: 'Error updating visit.', error: error.message });
  }
}

export async function getVisits(req, res) {
  try {
    const visits = await Visit.find().populate('visitor');
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
}