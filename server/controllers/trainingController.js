import { query } from '../config/database.js';
import { processText, extractFromYouTube } from '../services/transcriptService.js';

export const uploadTranscript = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const cleanedContent = processText(content);

    const result = await query(
      `INSERT INTO training_data (user_id, source_type, title, content, processed) 
       VALUES ($1, 'text', $2, $3, true) RETURNING *`,
      [userId, title, cleanedContent]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Upload Transcript Error:', error);
    res.status(500).json({ error: 'Failed to upload transcript' });
  }
};

export const uploadVideoUrl = async (req, res) => {
  try {
    const { url, title } = req.body;
    const userId = req.user.id;

    if (!url || !title) {
      return res.status(400).json({ error: 'URL and title are required' });
    }

    const content = await extractFromYouTube(url);

    const result = await query(
      `INSERT INTO training_data (user_id, source_type, title, content, processed) 
       VALUES ($1, 'youtube', $2, $3, true) RETURNING *`,
      [userId, title, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Upload Video Error:', error);
    res.status(500).json({ error: 'Failed to process video URL' });
  }
};

export const listTrainingData = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await query(
      'SELECT id, source_type, title, processed, created_at FROM training_data WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('List Training Data Error:', error);
    res.status(500).json({ error: 'Failed to list training data' });
  }
};

export const deleteTrainingData = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const result = await query('DELETE FROM training_data WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Training data not found or not authorized' });
    }
    
    res.json({ message: 'Training data deleted successfully', id });
  } catch (error) {
    console.error('Delete Training Data Error:', error);
    res.status(500).json({ error: 'Failed to delete training data' });
  }
};
