import Visitor from '../models/visitorModel.js';
import Visit from '../models/visitModel.js';
import * as QRCode from 'qrcode';
import mongoose from 'mongoose';

export async function createVisit(req, res) {
  const { visitor, purpose, host } = req.body;
  try {
    const visitorDoc = await Visitor.findById(visitor);
    if (!visitorDoc) {
      return res.status(404).json({ message: 'Visitor not found.' });
    }
    
    // Generate unique visit ID
    const visitId = new mongoose.Types.ObjectId();
    const timestamp = Date.now();
    
    // Create URL for visitor profile and visit details
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const qrUrl = `${baseUrl}/visit-details/${visitId}`;
    
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    const visit = new Visit({ 
      _id: visitId,
      visitor: visitor, 
      purpose, 
      host, 
      qrCode: qrCodeDataURL,
      status: 'active'
    });
    
    await visit.save();
    
    // Return visit with QR code
    const visitWithDetails = await Visit.findById(visitId).populate('visitor', 'name email phone company');
    
    res.status(201).json({
      ...visitWithDetails.toObject(),
      qrCode: qrCodeDataURL,
      qrUrl: qrUrl
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating visit.', error: error.message });
  }
}

export async function validateQRCode(req, res) {
  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      return res.status(400).json({ message: 'QR code data is required' });
    }
    
    // Extract visit ID from URL
    let visitId;
    try {
      // Check if it's a URL
      if (qrData.startsWith('http')) {
        const urlParts = qrData.split('/');
        visitId = urlParts[urlParts.length - 1];
      } else {
        // Try to parse as JSON (backward compatibility)
        const parsedData = JSON.parse(qrData);
        visitId = parsedData.visitId;
      }
    } catch (error) {
      return res.status(400).json({ message: 'Invalid QR code format' });
    }
    
    if (!visitId) {
      return res.status(400).json({ message: 'Invalid QR code: missing visit ID' });
    }
    
    // Find the visit
    const visit = await Visit.findById(visitId).populate('visitor', 'name email phone company');
    
    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }
    
    // Check if visit is still active
    if (visit.status !== 'active') {
      return res.status(400).json({ 
        message: 'Visit is no longer active',
        status: visit.status
      });
    }
    
    // Check if QR code is expired (24 hours)
    const qrAge = Date.now() - new Date(visit.entryTime).getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (qrAge > maxAge) {
      return res.status(400).json({ 
        message: 'QR code has expired',
        expired: true
      });
    }
    
    // Return visit information for exit processing
    res.json({
      valid: true,
      visit: {
        _id: visit._id,
        visitor: visit.visitor,
        purpose: visit.purpose,
        host: visit.host,
        entryTime: visit.entryTime,
        status: visit.status
      },
      message: 'QR code is valid'
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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

export async function getVisitHistory(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      visitorId,
      host,
      startDate,
      endDate,
      sortBy = 'entryTime',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (visitorId) {
      filter.visitor = visitorId;
    }
    
    if (host) {
      filter.host = { $regex: host, $options: 'i' };
    }
    
    if (startDate || endDate) {
      filter.entryTime = {};
      if (startDate) {
        filter.entryTime.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.entryTime.$lte = new Date(endDate);
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get visits with pagination and filtering
    const visits = await Visit.find(filter)
      .populate('visitor', 'name email phone company')
      .populate('documentsSigned.documentId', 'title type')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalVisits = await Visit.countDocuments(filter);
    const totalPages = Math.ceil(totalVisits / parseInt(limit));

    // Calculate visit duration for each visit
    const visitsWithDuration = visits.map(visit => {
      const visitObj = visit.toObject();
      if (visit.exitTime) {
        const duration = Math.floor((visit.exitTime - visit.entryTime) / (1000 * 60)); // Duration in minutes
        visitObj.duration = duration;
        visitObj.durationFormatted = `${Math.floor(duration / 60)}h ${duration % 60}m`;
      } else {
        visitObj.duration = null;
        visitObj.durationFormatted = 'Ongoing';
      }
      return visitObj;
    });

    res.json({
      visits: visitsWithDuration,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalVisits,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
}

export async function getVisitById(req, res) {
  try {
    const { id } = req.params;
    const visit = await Visit.findById(id)
      .populate('visitor', 'name email phone company')
      .populate('documentsSigned.documentId', 'title type content');

    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }

    // Calculate duration
    const visitObj = visit.toObject();
    if (visit.exitTime) {
      const duration = Math.floor((visit.exitTime - visit.entryTime) / (1000 * 60));
      visitObj.duration = duration;
      visitObj.durationFormatted = `${Math.floor(duration / 60)}h ${duration % 60}m`;
    } else {
      visitObj.duration = null;
      visitObj.durationFormatted = 'Ongoing';
    }

    res.json(visitObj);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export async function getVisitorVisitHistory(req, res) {
  try {
    const { visitorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Verify visitor exists
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const visits = await Visit.find({ visitor: visitorId })
      .populate('documentsSigned.documentId', 'title type')
      .sort({ entryTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalVisits = await Visit.countDocuments({ visitor: visitorId });
    const totalPages = Math.ceil(totalVisits / parseInt(limit));

    // Calculate duration for each visit
    const visitsWithDuration = visits.map(visit => {
      const visitObj = visit.toObject();
      if (visit.exitTime) {
        const duration = Math.floor((visit.exitTime - visit.entryTime) / (1000 * 60));
        visitObj.duration = duration;
        visitObj.durationFormatted = `${Math.floor(duration / 60)}h ${duration % 60}m`;
      } else {
        visitObj.duration = null;
        visitObj.durationFormatted = 'Ongoing';
      }
      return visitObj;
    });

    res.json({
      visitor: {
        _id: visitor._id,
        name: visitor.name,
        email: visitor.email,
        phone: visitor.phone,
        company: visitor.company
      },
      visits: visitsWithDuration,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalVisits,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}