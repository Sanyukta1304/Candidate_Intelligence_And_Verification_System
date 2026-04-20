# GitHub OAuth Verification Flow - BE-3

## Overview
GitHub verification is a one-time, locked security process that ensures candidates have a valid GitHub account. Once verified through OAuth, the status is locked and cannot be re-verified or modified.

## Architecture

### Three-Layer Verification System

#### Layer 1: User Model (BE-1)
**File**: `models/User.js`
- `githubId`: Unique GitHub ID (immutable, indexed)
- `github_access_token`: OAuth access token for GitHub API calls
- `github_verified`: Boolean flag set during OAuth callback (set to `true`)
- `github_verified_at`: Timestamp of OAuth completion
- `githubProfile`: Profile data from GitHub (name, avatar, bio)

**Set By**: Passport GitHub Strategy in `config/passport.js`
**How**: During `/api/auth/github/callback`, after OAuth succeeds
**Can Be Changed**: NO - Only set once during initial OAuth authentication

#### Layer 2: Candidate Model (BE-3)
**File**: `models/Candidate.js`
- `github_username`: GitHub username from OAuth
- `github_access_token`: Mirrored from User model
- `github_verified`: Boolean flag (mirrors User model)
- `github_verified_at`: Timestamp of verification lock
- `github_verification_locked`: Boolean flag preventing re-verification

**Set By**: `POST /api/candidate/github/verify` endpoint
**How**: One-time call after OAuth completes
**Can Be Changed**: NO - Once `github_verification_locked = true`, cannot be modified

#### Layer 3: Resume Upload Gate (BE-3)
**File**: `controllers/candidate.controller.js`
- `uploadResume()` endpoint checks:
  1. Candidate profile exists
  2. `github_verified == true`
  3. `github_verification_locked == true`

**Purpose**: Prevent resume upload unless ALL THREE conditions are met

## Complete Verification Flow

### Step 1: GitHub OAuth Authentication (BE-1)
```
User Flow:
1. User clicks "Login with GitHub" on frontend
2. Frontend redirects to: GET /api/auth/github
3. Server redirects to GitHub OAuth URL
4. User grants permissions on GitHub
5. GitHub redirects back to: GET /api/auth/github/callback?code=...&state=...
```

**What Happens Backend**:
```javascript
// In config/passport.js - GitHubStrategy
1. Verify code with GitHub API
2. Exchange code for access token
3. Fetch user profile from GitHub
4. Check if User exists in DB
   - If exists: Update github_access_token, github_verified=true
   - If not exists: Create new User with github_verified=true
5. Return JWT token
6. Redirect to frontend with token
```

**User Model State After Step 1**:
```javascript
{
  _id: ObjectId(...),
  username: "john_doe",
  email: "john@example.com",
  githubId: "12345678",                    // ✅ Set by OAuth
  github_access_token: "ghu_abc123...",   // ✅ Set by OAuth
  github_verified: true,                   // ✅ Set by OAuth
  github_verified_at: 2024-04-20T10:30Z,  // ✅ Set by OAuth
  githubProfile: {
    name: "John Doe",
    avatar_url: "https://...",
    bio: "Software Engineer"
  },
  role: "candidate",
  createdAt: 2024-04-20T10:25Z,
  updatedAt: 2024-04-20T10:30Z
}
```

### Step 2: Candidate Profile Creation & GitHub Lock (BE-3)
```
User Flow:
1. User is logged in with JWT token
2. User calls: POST /api/candidate/github/verify
3. Backend verifies GitHub OAuth was completed
4. Backend creates/updates Candidate and locks GitHub
5. GitHub verification is now FROZEN
```

**What Happens Backend**:
```javascript
// In controllers/candidate.controller.js - verifyGithub()
1. Check user.github_verified == true (from OAuth)
2. Check user.github_access_token exists (from OAuth)
   - If not: Return 403 "GitHub OAuth not completed"
3. Find or create Candidate record
4. If Candidate exists and github_verification_locked == true:
   - Return 403 "GitHub verification already locked. Cannot re-verify."
5. Otherwise:
   - Set github_verified = true
   - Set github_verification_locked = true
   - Save Candidate
6. Return 200 with verification status
```

**Candidate Model State After Step 2**:
```javascript
{
  _id: ObjectId(...),
  user_id: ObjectId(...),  // References User._id
  github_username: "john_doe",           // ✅ From OAuth
  github_access_token: "ghu_abc123...",  // ✅ From OAuth
  github_verified: true,                 // ✅ LOCKED HERE
  github_verified_at: 2024-04-20T10:35Z, // ✅ Lock timestamp
  github_verification_locked: true,      // ✅ PERMANENT LOCK
  education: { degree: "...", ... },
  about: "...",
  skills: [],
  resume_text: null,
  resume_score: 0,
  createdAt: 2024-04-20T10:35Z,
  updatedAt: 2024-04-20T10:35Z
}
```

### Step 3: Resume Upload (BE-3)
```
User Flow:
1. User calls: POST /api/candidate/resume (with PDF/DOCX file)
2. Backend checks GitHub lock status
3. If locked: Allow resume upload and ATS scoring
4. If not locked: Return 403 "GitHub verification not locked"
```

**What Happens Backend**:
```javascript
// In controllers/candidate.controller.js - uploadResume()
1. Check candidate exists
   - If not: Return 403 "Candidate profile not found"
2. Check candidate.github_verified == true
   - If false: Return 403 "GitHub not verified"
3. Check candidate.github_verification_locked == true
   - If false: Return 403 "GitHub verification not locked"
4. If all checks pass:
   - Score resume with ATS engine
   - Save ResumeScore
   - Update Candidate with resume_score, resume_text
   - Clean up uploaded file
   - Return score results
```

## API Endpoints

### 1. GitHub OAuth Login (BE-1)
```
GET /api/auth/github
- No parameters needed
- User is redirected to GitHub
- Automatic redirect to callback after OAuth
```

### 2. GitHub OAuth Callback (BE-1, Automatic)
```
GET /api/auth/github/callback?code=...&state=...
- Automatic redirect from GitHub
- Backend processes OAuth
- Redirects to frontend with token:
  ${CLIENT_URL}/auth/github/callback?token=JWT_TOKEN&userId=USER_ID
```

### 3. Verify GitHub & Lock (BE-3, Manual)
```
POST /api/candidate/github/verify
Headers:
  Authorization: Bearer <JWT_TOKEN>
  
Response 200 (Success):
{
  "success": true,
  "message": "GitHub verified and locked successfully",
  "data": {
    "github_verified": true,
    "github_username": "john_doe",
    "github_verified_at": "2024-04-20T10:35:00.000Z",
    "locked": true
  }
}

Response 403 (OAuth Not Completed):
{
  "success": false,
  "message": "GitHub OAuth not completed. Please authenticate with GitHub first.",
  "help": "Use /api/auth/github to authenticate with your GitHub account"
}

Response 403 (Already Locked):
{
  "success": false,
  "message": "GitHub verification already completed and locked. Cannot re-verify.",
  "data": {
    "github_verified": true,
    "github_verified_at": "2024-04-20T10:35:00.000Z",
    "locked": true
  }
}
```

### 4. Upload Resume (BE-3)
```
POST /api/candidate/resume
Headers:
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: multipart/form-data
Body:
  file: <PDF or DOCX file>

Response 200 (Success):
{
  "success": true,
  "message": "Resume scored successfully",
  "data": {
    "final_score": 78,
    "detected_role": "Backend",
    "dimension_scores": { ... },
    "skills_detected": [ ... ],
    ...
  }
}

Response 403 (GitHub Not Verified):
{
  "success": false,
  "message": "GitHub account not verified. Please authenticate with GitHub first.",
  "help": "Use /api/auth/github to authenticate, then POST /api/candidate/github/verify"
}

Response 403 (GitHub Not Locked):
{
  "success": false,
  "message": "GitHub verification not locked. Please complete verification first.",
  "help": "Visit POST /api/candidate/github/verify to lock GitHub verification"
}
```

## Security Features

### 1. Three-Layer Locking
- **Layer 1 (OAuth)**: Cannot re-authenticate with GitHub (handled by passport session)
- **Layer 2 (Candidate Lock)**: `github_verification_locked` flag prevents re-verification
- **Layer 3 (Resume Gate)**: Resume upload requires all verification flags set

### 2. Immutable Fields After Lock
Once `github_verification_locked = true`:
- ✅ `github_verified` cannot be changed via updateProfile
- ✅ `github_username` cannot be changed via updateProfile
- ✅ `github_access_token` cannot be changed via updateProfile
- ✅ `github_verification_locked` cannot be changed via updateProfile
- ✅ Cannot call verifyGithub again (returns 403)

**Protection Code**:
```javascript
// In updateProfile()
if (candidate && candidate.github_verification_locked) {
  if (req.body.github_verified !== undefined || 
      req.body.github_username !== undefined || 
      req.body.github_access_token !== undefined ||
      req.body.github_verification_locked !== undefined) {
    return res.status(403).json({
      success: false,
      message: 'GitHub verification is locked and cannot be modified'
    });
  }
}
```

### 3. Resume Upload Validation
Three checks in sequence:
```javascript
1. if (!candidate) 
   → Return 403 "Candidate profile not found"
   
2. if (!candidate.github_verified) 
   → Return 403 "GitHub account not verified"
   
3. if (!candidate.github_verification_locked) 
   → Return 403 "GitHub verification not locked"
```

## BE-1 Compatibility

✅ **No Breaking Changes**:
- BE-1 User model unchanged
- BE-1 Passport config unchanged
- BE-1 OAuth routes unchanged
- BE-1 JWT generation unchanged
- All BE-1 authentication tests pass

✅ **New BE-3 Fields**:
- Candidate model gets github_verification_locked
- Candidate model gets github_verified_at
- These are BE-3 specific and don't affect BE-1

## Failure Scenarios

### Scenario 1: User skips OAuth
```
Attempt: POST /api/candidate/github/verify
Result: 403 "GitHub OAuth not completed"
Fix: User must complete /api/auth/github first
```

### Scenario 2: User tries to verify twice
```
Step 1: POST /api/candidate/github/verify → 200 OK (first time)
Step 2: POST /api/candidate/github/verify → 403 "Already locked"
```

### Scenario 3: User tries to upload resume before verification
```
Attempt: POST /api/candidate/resume (without github_verification_locked=true)
Result: 403 "GitHub verification not locked"
Fix: User must call POST /api/candidate/github/verify first
```

### Scenario 4: User tries to modify GitHub fields
```
Attempt: PUT /api/candidate/profile with github_verified=false
Result: 403 "GitHub verification is locked and cannot be modified"
Fix: Fields are locked, cannot be changed
```

## Testing Checklist

- [x] GitHub OAuth redirects correctly
- [x] POST /api/candidate/github/verify accepts first call
- [x] POST /api/candidate/github/verify rejects second call (locked)
- [x] Resume upload fails if github_verification_locked=false
- [x] Resume upload succeeds if github_verification_locked=true
- [x] updateProfile rejects GitHub field changes when locked
- [x] No BE-1 functionality disrupted
- [x] Candidate profile creates/updates correctly
- [x] File cleanup on resume upload errors
- [x] All error messages include helpful guidance

## Database Schema Reference

### User.js (BE-1)
```javascript
githubId: String (unique, sparse)
github_access_token: String
github_verified: Boolean (default: false)
github_verified_at: Date (default: null)
githubProfile: Object
```

### Candidate.js (BE-3)
```javascript
github_username: String
github_access_token: String
github_verified: Boolean (default: false)
github_verified_at: Date (default: null)
github_verification_locked: Boolean (default: false) ← NEW
```

## Summary

**GitHub Verification is Now**:
- ✅ OAuth-based (not manual)
- ✅ One-time lockable (cannot re-verify)
- ✅ Resume upload gate (required before scoring)
- ✅ BE-1 compatible (no breaking changes)
- ✅ Secure (three-layer protection)
- ✅ User-friendly (clear error messages with guidance)
