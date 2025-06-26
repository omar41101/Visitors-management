import Document from '../models/documentModel.js';
import Visit from '../models/visitModel.js';

export async function createDocument(req, res) {
  const { title, content, type } = req.body;
  try {
    const document = new Document({ title, content, type, createdBy: req.user.id });
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: 'Error creating document.', error: error.message });
  }
}

export async function signDocument(req, res) {
  const { signature } = req.body;
  try {
    const document = await Document.findById(req.params.documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }
    if (!document.signatures) document.signatures = [];
    document.signatures.push({ signature, signedAt: new Date() });
    await document.save();
    res.json(document);
  } catch (error) {
    res.status(400).json({ message: 'Error signing document.', error: error.message });
  }
}