import Document from "../models/documentModel.js";
import Visit from "../models/visitModel.js";

export async function getDocuments(req, res) {
  try {
    const documents = await Document.find().populate("createdBy", "name email");
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
}

export async function getDocument(req, res) {
  try {
    const { id } = req.params;
    const document = await Document.findById(id).populate(
      "createdBy",
      "name email"
    );

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function downloadDocument(req, res) {
  try {
    const { id } = req.params;
    const { format = "txt" } = req.query; // Default to text format

    const document = await Document.findById(id).populate(
      "createdBy",
      "name email"
    );

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Generate filename
    const filename = `${document.title.replace(/[^a-zA-Z0-9]/g, "_")}_v${
      document.version
    }`;

    if (format === "json") {
      // Download as JSON
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}.json"`
      );
      res.json(document);
    } else if (format === "txt") {
      // Download as plain text
      const textContent = `
Document: ${document.title}
Version: ${document.version}
Type: ${document.type}
Created by: ${document.createdBy.name} (${document.createdBy.email})
Created: ${document.createdAt}
Last updated: ${document.updatedAt}

${document.content}
      `.trim();

      res.setHeader("Content-Type", "text/plain");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}.txt"`
      );
      res.send(textContent);
    } else if (format === "html") {
      // Download as HTML
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${document.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .meta { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .content { white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${document.title}</h1>
    </div>
    <div class="meta">
        <p><strong>Version:</strong> ${document.version}</p>
        <p><strong>Type:</strong> ${document.type}</p>
        <p><strong>Created by:</strong> ${document.createdBy.name} (${document.createdBy.email})</p>
        <p><strong>Created:</strong> ${document.createdAt}</p>
        <p><strong>Last updated:</strong> ${document.updatedAt}</p>
    </div>
    <div class="content">${document.content}</div>
</body>
</html>
      `;

      res.setHeader("Content-Type", "text/html");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}.html"`
      );
      res.send(htmlContent);
    } else {
      return res
        .status(400)
        .json({ message: "Unsupported format. Use txt, html, or json" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function createDocument(req, res) {
  const { title, content, type } = req.body;
  try {
    const document = new Document({
      title,
      content,
      type,
      createdBy: req.user.id,
    });
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating document.", error: error.message });
  }
}

export async function signDocument(req, res) {
  const { signature } = req.body;
  try {
    const document = await Document.findById(req.params.documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }
    if (!document.signatures) document.signatures = [];
    document.signatures.push({ signature, signedAt: new Date() });
    await document.save();
    res.json(document);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error signing document.", error: error.message });
  }
}
