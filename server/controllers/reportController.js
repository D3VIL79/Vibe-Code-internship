import { generateReport as geminiGenerateReport } from '../services/geminiService.js';
import { deductTokens } from '../middleware/tokenMeter.js';
import { query } from '../config/database.js';

export const generateReport = async (req, res) => {
  try {
    const { product, industry, businessModels, dealSize, buyerProfiles, additionalContext } = req.body;
    const userId = req.user.id;
    const subscription = req.subscription;

    if (!product || !industry) {
      return res.status(400).json({ error: 'Product and Industry are required.' });
    }

    // Fetch user's training data to provide as context
    const trainingResult = await query('SELECT * FROM training_data WHERE user_id = $1 AND processed = true', [userId]);
    const trainingData = trainingResult.rows;

    const { reportData, tokensUsed } = await geminiGenerateReport({
      product, industry, businessModels, dealSize, buyerProfiles, additionalContext
    }, trainingData);

    // Save the report
    const insertResult = await query(
      \`INSERT INTO reports (user_id, product, industry, report_data, tokens_used) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *\`,
      [userId, product, industry, reportData, tokensUsed]
    );

    // Deduct tokens
    await deductTokens(subscription.id, tokensUsed);
    
    // Log usage
    await query(
      \`INSERT INTO token_usage (user_id, subscription_id, tokens_consumed, action)
       VALUES ($1, $2, $3, 'generate_report')\`,
      [userId, subscription.id, tokensUsed]
    );

    res.status(201).json({ report: insertResult.rows[0], tokensUsed });
  } catch (error) {
    console.error('Generate Report Error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

export const listReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await query(
      'SELECT id, product, industry, created_at, tokens_used FROM reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('List Reports Error:', error);
    res.status(500).json({ error: 'Failed to list reports' });
  }
};

export const getReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const result = await query('SELECT * FROM reports WHERE id = $1 AND user_id = $2', [id, userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get Report Error:', error);
    res.status(500).json({ error: 'Failed to retrieve report' });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const result = await query('DELETE FROM reports WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Report not found or not authorized' });
    }
    
    res.json({ message: 'Report deleted successfully', id });
  } catch (error) {
    console.error('Delete Report Error:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
};
