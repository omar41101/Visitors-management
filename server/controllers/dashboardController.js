import Visitor from '../models/visitorModel.js';
import Visit from '../models/visitModel.js';

// Vue d'ensemble
export const getOverview = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const totalVisits = await Visit.countDocuments();
    const todayVisits = await Visit.countDocuments({ entryTime: { $gte: todayStart, $lt: todayEnd } });
    const upcomingVisits = await Visit.countDocuments({ entryTime: { $gte: now } });
    const completedVisits = await Visit.countDocuments({ status: 'completed' });

    // Prochaines visites (5 prochaines)
    const nextVisits = await Visit.find({ entryTime: { $gte: now } })
      .populate('visitor', 'name email')
      .sort({ entryTime: 1 })
      .limit(5);

    // Visites passées (5 dernières)
    const pastVisits = await Visit.find({ entryTime: { $lt: now } })
      .populate('visitor', 'name email')
      .sort({ entryTime: -1 })
      .limit(5);

    res.json({
      totalVisits,
      todayVisits,
      upcomingVisits,
      completedVisits,
      nextVisits,
      pastVisits
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Statistiques
export const getStats = async (req, res) => {
  try {
    // Nombre de visiteurs par type de visite
    const byType = await Visit.aggregate([
      { $group: { _id: '$purpose', count: { $sum: 1 } } }
    ]);

    // Respect des consignes (exemple : tous les documents signés)
    const compliance = await Visit.aggregate([
      {
        $group: {
          _id: '$allDocumentsSigned',
          count: { $sum: 1 }
        }
      }
    ]);

    // Nombre de visiteurs par mois (12 derniers mois)
    const byMonth = await Visit.aggregate([
      {
        $group: {
          _id: { $substr: ['$entryTime', 0, 7] }, // YYYY-MM
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      byType,
      compliance,
      byMonth
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const exportDashboard = async (req, res) => {
  res.status(200).json({ message: 'Export fonctionnel (à compléter)' });
};