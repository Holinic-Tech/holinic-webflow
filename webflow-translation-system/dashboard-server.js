#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Store active translation processes
const activeTranslations = new Map();
const activeProcesses = new Map();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Get available pages
app.get('/api/pages', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(
      `https://api.webflow.com/v2/sites/${process.env.WEBFLOW_SITE_ID}/pages`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.WEBFLOW_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    const pages = data.pages?.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug
    })) || [];
    
    res.json({ success: true, pages });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Get translation status
app.get('/api/status/:translationId', (req, res) => {
  const { translationId } = req.params;
  const translation = activeTranslations.get(translationId);
  
  if (!translation) {
    res.json({ success: false, error: 'Translation not found' });
    return;
  }
  
  res.json({
    success: true,
    status: translation.status,
    progress: translation.progress,
    logs: translation.logs,
    error: translation.error
  });
});

// Start translation
app.post('/api/translate', (req, res) => {
  const { pageSlug, targetLanguage, mode = 'progressive' } = req.body;
  
  if (!pageSlug || !targetLanguage) {
    res.json({ success: false, error: 'Missing required parameters' });
    return;
  }
  
  const translationId = `${pageSlug}-${targetLanguage}-${Date.now()}`;
  const translation = {
    id: translationId,
    pageSlug,
    targetLanguage,
    status: 'running',
    progress: 0,
    logs: [],
    startTime: new Date()
  };
  
  activeTranslations.set(translationId, translation);
  
  // For French, use the working progressive script
  let scriptName;
  let args = [];
  
  if (targetLanguage === 'fr') {
    // Use the working French progressive script with page slug parameter
    scriptName = 'translate-french-progressive.js';
    args = [pageSlug];
  } else if (targetLanguage === 'de') {
    // German script is hardcoded to 'challenge' slug
    scriptName = 'translate-all-english-progressive.js';
  } else {
    // Other languages use multilingual script
    scriptName = 'translate-page-multilingual.js';
    args = ['--lang', targetLanguage, '--page', pageSlug];
  }
  
  const child = spawn('node', [scriptName, ...args], {
    cwd: __dirname,
    env: process.env
  });
  
  // Store the process
  activeProcesses.set(translationId, child);
  translation.pid = child.pid;
  
  // Capture output
  child.stdout.on('data', (data) => {
    const text = data.toString();
    translation.logs.push({
      type: 'info',
      message: text.trim(),
      timestamp: new Date()
    });
    
    // Try to extract progress
    const progressMatch = text.match(/batch (\d+)\/(\d+)/i);
    if (progressMatch) {
      const current = parseInt(progressMatch[1]);
      const total = parseInt(progressMatch[2]);
      translation.progress = Math.round((current / total) * 100);
    }
    
    // Check for completion
    if (text.includes('Translation complete!') || text.includes('All done!')) {
      translation.status = 'completed';
      translation.progress = 100;
    }
  });
  
  child.stderr.on('data', (data) => {
    translation.logs.push({
      type: 'error',
      message: data.toString().trim(),
      timestamp: new Date()
    });
  });
  
  child.on('close', (code) => {
    activeProcesses.delete(translationId);
    
    if (translation.status === 'stopping') {
      translation.status = 'stopped';
      translation.error = 'Translation stopped by user';
    } else if (code !== 0 && translation.status !== 'completed') {
      translation.status = 'failed';
      translation.error = `Process exited with code ${code}`;
    } else if (translation.status !== 'completed') {
      translation.status = 'completed';
      translation.progress = 100;
    }
    
    // Clean up after 30 minutes
    setTimeout(() => {
      activeTranslations.delete(translationId);
    }, 30 * 60 * 1000);
  });
  
  res.json({
    success: true,
    translationId,
    message: 'Translation started'
  });
});

// Get progress file status
app.get('/api/progress/:language', (req, res) => {
  const { language } = req.params;
  
  try {
    let progressFile;
    if (language === 'fr') {
      progressFile = 'french-translation-progress.json';
    } else if (language === 'de') {
      progressFile = 'translation-progress-*.json';
    }
    
    if (fs.existsSync(progressFile)) {
      const data = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
      res.json({
        success: true,
        hasProgress: true,
        processedNodes: data.processedIds?.length || 0,
        totalProcessed: data.totalProcessed || 0,
        lastUpdated: data.lastUpdated
      });
    } else {
      res.json({ success: true, hasProgress: false });
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Clear progress
app.delete('/api/progress/:language', (req, res) => {
  const { language } = req.params;
  
  try {
    if (language === 'fr') {
      if (fs.existsSync('french-translation-progress.json')) {
        fs.unlinkSync('french-translation-progress.json');
      }
    }
    res.json({ success: true, message: 'Progress cleared' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Stop translation
app.post('/api/stop/:translationId', (req, res) => {
  const { translationId } = req.params;
  const translation = activeTranslations.get(translationId);
  const process = activeProcesses.get(translationId);
  
  if (!translation) {
    res.json({ success: false, error: 'Translation not found' });
    return;
  }
  
  if (process) {
    translation.status = 'stopping';
    process.kill('SIGTERM');
    
    // Force kill after 5 seconds if still running
    setTimeout(() => {
      if (activeProcesses.has(translationId)) {
        process.kill('SIGKILL');
      }
    }, 5000);
    
    res.json({ success: true, message: 'Stopping translation' });
  } else {
    res.json({ success: false, error: 'Process not found' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'running',
    activeTranslations: activeTranslations.size 
  });
});

app.listen(PORT, () => {
  console.log(`
🌐 Translation Dashboard Server Running
📍 URL: http://localhost:${PORT}
📋 Dashboard: http://localhost:${PORT}/translation-dashboard-web.html

Available endpoints:
- GET  /api/pages - List all pages
- POST /api/translate - Start translation
- GET  /api/status/:id - Check translation status
- GET  /api/progress/:lang - Check saved progress
- DELETE /api/progress/:lang - Clear saved progress

Press Ctrl+C to stop the server.
  `);
});