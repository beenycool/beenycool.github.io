(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[520],{

/***/ 2114:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 55773));


/***/ }),

/***/ 55773:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(95155);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12115);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(35695);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6874);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(23464);
/* harmony import */ var _hooks_useAnalytics__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(66524);
/* __next_internal_client_entry_do_not_use__ default auto */ 





// Create a wrapper component to handle useSearchParams
const LoginContent = ()=>{
    const [isLogin, setIsLogin] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [formData, setFormData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        username: '',
        password: '',
        email: ''
    });
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [success, setSuccess] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    const searchParams = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.useSearchParams)();
    const redirect = searchParams.get('redirect') || '/';
    const analytics = (0,_hooks_useAnalytics__WEBPACK_IMPORTED_MODULE_4__/* .useAnalytics */ .s)();
    // API base URL - updated to handle GitHub Pages deployment
    const API_URL = (()=>{
        if (true) {
            // Check if we're in a GitHub Pages environment
            const isGitHubPages = window.location.hostname.includes('github.io');
            if (isGitHubPages) {
                // Use the Render backend URL for GitHub Pages
                return 'https://beenycool-github-io.onrender.com/api';
            }
        }
        // For local development or other environments, use the environment variable or default
        return "https://beenycool-github-io.onrender.com" || 0;
    })();
    // Track page view
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        analytics.trackPageView('login_page');
    }, [
        analytics
    ]);
    // Check if already logged in
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const token = localStorage.getItem('authToken');
        if (token) {
            router.push(redirect);
        }
    }, [
        router,
        redirect
    ]);
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: value
            }));
        // Clear error when user types
        if (error) setError(null);
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            // Validate form
            if (!formData.username || !formData.password) {
                setError('Username and password are required');
                setLoading(false);
                return;
            }
            if (!isLogin && !formData.email) {
                setError('Email is required for registration');
                setLoading(false);
                return;
            }
            console.log('Attempting authentication with API URL:', API_URL); // Debug log
            const endpoint = isLogin ? "".concat(API_URL, "/auth/login") : "".concat(API_URL, "/auth/register");
            // Track authentication attempt
            analytics.trackEvent(isLogin ? 'login_attempt' : 'registration_attempt', {
                username: formData.username
            });
            const response = await axios__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.post(endpoint, formData);
            // If successful, store token and redirect
            if (response.data.success) {
                var _response_data_user;
                localStorage.setItem('authToken', response.data.token);
                // Track successful authentication
                analytics.trackEvent(isLogin ? 'login_success' : 'registration_success', {
                    username: formData.username,
                    userId: (_response_data_user = response.data.user) === null || _response_data_user === void 0 ? void 0 : _response_data_user.id
                });
                // Identify the user in PostHog
                if (response.data.user) {
                    analytics.identifyUser(response.data.user.id, {
                        username: response.data.user.username,
                        role: response.data.user.role
                    });
                }
                if (isLogin) {
                    // For admin redirects, use window.location.href to force a full page reload
                    if (redirect.includes('/admin')) {
                        window.location.href = '/admin';
                    } else {
                        router.push(redirect);
                    }
                } else {
                    // For registration, show success message then redirect to login
                    setSuccess(true);
                    setIsLogin(true);
                    setFormData({
                        ...formData,
                        password: ''
                    });
                    // Clear success message after 3 seconds
                    setTimeout(()=>{
                        setSuccess(false);
                    }, 3000);
                }
            }
            setLoading(false);
        } catch (err) {
            console.error('Authentication error:', err);
            // More detailed error handling
            let errorMessage = 'An error occurred. Please try again.';
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                errorMessage = err.response.data.message || errorMessage;
                console.error('Error response:', err.response.data);
            } else if (err.request) {
                // The request was made but no response was received
                errorMessage = 'No response from server. Please try again later.';
                console.error('No response received:', err.request);
            }
            // Track authentication failure
            analytics.trackEvent(isLogin ? 'login_failure' : 'registration_failure', {
                username: formData.username,
                error: errorMessage
            });
            setError(errorMessage);
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: "min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", {
                            className: "mt-6 text-center text-3xl font-extrabold text-gray-900",
                            children: isLogin ? 'Sign in to your account' : 'Create a new account'
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                            className: "mt-2 text-center text-sm text-gray-600",
                            children: isLogin ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                                children: [
                                    "Or",
                                    ' ',
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                        className: "font-medium text-blue-600 hover:text-blue-500",
                                        onClick: ()=>setIsLogin(false),
                                        children: "create a new account"
                                    })
                                ]
                            }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                                children: [
                                    "Already have an account?",
                                    ' ',
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                        className: "font-medium text-blue-600 hover:text-blue-500",
                                        onClick: ()=>setIsLogin(true),
                                        children: "Sign in"
                                    })
                                ]
                            })
                        })
                    ]
                }),
                success && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                    className: "rounded-md bg-green-50 p-4",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "flex",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                className: "flex-shrink-0",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", {
                                    className: "h-5 w-5 text-green-400",
                                    viewBox: "0 0 20 20",
                                    fill: "currentColor",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
                                        fillRule: "evenodd",
                                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                                        clipRule: "evenodd"
                                    })
                                })
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                className: "ml-3",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                    className: "text-sm font-medium text-green-800",
                                    children: "Registration successful! You can now log in."
                                })
                            })
                        ]
                    })
                }),
                error && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                    className: "rounded-md bg-red-50 p-4",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "flex",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                className: "flex-shrink-0",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", {
                                    className: "h-5 w-5 text-red-400",
                                    viewBox: "0 0 20 20",
                                    fill: "currentColor",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
                                        fillRule: "evenodd",
                                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                                        clipRule: "evenodd"
                                    })
                                })
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                className: "ml-3",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                    className: "text-sm font-medium text-red-800",
                                    children: error
                                })
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", {
                    className: "mt-8 space-y-6",
                    onSubmit: handleSubmit,
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "rounded-md shadow-sm -space-y-px",
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    children: [
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", {
                                            htmlFor: "username",
                                            className: "sr-only",
                                            children: "Username"
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
                                            id: "username",
                                            name: "username",
                                            type: "text",
                                            autoComplete: "username",
                                            required: true,
                                            className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm",
                                            placeholder: "Username",
                                            value: formData.username,
                                            onChange: handleChange
                                        })
                                    ]
                                }),
                                !isLogin && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    children: [
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", {
                                            htmlFor: "email",
                                            className: "sr-only",
                                            children: "Email"
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
                                            id: "email",
                                            name: "email",
                                            type: "email",
                                            autoComplete: "email",
                                            required: !isLogin,
                                            className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm",
                                            placeholder: "Email address",
                                            value: formData.email,
                                            onChange: handleChange
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    children: [
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", {
                                            htmlFor: "password",
                                            className: "sr-only",
                                            children: "Password"
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
                                            id: "password",
                                            name: "password",
                                            type: "password",
                                            autoComplete: isLogin ? "current-password" : "new-password",
                                            required: true,
                                            className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ".concat(isLogin ? 'rounded-b-md' : '', " focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"),
                                            placeholder: "Password",
                                            value: formData.password,
                                            onChange: handleChange
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                type: "submit",
                                disabled: loading,
                                className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ".concat(loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700', " focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"),
                                children: [
                                    loading ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                        className: "absolute left-0 inset-y-0 flex items-center pl-3",
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
                                            className: "animate-spin h-5 w-5 text-white",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            children: [
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
                                                    className: "opacity-25",
                                                    cx: "12",
                                                    cy: "12",
                                                    r: "10",
                                                    stroke: "currentColor",
                                                    strokeWidth: "4"
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
                                                    className: "opacity-75",
                                                    fill: "currentColor",
                                                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                })
                                            ]
                                        })
                                    }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                        className: "absolute left-0 inset-y-0 flex items-center pl-3",
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", {
                                            className: "h-5 w-5 text-blue-500 group-hover:text-blue-400",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            viewBox: "0 0 20 20",
                                            fill: "currentColor",
                                            "aria-hidden": "true",
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
                                                fillRule: "evenodd",
                                                d: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z",
                                                clipRule: "evenodd"
                                            })
                                        })
                                    }),
                                    isLogin ? loading ? 'Signing in...' : 'Sign in' : loading ? 'Creating account...' : 'Create account'
                                ]
                            })
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                    className: "text-sm",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
                                        href: "/",
                                        className: "font-medium text-blue-600 hover:text-blue-500",
                                        children: "Back to home"
                                    })
                                }),
                                isLogin && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                    className: "text-sm",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
                                        href: "/forgot-password",
                                        className: "font-medium text-blue-600 hover:text-blue-500",
                                        children: "Forgot your password?"
                                    })
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    });
};
// Loading fallback for Suspense
const LoginFallback = ()=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: "min-h-screen flex items-center justify-center bg-gray-100",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "text-center",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                    className: "animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full",
                    role: "status",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                        className: "sr-only",
                        children: "Loading..."
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                    className: "mt-2 text-gray-600",
                    children: "Loading..."
                })
            ]
        })
    });
// Main component with Suspense
const LoginPage = ()=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react__WEBPACK_IMPORTED_MODULE_1__.Suspense, {
        fallback: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(LoginFallback, {}),
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(LoginContent, {})
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LoginPage);


/***/ }),

/***/ 66524:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   s: () => (/* binding */ useAnalytics)
/* harmony export */ });
/* __next_internal_client_entry_do_not_use__ useAnalytics auto */ // import { usePostHog } from 'posthog-js/react'; // Commented out
function useAnalytics() {
    // const posthog = usePostHog(); // Commented out
    return {
        /**
     * Track an event
     * @param {string} eventName - Name of the event
     * @param {Object} properties - Additional properties to track
     */ trackEvent: function(eventName) {
            let properties = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            // if (posthog) { // Commented out
            //   posthog.capture(eventName, properties);
            // }
            console.log('Analytics (PostHog removed): trackEvent', eventName, properties);
        },
        /**
     * Identify a user
     * @param {string} userId - User ID
     * @param {Object} properties - User properties
     */ identifyUser: function(userId) {
            let properties = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            // if (posthog && userId) { // Commented out
            //   posthog.identify(userId, properties);
            // }
            console.log('Analytics (PostHog removed): identifyUser', userId, properties);
        },
        /**
     * Reset the user identity (for logout)
     */ resetUser: ()=>{
            // if (posthog) { // Commented out
            //   posthog.reset();
            // }
            console.log('Analytics (PostHog removed): resetUser');
        },
        /**
     * Track a page view
     * @param {string} pageName - Name of the page
     * @param {Object} properties - Additional properties
     */ trackPageView: function(pageName) {
            let properties = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            // if (posthog) { // Commented out
            //   posthog.capture('$pageview', {
            //     page_name: pageName,
            //     ...properties
            //   });
            // }
            console.log('Analytics (PostHog removed): trackPageView', pageName, properties);
        },
        /**
     * Enable or disable tracking
     * @param {boolean} enabled - Whether tracking should be enabled
     */ setTracking: (enabled)=>{
            // if (posthog) { // Commented out
            //   if (enabled) {
            //     posthog.opt_in_capturing();
            //   } else {
            //     posthog.opt_out_capturing();
            //   }
            // }
            console.log('Analytics (PostHog removed): setTracking', enabled);
        }
    };
}


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, [874,794,315,358], () => (__webpack_exec__(2114)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);