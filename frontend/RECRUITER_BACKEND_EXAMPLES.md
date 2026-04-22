# Recruiter Backend - Mock Data & Response Examples

This file contains example API responses and mock data for developing and testing the recruiter UI.

---

## 📊 Mock Data

### Stats Response
```json
{
  "profilesViewed": 156,
  "profilesStarred": 38,
  "totalCandidates": 823,
  "githubVerified": 67
}
```

### Activity Response
```json
[
  {
    "candidateName": "Alice Johnson",
    "action": "profile viewed",
    "timestamp": "2024-04-22T14:30:00Z"
  },
  {
    "candidateName": "Bob Smith",
    "action": "profile starred",
    "timestamp": "2024-04-22T13:45:00Z"
  },
  {
    "candidateName": "Carol Williams",
    "action": "resume downloaded",
    "timestamp": "2024-04-22T12:15:00Z"
  },
  {
    "candidateName": "David Chen",
    "action": "profile viewed",
    "timestamp": "2024-04-22T11:30:00Z"
  },
  {
    "candidateName": "Eva Martinez",
    "action": "message sent",
    "timestamp": "2024-04-22T10:00:00Z"
  }
]
```

### Candidates Search Response
```json
[
  {
    "_id": "candidate_001",
    "name": "Jane Smith",
    "university": "Stanford University",
    "score": 88,
    "tier": "High Potential",
    "topSkills": ["React", "Node.js", "MongoDB", "AWS"]
  },
  {
    "_id": "candidate_002",
    "name": "John Developer",
    "university": "MIT",
    "score": 92,
    "tier": "High Potential",
    "topSkills": ["Python", "TensorFlow", "PyTorch", "Kubernetes"]
  },
  {
    "_id": "candidate_003",
    "name": "Maria Garcia",
    "university": "UC Berkeley",
    "score": 76,
    "tier": "Moderate",
    "topSkills": ["Vue.js", "Express.js", "PostgreSQL", "Docker"]
  },
  {
    "_id": "candidate_004",
    "name": "Alex Kumar",
    "university": "University of Toronto",
    "score": 65,
    "tier": "Entry Level",
    "topSkills": ["JavaScript", "HTML/CSS", "Git", "REST APIs"]
  },
  {
    "_id": "candidate_005",
    "name": "Sophie Liu",
    "university": "CMU",
    "score": 81,
    "tier": "High Potential",
    "topSkills": ["Java", "Spring Boot", "Microservices", "AWS"]
  },
  {
    "_id": "candidate_006",
    "name": "Michael O'Brien",
    "university": "Georgia Tech",
    "score": 72,
    "tier": "Moderate",
    "topSkills": ["Go", "Rust", "gRPC", "Protocol Buffers"]
  }
]
```

### Candidate Detail Response
```json
{
  "_id": "candidate_001",
  "name": "Jane Smith",
  "university": "Stanford University",
  "email": "jane.smith@example.com",
  "score": 88,
  "tier": "High Potential",
  "topSkills": ["React", "Node.js", "MongoDB", "AWS", "TypeScript", "GraphQL"],
  "scoreBreakdown": {
    "technicalSkills": 92,
    "experience": 85,
    "communication": 87,
    "collaboration": 83
  },
  "projects": [
    {
      "title": "E-commerce Platform",
      "description": "Full-stack React and Node.js application with real-time inventory management and payment integration",
      "technologies": ["React", "Node.js", "Express", "MongoDB", "Stripe API", "Socket.io"]
    },
    {
      "title": "Data Analytics Dashboard",
      "description": "Interactive dashboard for visualizing company metrics with real-time data updates",
      "technologies": ["React", "D3.js", "Redux", "Node.js", "PostgreSQL", "AWS"]
    },
    {
      "title": "Open Source: React Components Library",
      "description": "Accessible and performant React component library used by 1000+ developers",
      "technologies": ["React", "TypeScript", "Storybook", "Jest", "GraphQL"]
    }
  ]
}
```

### Starred Candidates Response
```json
[
  {
    "_id": "candidate_001",
    "name": "Jane Smith",
    "university": "Stanford University",
    "score": 88,
    "tier": "High Potential",
    "topSkills": ["React", "Node.js", "MongoDB", "AWS"],
    "isStarred": true
  },
  {
    "_id": "candidate_002",
    "name": "John Developer",
    "university": "MIT",
    "score": 92,
    "tier": "High Potential",
    "topSkills": ["Python", "TensorFlow", "PyTorch"],
    "isStarred": true
  },
  {
    "_id": "candidate_003",
    "name": "Maria Garcia",
    "university": "UC Berkeley",
    "score": 76,
    "tier": "Moderate",
    "topSkills": ["Vue.js", "Express.js", "PostgreSQL"],
    "isStarred": true
  }
]
```

### Profile Response
```json
{
  "name": "Emma Thompson",
  "email": "emma.thompson@techcorp.com",
  "company": "TechCorp Inc.",
  "position": "Senior Talent Recruiter",
  "address": "123 Silicon Valley Blvd, San Jose, CA 95110",
  "aboutCompany": "TechCorp Inc. is a leading software development company specializing in cloud solutions and AI technologies. We're committed to finding the best talent to build innovative products that impact millions of users worldwide."
}
```

### Profile Update Response
```json
{
  "success": true,
  "data": {
    "name": "Emma Thompson",
    "email": "emma.thompson@techcorp.com",
    "company": "TechCorp Inc.",
    "position": "Senior Talent Recruiter",
    "address": "123 Silicon Valley Blvd, San Jose, CA 95110",
    "aboutCompany": "Updated company description..."
  }
}
```

---

## 🧪 Testing Examples

### JavaScript Fetch Examples

#### Get Stats
```javascript
fetch('/api/recruiter/stats', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

#### Search Candidates
```javascript
const params = new URLSearchParams({
  roles: 'Full Stack,Frontend',
  minScore: 70,
  topOnly: false,
  search: 'React'
});

fetch(`/api/recruiter/candidates?${params}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

#### Star Candidate
```javascript
fetch('/api/recruiter/star/candidate_001', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

#### Update Profile
```javascript
fetch('/api/recruiter/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Updated Name",
    email: "newemail@company.com",
    company: "New Company",
    position: "New Position",
    address: "New Address",
    aboutCompany: "Updated about company text"
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🔧 Backend Implementation Tips

### Using Express.js

#### Middleware for Authentication
```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  // Verify token and set req.user
  // ...
  next();
};

// Apply to all recruiter routes
app.use('/api/recruiter', authenticateToken, recruiterRoutes);
```

#### Check Recruiter Role
```javascript
const requireRecruiter = (req, res, next) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};
```

#### Example Route
```javascript
router.get('/api/recruiter/stats', requireRecruiter, async (req, res) => {
  try {
    const recruiterId = req.user.id;
    
    const stats = await Promise.all([
      Candidate.countDocuments({ viewedBy: recruiterId }),
      Candidate.countDocuments({ starredBy: recruiterId }),
      Candidate.countDocuments({}),
      Candidate.countDocuments({ githubVerified: true })
    ]);
    
    res.json({
      profilesViewed: stats[0],
      profilesStarred: stats[1],
      totalCandidates: stats[2],
      githubVerified: stats[3]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Filtering Candidates
```javascript
const buildFilter = (query) => {
  const filter = {};
  
  if (query.roles && query.roles.length > 0) {
    const rolesArray = query.roles.split(',');
    filter.primaryRole = { $in: rolesArray };
  }
  
  if (query.minScore) {
    filter.score = { $gte: parseInt(query.minScore) };
  }
  
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { topSkills: { $regex: query.search, $options: 'i' } },
      { university: { $regex: query.search, $options: 'i' } }
    ];
  }
  
  if (query.topOnly === 'true') {
    filter.score = { $gte: 80 };
  }
  
  return filter;
};

router.get('/api/recruiter/candidates', requireRecruiter, async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const limit = parseInt(req.query.limit) || 10;
    
    const candidates = await Candidate
      .find(filter)
      .limit(limit)
      .select('name university score tier topSkills');
    
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Starring Candidates
```javascript
router.post('/api/recruiter/star/:candidateId', requireRecruiter, async (req, res) => {
  try {
    const { candidateId } = req.params;
    const recruiterId = req.user.id;
    
    // Update or create star record
    await starCandidate(recruiterId, candidateId);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 📋 Database Schema Considerations

### Recruiter Model
```javascript
const recruiterSchema = {
  _id: ObjectId,
  userId: ObjectId, // Reference to User
  name: String,
  email: String,
  company: String,
  position: String,
  address: String,
  aboutCompany: String,
  starredCandidates: [ObjectId], // Array of candidate IDs
  recentActivity: [
    {
      type: String, // 'viewed', 'starred', 'messaged'
      candidateId: ObjectId,
      timestamp: Date
    }
  ]
}
```

### Candidate Star Record
```javascript
const candidateStarSchema = {
  _id: ObjectId,
  recruiterId: ObjectId,
  candidateId: ObjectId,
  starredAt: Date
}
```

### Activity Log
```javascript
const activityLogSchema = {
  _id: ObjectId,
  recruiterId: ObjectId,
  candidateId: ObjectId,
  action: String, // 'profile_viewed', 'starred', 'unstarred', 'profile_shared'
  timestamp: Date,
  metadata: Object // Additional data
}
```

---

## 🧪 Postman Collection Example

```json
{
  "info": {
    "name": "CredVerify Recruiter API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Stats",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ],
        "url": { "raw": "{{baseUrl}}/api/recruiter/stats" }
      }
    },
    {
      "name": "Search Candidates",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/recruiter/candidates?roles=Full%20Stack&minScore=70",
          "query": [
            { "key": "roles", "value": "Full Stack" },
            { "key": "minScore", "value": "70" }
          ]
        }
      }
    },
    {
      "name": "Star Candidate",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ],
        "url": { "raw": "{{baseUrl}}/api/recruiter/star/candidate_001" }
      }
    }
  ]
}
```

---

## 🔍 Error Responses

### Unauthorized
```json
{
  "error": "Unauthorized",
  "status": 401
}
```

### Forbidden (Not a Recruiter)
```json
{
  "error": "Access denied. This action is only available to recruiters.",
  "status": 403
}
```

### Not Found
```json
{
  "error": "Candidate not found",
  "status": 404
}
```

### Server Error
```json
{
  "error": "Internal server error",
  "status": 500
}
```

---

## 💾 Quick Seed Script

```javascript
// Create mock recruiter data
const mockCandidates = [
  {
    name: "Jane Smith",
    university: "Stanford",
    score: 88,
    tier: "High Potential",
    topSkills: ["React", "Node.js", "MongoDB", "AWS"]
  },
  // ... more candidates
];

// Seed to database
Candidate.insertMany(mockCandidates)
  .then(() => console.log('Candidates seeded'))
  .catch(err => console.error(err));
```

---

Use this data and examples to quickly develop and test the recruiter backend API!
