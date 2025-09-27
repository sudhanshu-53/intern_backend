'use strict';

/**
 * Enhanced PM Internship Portal
 * A class representing the internship portal application with user management,
 * internship browsing, and application features.
 */
class PMInternshipPortal {
    constructor() {
        // API Configuration
        this.apiBaseUrl = 'http://localhost:3000/api';
        
        // User State
        this.currentLanguage = 'en';
        this.currentUser = null;
        this.isLoggedIn = false;
        this.userType = null; // 'student' or 'admin'
        this.token = localStorage.getItem('token');
        
        // UI State
        this.profileWizardStep = 1;
        this.voices = [];
        this.offlineMode = false;
        this.ttsSupported = false;
        this.currentSpeech = null;
        this.isReading = false;
        this.pendingApplication = null;
        
        // User Profile
        this.userProfile = {
            name: '',
            email: '',
            phone: '',
            education: null,
            score10th: '',
            score12th: '',
            scoreHigher: '',
            skills: [],
            interests: [],
            preferredLocations: [],
            cvFile: null,
            cvFileName: null,
            cvFileSize: null,
            hasCompletedOnboarding: false,
            homeDistrict: 'Jaipur',
            homeState: 'Rajasthan'
        };

        // Data Collections
        this.internshipsData = [];
        this.recommendations = [];
        this.applications = [];
        this.bookmarks = [];
        this.dismissedRecommendations = [];

        // API methods
        this.api = {
            async request(endpoint, options = {}) {
                const token = localStorage.getItem('token');
                const headers = {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                    ...options.headers
                };

                try {
                    const response = await fetch(`${this.parent.apiBaseUrl}${endpoint}`, {
                        ...options,
                        headers
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'API request failed');
                    }

                    return await response.json();
                } catch (error) {
                    console.error('API Error:', error);
                    throw error;
                }
            },

            // Auth endpoints
            async login(email, password) {
                return this.request('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });
            },

            async register(userData) {
                return this.request('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify(userData)
                });
            },

            // Internships endpoints
            async getInternships() {
                return this.request('/internships');
            },

            async getRecommendations() {
                return this.request('/recommendations');
            },

            // Profile endpoints
            async getProfile() {
                return this.request('/profile');
            },

            async updateProfile(profileData) {
                return this.request('/profile', {
                    method: 'PUT',
                    body: JSON.stringify(profileData)
                });
            },

            // Application endpoints
            async applyForInternship(internshipId) {
                return this.request('/applications', {
                    method: 'POST',
                    body: JSON.stringify({ internship_id: internshipId })
                });
            },

            async getApplications() {
                return this.request('/applications');
            },

            // Bookmark endpoints
            async toggleBookmark(internshipId) {
                return this.request('/bookmarks', {
                    method: 'POST',
                    body: JSON.stringify({ internship_id: internshipId })
                });
            },

            async getBookmarks() {
                return this.request('/bookmarks');
            },

            // Chat endpoint
            async sendChatMessage(userQuery) {
                return this.request('/chat', {
                    method: 'POST',
                    body: JSON.stringify({ userQuery })
                });
            }
        };

        // Set parent reference for API methods
        this.api.parent = this;

        // Reference Data for Recommendations
        this.relatedSkills = {
            "Programming": ["Python", "Java", "C++"],
            "Web Development": ["HTML", "CSS", "JavaScript", "React"],
            "Data": ["SQL", "Data Analysis", "MS Excel", "Data Collection"],
            "Communication": ["Communication Skills", "Content Writing", "Report Writing", "Presentation Skills"],
            "Marketing": ["Social Media Marketing", "SEO"]
        };
        
        this.relatedInterests = {
            "Technology": ["Web Development", "Cybersecurity", "Data Analysis"],
            "Governance": ["Policy", "Law", "Rural Development"],
            "Business": ["Finance", "Marketing", "Event Management"],
            "Creative": ["Design", "Writing", "Photography", "Video Editing", "Media"]
        };
        
        // Location and Education Reference Data
        this.locationData = {
            "Rajasthan": {
                "Jaipur": ["Sikar", "Nagaur", "Ajmer", "Tonk", "Dausa", "Alwar"]
            }
        };
        
        this.educationHierarchy = {
            "10th": 1,
            "12th": 2,
            "diploma": 3,
            "graduate": 4,
            "postgraduate": 5
        };
    }

    /**
     * Initialize the portal application
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', async () => await this.setupApplication());
        } else {
            this.setupApplication();
        }
    }

    /**
     * Set up the application and check authentication state
     */
    async setupApplication() {
        // Check for stored token and try to load user profile
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const profile = await this.api.getProfile();
                this.isLoggedIn = true;
                this.userProfile = profile;
                this.userType = profile.role;
                await this.loadUserData();
            } catch (error) {
                console.error('Failed to load profile:', error);
                localStorage.removeItem('token');
            }
        }

        this.setupEventListeners();
        this.setupTTS();
        this.setupOfflineSupport();
        this.updateLanguageElements();
        this.setupAdminStyles();
        
        // Show appropriate page based on login status
        if (this.isLoggedIn) {
            this.showDashboard();
        } else {
            this.showLoginPage();
        }
    }

    /**
     * Load user-specific data from the backend
     */
    async loadUserData() {
        try {
            // Load internships
            this.internshipsData = await this.api.getInternships();

            if (this.userType === 'student') {
                // Load recommendations, applications, and bookmarks for students
                const [recommendations, applications, bookmarks] = await Promise.all([
                    this.api.getRecommendations(),
                    this.api.getApplications(),
                    this.api.getBookmarks()
                ]);

                this.recommendations = recommendations;
                this.applications = applications;
                this.bookmarks = bookmarks.map(b => b.internship_id);
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
            this.showToast('error', 'Failed to load some data. Please try again later.');
        }
    }

    // ... rest of the class methods remain unchanged
}

// Initialize the portal application
const initializePortal = () => {
    window.portal = new PMInternshipPortal();
    window.portal.init();
};

// Check if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortal);
} else {
    initializePortal();
}