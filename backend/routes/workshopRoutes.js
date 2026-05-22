const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/authMiddleware');
const Workshop = require('../models/Workshop');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const workshops = await Workshop.find()
      .populate('hostedBy', 'name profilePicture')
      .populate('attendees', 'name profilePicture');
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workshops' });
  }
});

router.post('/', protectRoute, async (req, res) => {
  try {
    const {
      name,
      categories,
      date,
      time,
      location,
      about,
      ticketPrice,
      applicationPeriod,
      seats,
      imageUrl,
    } = req.body;

    const newWorkshop = new Workshop({
      name,
      categories,
      date,
      time,
      location,
      about,
      ticketPrice,
      applicationPeriod,
      seats,
      imageUrl,
      hostedBy: req.user._id,
      attendees: [],
    });

    const savedWorkshop = await newWorkshop.save();
    res.status(201).json(savedWorkshop);
  } catch (err) {
    console.error('Error creating workshop:', err);
    res.status(500).json({ error: 'Failed to create workshop' });
  }
});

router.get('/mine', protectRoute, async (req, res) => {
  try {
    const workshops = await Workshop.find({ hostedBy: req.user._id }).populate(
      'hostedBy',
      'name profilePicture'
    );
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workshops' });
  }
});

router.get('/recommended', protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.interests || user.interests.length === 0) {
      return res.json([]);
    }

    const recommendedWorkshops = await Workshop.find({
      categories: { $in: user.interests },
    })
      .populate('hostedBy', 'name profilePicture')
      .populate('attendees', 'name profilePicture');

    res.json(recommendedWorkshops);
  } catch (err) {
    console.error('Recommendation error:', err);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

router.post('/match', protectRoute, async (req, res) => {
  try {
    const { categories } = req.body;

    if (!categories || categories.length === 0) {
      return res.json([]);
    }

    const matchedWorkshops = await Workshop.find({
      $or: [{ categories: { $in: categories } }, { category: { $in: categories } }],
    })
      .populate('hostedBy', 'name profilePicture')
      .populate('attendees', 'name profilePicture');

    res.json(matchedWorkshops);
  } catch (err) {
    console.error('Workshop match error:', err);
    res.status(500).json({ error: 'Failed to match workshops' });
  }
});

// GET workshops user has registered for
router.get('/attending', protectRoute, async (req, res) => {
  try {
    const workshops = await Workshop.find({ attendees: req.user._id }).populate(
      'hostedBy',
      'name profilePicture'
    );
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workshops' });
  }
});

router.get('/:id', protectRoute, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id)
      .populate('hostedBy', 'name profilePicture')
      .populate('attendees', 'name profilePicture');
    if (!workshop) return res.status(404).json({ error: 'Not found' });
    res.json(workshop);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workshop' });
  }
});

router.delete('/:id', protectRoute, async (req, res) => {
  try {
    const workshop = await Workshop.findOneAndDelete({
      _id: req.params.id,
      hostedBy: req.user._id,
    });
    if (!workshop) return res.status(404).json({ error: 'Workshop not found' });
    res.json({ message: 'Workshop deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete workshop' });
  }
});

// Attend a workshop
router.post('/:id/attend', protectRoute, async (req, res) => {
  try {
    const workshopId = req.params.id;

    // Grabing the phone and email sent from Receipt.tsx
    const { phone, email } = req.body;

    // Updating the user's profile with the new contact info
    if (phone || email) {
      await User.findByIdAndUpdate(req.user._id, {
        ...(phone && { phone }), // Only updates phone if it was provided
        ...(email && { email }), // Only updates email if it was provided
      });
    }

    // Processing Workshop Attendance
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) return res.status(404).json({ error: 'Not found' });
    if (workshop.hostedBy.toString() === req.user._id)
      return res.status(403).json({ error: 'You cannot attend your own workshop' });
    if (workshop.attendees.includes(req.user._id))
      return res.status(400).json({ error: 'Already attending' });

    workshop.attendees.push(req.user._id);
    await workshop.save();

    res.json(workshop);
  } catch (err) {
    console.error('Attendance Error:', err);
    res.status(500).json({ error: 'Failed to attend' });
  }
});

// Post a review
router.post('/:id/review', protectRoute, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ error: 'Not found' });
    if (workshop.hostedBy.toString() === req.user._id)
      return res.status(403).json({ error: 'You cannot review your own workshop' });
    const { comment, rating } = req.body;
    workshop.reviews.push({ user: req.user._id, name: req.user.name, comment, rating });
    await workshop.save();
    res.json(workshop);
  } catch (err) {
    console.error('Review error:', err);
    res.status(500).json({ error: 'Failed to post review' });
  }
});

module.exports = router;
