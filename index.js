require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const Url = require('./models/Url');
const dns = require('dns');
const {URL: NodeURL} = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



// Your first API endpoint
app.post('/api/shorturl', async function(req, res) {
  const url = req.body.url;
  try {
    const parsedUrl = new NodeURL(url);
    const hostname = parsedUrl.hostname;
    dns.lookup(hostname, (err) => {
      if (err) {
        return res.status(400).json({error: "invalid url"});
      }
    });

    const existingUrl = await Url.findOne({originalUrl: url});
    if (existingUrl) {
      return res.json({original_url: url, short_url: existingUrl.shortId});
    }
    const newUrl = new Url({originalUrl: url});
    await newUrl.save();
    
    res.json({original_url: url, short_url: newUrl.shortId});
  } catch (err) {
    console.log(err);
    return res.status(400).json({error: "invalid url"});
  }
});

app.get("/api/shorturl/:urlId", async function(req, res) {
  const urlId = req.params.urlId;
  const existingUrl = await Url.findOne({shortId: urlId});
  if (existingUrl) {
    return res.redirect(existingUrl.originalUrl);
  }
  res.status(404).send("short url not found");
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
