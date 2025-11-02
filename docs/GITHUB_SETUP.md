# GitHub Repository Setup Instructions

## 📋 Quick Setup Steps

### 1. Create Repository on GitHub

1. Go to: **https://github.com/new**
2. Fill in:
   - **Repository name**: `classrooms`
   - **Description** (optional): `AI Telugu Summarization App`
   - **Visibility**: Choose Public or Private
   - **⚠️ DO NOT** check:
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license
3. Click **"Create repository"**

### 2. Get HTTPS URL

After creating, GitHub will show you:
```
Quick setup — if you've done this kind of thing before
https://github.com/YOUR_USERNAME/classrooms.git
```

**Copy this HTTPS URL!**

### 3. Connect Local Repository

Run these commands (replace `YOUR_USERNAME` with your actual GitHub username):

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/classrooms.git

# Verify remote is added
git remote -v

# Push code to GitHub
git push -u origin main
```

### 4. Verify on GitHub

1. Go to: `https://github.com/YOUR_USERNAME/classrooms`
2. You should see all your files!

## 🔄 If Repository Already Exists on GitHub

If you already created the repository and it has a README:

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/classrooms.git

# Pull first (to merge with existing README if any)
git pull origin main --allow-unrelated-histories

# Then push
git push -u origin main
```

## ✅ Verification Commands

```bash
# Check remote connection
git remote -v

# Check branch
git branch

# Check status
git status

# View commit history
git log --oneline
```

## 🚀 After GitHub Setup

Once pushed to GitHub, you can:
1. Deploy to Render (connect GitHub repo)
2. Share with team
3. Track changes
4. Set up CI/CD

## 📝 Example Full Commands

Replace `YOUR_USERNAME` with your GitHub username:

```bash
# Step 1: Add remote (already done if you followed above)
git remote add origin https://github.com/YOUR_USERNAME/classrooms.git

# Step 2: Verify
git remote -v
# Should show:
# origin  https://github.com/YOUR_USERNAME/classrooms.git (fetch)
# origin  https://github.com/YOUR_USERNAME/classrooms.git (push)

# Step 3: Push to GitHub
git push -u origin main
```

## 🆘 Troubleshooting

### "remote origin already exists"
```bash
# Remove existing remote
git remote remove origin

# Add again
git remote add origin https://github.com/YOUR_USERNAME/classrooms.git
```

### "Authentication failed"
- Make sure you're logged into GitHub
- Use GitHub Personal Access Token instead of password
- Or use SSH: `git@github.com:YOUR_USERNAME/classrooms.git`

### "Repository not found"
- Verify repository name is correct
- Check you have access (if private repo)
- Verify GitHub username is correct

---

**After setup, your code will be on GitHub and ready for Render deployment!** 🎉

