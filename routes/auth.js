const express = require('express');
const isAuthenticated = require('../middlewares/authMiddleware'); // Middleware to check if the user is authenticated
const {
    register,
    login,
    logout,
    // getProfile,
    editProfile,
    followOrUnfollowUser,
    getUserPosts,
    bookmarkPost,
    profile,
    getBookmarkedPosts,
    getSuggestedUsers,
    getUserProfile,
    Gtefolow,
    deleteAllBookmarks,
    searchUsers,
    changePassword,
    sendOrCancelFollowRequest,
    respondToFollowRequest,
    getFollowRequests,
    followBack,
} = require('../controllers/userController'); // Ensure the path is correct

const router = express.Router();

// User Registration
router.post('/register', register);
router.get('/getfolow',isAuthenticated, Gtefolow);
router.get('/myprofile', isAuthenticated,profile);
router.put('/myprofile', express.json({ limit: '10mb' }),  isAuthenticated,profile);

// User Login
router.post('/login', login);
router.get("/search", isAuthenticated, searchUsers);
router.put("/changepass", isAuthenticated, changePassword);
router.post('/logout', isAuthenticated, logout); // Ensure logout is authenticated

// router.get('/profile/:id', isAuthenticated, getProfile); // Ensure you're passing the function

router.put('/profile/edit', isAuthenticated, editProfile); // Use PUT for editing
router.get('/userpro/:id', isAuthenticated, getUserProfile); // Use PUT for editing

// Follow
router.post('/follow-request/:id', isAuthenticated, sendOrCancelFollowRequest);
router.post('/users/follow-request/respond', isAuthenticated, respondToFollowRequest);

router.get('/users/follow-requests', isAuthenticated, getFollowRequests);
router.post('/follow/:id', isAuthenticated, followOrUnfollowUser); // Assuming follow/unfollow is a POST action
router.post("/follow-back/:userId", isAuthenticated, followBack);

// Get All Posts by User (requires authentication)
router.get('/posts/:id', isAuthenticated, getUserPosts); // Fetch user posts

// Bookmark a Post (requires authentication)
router.post('/bookmark/:postId', isAuthenticated, bookmarkPost); // Bookmark a post

// Get Bookmarked Posts (requires authentication)
router.get('/bookmarked', isAuthenticated, getBookmarkedPosts); // Get bookmarked posts

router.delete('/users/bookmarks', isAuthenticated, deleteAllBookmarks);
// Get Suggested Users for Following (requires authentication)
router.get('/suggested-users', isAuthenticated, getSuggestedUsers); // Get suggested users

module.exports = router; // Export the router
