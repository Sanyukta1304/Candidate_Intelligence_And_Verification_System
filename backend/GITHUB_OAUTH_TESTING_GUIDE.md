# GitHub OAuth Verification - Testing Guide

## Quick Test Summary

### Prerequisites
- Server running at `http://localhost:5000`
- JWT Token from login/OAuth (format: `Bearer <token>`)
- Postman or similar HTTP client

---

## Test Suite

### Test 1: User Registration (BE-1)
**Purpose**: Create a test user account

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "test_user",
  "email": "test@example.com",
  "password": "TestPassword123!",
  "role": "candidate"
}

Expected Response (200):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "username": "test_user",
    "email": "test@example.com",
    "role": "candidate",
    "github_verified": false,
    "githubId": null
  }
}
```

---

### Test 2: User Login (BE-1)
**Purpose**: Get JWT token for testing

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPassword123!"
}

Expected Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "username": "test_user",
      "email": "test@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

⚠️ Save the token for subsequent tests!
```

---

### Test 3: Verify User (BE-1)
**Purpose**: Confirm JWT token is valid

```
GET http://localhost:5000/api/auth/me
Headers:
  Authorization: Bearer <TOKEN_FROM_TEST_2>

Expected Response (200):
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "test_user",
    "email": "test@example.com",
    "role": "candidate",
    "github_verified": false
  }
}
```

---

### Test 4: Create Candidate Profile (BE-3)
**Purpose**: Initialize candidate profile before GitHub verification

```
POST http://localhost:5000/api/candidate/profile
Headers:
  Authorization: Bearer <TOKEN_FROM_TEST_2>
  Content-Type: application/json

{
  "about": "Software engineer passionate about coding",
  "skills": ["JavaScript", "Node.js", "React"]
}

Expected Response (200):
{
  "success": true,
  "message": "Candidate profile created successfully",
  "data": {
    "_id": "...",
    "user_id": "...",
    "about": "Software engineer passionate about coding",
    "skills": ["JavaScript", "Node.js", "React"],
    "github_verified": false,
    "github_verification_locked": false
  }
}
```

---

### Test 5: GitHub OAuth Initiation
**Purpose**: Start OAuth flow with GitHub

```
GET http://localhost:5000/api/auth/github
(No body needed)

Expected:
- Browser redirects to GitHub login
- User grants permissions
- GitHub redirects to /api/auth/github/callback
- Frontend receives JWT with github_verified = true
```

**⚠️ Note**: For automated testing, you need to:
1. Manually complete OAuth in browser once
2. Capture the JWT token returned
3. Use that token for remaining tests

---

### Test 6: Verify GitHub & Lock (First Call)
**Purpose**: Lock GitHub verification (one-time operation)

```
POST http://localhost:5000/api/candidate/github/verify
Headers:
  Authorization: Bearer <TOKEN_WITH_GITHUB_VERIFIED>
  Content-Type: application/json

Body: {} (empty)

Expected Response (200):
{
  "success": true,
  "message": "GitHub verified and locked successfully",
  "data": {
    "github_verified": true,
    "github_username": "your_github_username",
    "github_verified_at": "2024-04-20T10:35:00.000Z",
    "locked": true
  }
}

Database State After:
- candidate.github_verified = true
- candidate.github_verification_locked = true
```

---

### Test 7: Verify GitHub & Lock (Second Call - Should Fail)
**Purpose**: Confirm lock prevents re-verification

```
POST http://localhost:5000/api/candidate/github/verify
Headers:
  Authorization: Bearer <TOKEN_FROM_TEST_6>
  Content-Type: application/json

Body: {} (empty)

Expected Response (403):
{
  "success": false,
  "message": "GitHub verification already completed and locked. Cannot re-verify.",
  "data": {
    "github_verified": true,
    "github_verified_at": "2024-04-20T10:35:00.000Z",
    "locked": true
  }
}

✅ Confirms: Lock prevents re-verification!
```

---

### Test 8: Update Profile - Try to Modify GitHub Fields (Should Fail)
**Purpose**: Confirm locked GitHub fields cannot be modified

```
PUT http://localhost:5000/api/candidate/profile
Headers:
  Authorization: Bearer <TOKEN_FROM_TEST_6>
  Content-Type: application/json

{
  "about": "Updated about section",
  "github_username": "new_github_username"  ← Try to change this
}

Expected Response (403):
{
  "success": false,
  "message": "GitHub verification is locked and cannot be modified"
}

✅ Confirms: GitHub fields are immutable after lock!
```

---

### Test 9: Update Profile - Modify Allowed Fields (Should Succeed)
**Purpose**: Confirm non-GitHub fields can still be updated

```
PUT http://localhost:5000/api/candidate/profile
Headers:
  Authorization: Bearer <TOKEN_FROM_TEST_6>
  Content-Type: application/json

{
  "about": "Updated about section - this should work!",
  "skills": ["JavaScript", "Node.js", "React", "Python"]
}

Expected Response (200):
{
  "success": true,
  "message": "Candidate profile updated successfully",
  "data": {
    "about": "Updated about section - this should work!",
    "skills": ["JavaScript", "Node.js", "React", "Python"],
    "github_verified": true,
    "github_verification_locked": true
  }
}

✅ Confirms: Non-GitHub fields can still be updated!
```

---

### Test 10: Upload Resume - Without GitHub Verification (Should Fail)
**Purpose**: Simulate user without GitHub verification

```
First, create a new user WITHOUT GitHub OAuth:
1. Run Test 1 (Register) with new email
2. Run Test 2 (Login) - don't do OAuth
3. Run Test 4 (Create Profile) without Github

Then test upload:

POST http://localhost:5000/api/candidate/resume
Headers:
  Authorization: Bearer <TOKEN_WITHOUT_GITHUB>
Content-Type: multipart/form-data

Form Data:
  file: <sample.pdf or sample.docx>

Expected Response (403):
{
  "success": false,
  "message": "GitHub account not verified. Please authenticate with GitHub first.",
  "help": "Use /api/auth/github to authenticate, then POST /api/candidate/github/verify"
}

✅ Confirms: GitHub verification is required!
```

---

### Test 11: Upload Resume - Without GitHub Lock (Should Fail)
**Purpose**: Simulate user with OAuth but no lock

```
Create scenario:
1. Complete OAuth so user.github_verified = true
2. Do NOT call POST /api/candidate/github/verify (so no lock)
3. Create candidate profile via Test 4

Then test upload:

POST http://localhost:5000/api/candidate/resume
Headers:
  Authorization: Bearer <TOKEN_WITH_GITHUB_NOT_LOCKED>
Content-Type: multipart/form-data

Form Data:
  file: <sample.pdf or sample.docx>

Expected Response (403):
{
  "success": false,
  "message": "GitHub verification not locked. Please complete verification first.",
  "help": "Visit POST /api/candidate/github/verify to lock GitHub verification"
}

✅ Confirms: GitHub lock is required before resume upload!
```

---

### Test 12: Upload Resume - With GitHub Lock (Should Succeed)
**Purpose**: Complete resume upload with full verification

```
Prerequisites:
- User created and logged in (Test 1-2)
- GitHub OAuth completed (Test 5)
- GitHub verified and locked (Test 6)
- Candidate profile created (Test 4)

Then test upload:

POST http://localhost:5000/api/candidate/resume
Headers:
  Authorization: Bearer <TOKEN_WITH_GITHUB_LOCKED>
Content-Type: multipart/form-data

Form Data:
  file: <sample.pdf or sample.docx>

Expected Response (200):
{
  "success": true,
  "message": "Resume scored successfully",
  "data": {
    "final_score": 78,
    "detected_role": "Backend",
    "dimension_scores": {
      "technical_skills": 85,
      "experience_level": 72,
      "project_complexity": 80,
      "communication": 65,
      ...
    },
    "skills_detected": ["Node.js", "JavaScript", "MongoDB", ...],
    "keywords_matched": 45,
    "keywords_total": 120,
    "ats_match_percentage": 37.5,
    "detected_years_experience": 5,
    "github_verified_at": "2024-04-20T10:35:00.000Z",
    "github_verification_locked": true
  }
}

✅ Confirms: Resume scoring works with GitHub lock!
```

---

### Test 13: Get Resume Score
**Purpose**: Retrieve previously scored resume

```
GET http://localhost:5000/api/candidate/resume-score
Headers:
  Authorization: Bearer <TOKEN_FROM_TEST_12>

Expected Response (200):
{
  "success": true,
  "data": {
    "_id": "...",
    "user_id": "...",
    "final_score": 78,
    "detected_role": "Backend",
    "dimension_scores": { ... },
    "skills_detected": [ ... ],
    ...
  }
}

✅ Confirms: Score retrieval works!
```

---

## Test Execution Order

1. ✅ Test 1: Register user
2. ✅ Test 2: Login & get token
3. ✅ Test 3: Verify token works
4. ✅ Test 4: Create candidate profile
5. ⚠️ Test 5: Complete OAuth manually in browser
6. ✅ Test 6: First verify call (should succeed)
7. ✅ Test 7: Second verify call (should fail) ← KEY TEST
8. ✅ Test 8: Try to modify GitHub fields (should fail) ← KEY TEST
9. ✅ Test 9: Modify non-GitHub fields (should succeed)
10. ⚠️ Test 10: Test without GitHub (need separate user)
11. ⚠️ Test 11: Test without lock (tricky to set up manually)
12. ✅ Test 12: Complete resume upload (should succeed)
13. ✅ Test 13: Retrieve score

---

## Key Validation Points

### ✅ GitHub Verification Is Locked
- Test 6 succeeds
- Test 7 returns 403 (prevents re-verify)

### ✅ GitHub Fields Are Immutable
- Test 8 returns 403 (prevents modification)
- Test 9 succeeds (non-GitHub fields can change)

### ✅ Resume Requires GitHub Lock
- Test 10 returns 403 (no GitHub)
- Test 11 returns 403 (no lock)
- Test 12 returns 200 (with lock)

### ✅ Three-Tier Validation Works
- Tier 1: Profile must exist
- Tier 2: GitHub verified must be true
- Tier 3: GitHub lock must be true

### ✅ BE-1 Unaffected
- Test 1 works (registration)
- Test 2 works (login)
- Test 3 works (token verification)
- OAuth flow works (Test 5)

---

## Sample Test Files

### sample.txt (for testing)
```
JOHN DOE
Senior Software Engineer
john@example.com | GitHub: github.com/johndoe | +1-234-567-8900

EXPERIENCE:
- Led backend development using Node.js and MongoDB
- Designed and implemented microservices architecture
- Optimized database queries improving performance by 40%
- Mentored junior developers

SKILLS:
Node.js, JavaScript, React, MongoDB, PostgreSQL, Docker, Kubernetes,
AWS, REST APIs, GraphQL, Microservices, CI/CD

EDUCATION:
B.S. Computer Science, State University (2018)
```

---

## Error Response Reference

### 403 - GitHub Not Verified
```json
{
  "success": false,
  "message": "GitHub account not verified. Please authenticate with GitHub first.",
  "help": "Use /api/auth/github to authenticate, then POST /api/candidate/github/verify"
}
```

### 403 - Already Locked
```json
{
  "success": false,
  "message": "GitHub verification already completed and locked. Cannot re-verify.",
  "data": {
    "github_verified": true,
    "locked": true
  }
}
```

### 403 - Not Locked
```json
{
  "success": false,
  "message": "GitHub verification not locked. Please complete verification first.",
  "help": "Visit POST /api/candidate/github/verify to lock GitHub verification"
}
```

### 403 - Fields Locked
```json
{
  "success": false,
  "message": "GitHub verification is locked and cannot be modified"
}
```

---

## Quick Postman Setup

1. Create Postman Collection "GitHub OAuth Tests"
2. Add environment variable: `token` = (auto-set from login response)
3. Add environment variable: `base_url` = `http://localhost:5000`
4. Create requests for each test above
5. Use `{{base_url}}` and `{{token}}` in requests

**Example Request**:
```
POST {{base_url}}/api/candidate/github/verify
Headers:
  Authorization: Bearer {{token}}
```

---

## Troubleshooting

### Server Not Starting
```
Check: MongoDB connection in .env
Error: "ECONNREFUSED"
Fix: Ensure MongoDB credentials are correct in .env
```

### OAuth Fails
```
Check: GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env
Check: GITHUB_CALLBACK_URL matches GitHub app settings
```

### Token Invalid
```
Check: Token expiration (default 7 days)
Fix: Get new token via /api/auth/login
```

### Resume Upload Fails
```
Check all three validation tiers:
1. candidate.profile exists?
2. candidate.github_verified === true?
3. candidate.github_verification_locked === true?
```

---

## Success Criteria

All tests pass when:
- ✅ Test 1-4 create user and profile
- ✅ Test 5 completes OAuth
- ✅ Test 6 locks verification
- ✅ Test 7 prevents re-lock (403)
- ✅ Test 8 prevents field modification (403)
- ✅ Test 9 allows other field updates
- ✅ Test 10 requires GitHub
- ✅ Test 12 accepts resume with lock
- ✅ Test 13 retrieves score

**GitHub verification is LOCKED and working correctly! 🔒**
