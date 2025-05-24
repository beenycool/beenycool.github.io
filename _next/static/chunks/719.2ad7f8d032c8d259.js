"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[719],{

/***/ 2452:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AW: () => (/* binding */ initializeApiHelpers),
/* harmony export */   constructApiUrl: () => (/* binding */ constructApiUrl),
/* harmony export */   getApiBaseUrl: () => (/* binding */ getApiBaseUrl),
/* harmony export */   sC: () => (/* binding */ isGitHubPages)
/* harmony export */ });
/* unused harmony export safeApiRequest */
/* __next_internal_client_entry_do_not_use__ getApiBaseUrl,isGitHubPages,constructApiUrl,safeApiRequest,initializeApiHelpers auto */ /**
 * API helpers for handling static export GitHub Pages deployment
 */ // DEFAULT BACKEND URL - Move this to the top level
const DEFAULT_BACKEND_URL = 'https://beenycool-github-io.onrender.com';
// Get the API base URL based on environment
function getApiBaseUrl() {
    const isLocalhost =  true && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    return isLocalhost ? 'http://localhost:3000' // Local development
     : 'https://beenycool-github-io.onrender.com'; // Production URL
}
;
// Detect if we're running on GitHub Pages
const isGitHubPages = ()=>{
    return  true && (window.location.hostname.includes('github.io') || window.location.hostname === 'beenycool.github.io');
};
// Construct API URL for different environments
const constructApiUrl = (endpoint)=>{
    const API_BASE_URL = getApiBaseUrl();
    // Make sure the endpoint starts with api/ (without leading slash)
    if (!endpoint.startsWith('/api/') && !endpoint.startsWith('api/')) {
        endpoint = 'api/' + endpoint;
    } else if (endpoint.startsWith('/api/')) {
        // Remove leading slash for consistency
        endpoint = endpoint.substring(1);
    }
    // When running on GitHub Pages, redirect ALL API calls to the backend server directly
    if (isGitHubPages()) {
        // For GitHub Pages, remove the 'api/' prefix from the endpoint
        // as the backend server might not expect it
        if (endpoint.startsWith('api/')) {
            endpoint = endpoint.substring(4); // Remove 'api/' prefix
        }
        return "".concat(API_BASE_URL, "/").concat(endpoint);
    }
    // For local development or other environments, use normal construction
    return "".concat(API_BASE_URL, "/").concat(endpoint);
};
// Safe API request function that handles GitHub Pages deployment
const safeApiRequest = async function(endpoint) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    try {
        // Determine the URL
        let apiUrl;
        // Try different methods to get the API URL
        if ( true && typeof window.constructApiUrl === 'function') {
            apiUrl = window.constructApiUrl(endpoint);
        } else {
            apiUrl = constructApiUrl(endpoint);
        }
        // Make the actual request
        const response = await fetch(apiUrl, options);
        return response;
    } catch (error) {
        console.error("API request to ".concat(endpoint, " failed:"), error);
        throw error;
    }
};
// Initialize the API helpers in the global scope
const initializeApiHelpers = ()=>{
    if (true) {
        try {
            // Ensure basic objects exist first
            window.aV = window.aV || {};
            window.API_HELPERS = window.API_HELPERS || {};
            window.BACKEND_STATUS = window.BACKEND_STATUS || {
                status: 'checking'
            };
            // Set the helper functions on window
            window.constructApiUrl = constructApiUrl;
            window.isGitHubPages = isGitHubPages;
            window.API_BASE_URL = getApiBaseUrl();
            // For GitHub Pages, set up additional helpers
            if (isGitHubPages()) {
                // Set local storage flag for GitHub Pages mode
                try {
                    window.localStorage.setItem('USE_LOCAL_API', 'true');
                } catch (storageError) {
                    console.warn('Could not set localStorage item:', storageError);
                }
                // Set up backend status for GitHub Pages
                window.BACKEND_STATUS = {
                    status: 'online',
                    lastChecked: new Date().toLocaleTimeString(),
                    isGitHubPages: true,
                    usingRemoteAPI: true
                };
                console.log('GitHub Pages mode activated - API calls will be redirected to backend');
            }
            console.log("Using API URL: ".concat(getApiBaseUrl(), ", GitHub Pages: ").concat(isGitHubPages()));
            // Return success
            return true;
        } catch (error) {
            console.error('Error initializing API helpers:', error);
            // Create simple fallback helpers directly here, rather than importing them
            try {
                // Ensure basic objects exist
                window.aV = window.aV || {};
                window.API_HELPERS = window.API_HELPERS || {};
                // Only set these if they don't already exist
                if (typeof window.constructApiUrl !== 'function') {
                    window.constructApiUrl = (endpoint)=>{
                        // Simple implementation
                        const baseUrl = DEFAULT_BACKEND_URL;
                        if (!endpoint.startsWith('/') && !endpoint.startsWith('api/')) {
                            endpoint = 'api/' + endpoint;
                        } else if (endpoint.startsWith('/api/')) {
                            endpoint = endpoint.substring(1);
                        }
                        return "".concat(baseUrl, "/").concat(endpoint);
                    };
                }
                if (isGitHubPages() && (!window.BACKEND_STATUS || window.BACKEND_STATUS.status !== 'online')) {
                    window.BACKEND_STATUS = {
                        status: 'online',
                        lastChecked: new Date().toLocaleTimeString(),
                        isGitHubPages: true,
                        usingFallbacks: true
                    };
                }
                console.log('API helpers fallbacks initialized');
                return true;
            } catch (fallbackError) {
                console.error('Failed to initialize API helpers fallback:', fallbackError);
                // Last resort: ensure the basic objects exist
                if (true) {
                    window.aV = window.aV || {};
                    window.API_HELPERS = window.API_HELPERS || {};
                }
            }
            return false;
        }
    }
    return false;
};


/***/ }),

/***/ 34964:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Xi: () => (/* binding */ TabsTrigger),
/* harmony export */   av: () => (/* binding */ TabsContent),
/* harmony export */   j7: () => (/* binding */ TabsList),
/* harmony export */   tU: () => (/* binding */ Tabs)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(95155);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12115);
/* harmony import */ var _radix_ui_react_tabs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(97508);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(19433);
/* __next_internal_client_entry_do_not_use__ Tabs,TabsList,TabsTrigger,TabsContent auto */ 



const Tabs = _radix_ui_react_tabs__WEBPACK_IMPORTED_MODULE_2__/* .Root */ .bL;
const TabsList = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef((param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_tabs__WEBPACK_IMPORTED_MODULE_2__/* .List */ .B8, {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className),
        ...props
    });
});
TabsList.displayName = _radix_ui_react_tabs__WEBPACK_IMPORTED_MODULE_2__/* .List */ .B8.displayName;
const TabsTrigger = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef((param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_tabs__WEBPACK_IMPORTED_MODULE_2__/* .Trigger */ .l9, {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm", className),
        ...props
    });
});
TabsTrigger.displayName = _radix_ui_react_tabs__WEBPACK_IMPORTED_MODULE_2__/* .Trigger */ .l9.displayName;
const TabsContent = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef((param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_tabs__WEBPACK_IMPORTED_MODULE_2__/* .Content */ .UC, {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
        ...props
    });
});
TabsContent.displayName = _radix_ui_react_tabs__WEBPACK_IMPORTED_MODULE_2__/* .Content */ .UC.displayName;



/***/ }),

/***/ 53719:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ aimarker)
});

// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(95155);
// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/index.js
var react = __webpack_require__(12115);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs + 243 modules
var proxy = __webpack_require__(1978);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs + 3 modules
var AnimatePresence = __webpack_require__(60760);
// EXTERNAL MODULE: ./node_modules/react-markdown/lib/index.js + 103 modules
var lib = __webpack_require__(33239);
// EXTERNAL MODULE: ./node_modules/katex/dist/katex.min.css
var katex_min = __webpack_require__(31491);
// EXTERNAL MODULE: ./node_modules/remark-math/lib/index.js + 5 modules
var remark_math_lib = __webpack_require__(37772);
// EXTERNAL MODULE: ./node_modules/rehype-katex/lib/index.js + 11 modules
var rehype_katex_lib = __webpack_require__(29581);
// EXTERNAL MODULE: ./lib/utils.js
var utils = __webpack_require__(19433);
// EXTERNAL MODULE: ./components/ui/button.tsx
var ui_button = __webpack_require__(97168);
// EXTERNAL MODULE: ./components/ui/textarea.tsx
var ui_textarea = __webpack_require__(99474);
// EXTERNAL MODULE: ./components/ui/card.tsx
var card = __webpack_require__(88482);
// EXTERNAL MODULE: ./components/ui/select.tsx
var ui_select = __webpack_require__(95784);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/circle-check.js
var circle_check = __webpack_require__(43453);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/triangle-alert.js
var triangle_alert = __webpack_require__(1243);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/refresh-cw.js
var refresh_cw = __webpack_require__(53904);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/zap.js
var zap = __webpack_require__(71539);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/loader-circle.js
var loader_circle = __webpack_require__(51154);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/share-2.js
var share_2 = __webpack_require__(66516);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/circle-help.js
var circle_help = __webpack_require__(94788);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/x.js
var x = __webpack_require__(54416);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/chevron-right.js
var chevron_right = __webpack_require__(13052);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/pause.js
var pause = __webpack_require__(82178);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/keyboard.js
var keyboard = __webpack_require__(55133);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/upload.js
var upload = __webpack_require__(29869);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/chevron-up.js
var chevron_up = __webpack_require__(47863);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/chevron-down.js
var chevron_down = __webpack_require__(66474);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/file-plus.js
var file_plus = __webpack_require__(50773);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/external-link.js
var external_link = __webpack_require__(33786);
// EXTERNAL MODULE: ./node_modules/class-variance-authority/dist/index.mjs
var dist = __webpack_require__(74466);
;// ./components/ui/alert.tsx




const alertVariants = (0,dist/* cva */.F)("relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current", {
    variants: {
        variant: {
            default: "bg-card text-card-foreground",
            destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Alert(param) {
    let { className, variant, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        "data-slot": "alert",
        role: "alert",
        className: (0,utils.cn)(alertVariants({
            variant
        }), className),
        ...props
    });
}
function AlertTitle(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        "data-slot": "alert-title",
        className: (0,utils.cn)("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className),
        ...props
    });
}
function AlertDescription(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        "data-slot": "alert-description",
        className: (0,utils.cn)("text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed", className),
        ...props
    });
}


// EXTERNAL MODULE: ./components/ui/tabs.tsx
var tabs = __webpack_require__(34964);
// EXTERNAL MODULE: ./components/ui/tooltip.tsx
var tooltip = __webpack_require__(37777);
// EXTERNAL MODULE: ./components/ui/badge.tsx
var badge = __webpack_require__(88145);
// EXTERNAL MODULE: ./node_modules/lodash.debounce/index.js
var lodash_debounce = __webpack_require__(54052);
var lodash_debounce_default = /*#__PURE__*/__webpack_require__.n(lodash_debounce);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-dialog/dist/index.mjs + 5 modules
var react_dialog_dist = __webpack_require__(20875);
;// ./components/ui/dialog.tsx
/* __next_internal_client_entry_do_not_use__ Dialog,DialogTrigger,DialogContent,DialogHeader,DialogFooter,DialogTitle,DialogDescription auto */ 




const Dialog = react_dialog_dist/* Root */.bL;
const DialogTrigger = react_dialog_dist/* Trigger */.l9;
const DialogPortal = (param)=>{
    let { children, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(react_dialog_dist/* Portal */.ZL, {
        ...props,
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            className: "fixed inset-0 z-50 flex items-start justify-center sm:items-center",
            children: children
        })
    });
};
DialogPortal.displayName = react_dialog_dist/* Portal */.ZL.displayName;
const DialogOverlay = /*#__PURE__*/ react.forwardRef((param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(react_dialog_dist/* Overlay */.hJ, {
        ref: ref,
        className: (0,utils.cn)("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in", className),
        ...props
    });
});
DialogOverlay.displayName = react_dialog_dist/* Overlay */.hJ.displayName;
const DialogContent = /*#__PURE__*/ react.forwardRef((param, ref)=>{
    let { className, children, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(DialogPortal, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(DialogOverlay, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(react_dialog_dist/* Content */.UC, {
                ref: ref,
                className: (0,utils.cn)("fixed z-50 grid w-full gap-4 rounded-b-lg border bg-background p-6 shadow-lg animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0", className),
                ...props,
                children: [
                    children,
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(react_dialog_dist/* Close */.bm, {
                        className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(x/* default */.A, {
                                className: "h-4 w-4"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                className: "sr-only",
                                children: "Close"
                            })
                        ]
                    })
                ]
            })
        ]
    });
});
DialogContent.displayName = react_dialog_dist/* Content */.UC.displayName;
const DialogHeader = (param)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        className: (0,utils.cn)("flex flex-col space-y-1.5 text-center sm:text-left", className),
        ...props
    });
};
DialogHeader.displayName = "DialogHeader";
const DialogFooter = (param)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        className: (0,utils.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    });
};
DialogFooter.displayName = "DialogFooter";
const DialogTitle = /*#__PURE__*/ react.forwardRef((param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(react_dialog_dist/* Title */.hE, {
        ref: ref,
        className: (0,utils.cn)("text-lg font-semibold leading-none tracking-tight", className),
        ...props
    });
});
DialogTitle.displayName = react_dialog_dist/* Title */.hE.displayName;
const DialogDescription = /*#__PURE__*/ react.forwardRef((param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(react_dialog_dist/* Description */.VY, {
        ref: ref,
        className: (0,utils.cn)("text-sm text-muted-foreground", className),
        ...props
    });
});
DialogDescription.displayName = react_dialog_dist/* Description */.VY.displayName;


;// ./components/keyboard-shortcuts.jsx
/* __next_internal_client_entry_do_not_use__ KeyboardShortcuts auto */ 



// Keyboard shortcut component
function KeyboardShortcuts(param) {
    let { open, onOpenChange } = param;
    const shortcuts = [
        {
            keys: [
                "Ctrl",
                "Enter"
            ],
            description: "Submit for marking"
        },
        {
            keys: [
                "Ctrl",
                "Shift",
                "R"
            ],
            description: "Reset form"
        },
        {
            keys: [
                "Ctrl",
                "."
            ],
            description: "Toggle advanced options"
        },
        {
            keys: [
                "Ctrl",
                "/"
            ],
            description: "Toggle help guide"
        },
        {
            keys: [
                "Ctrl",
                "K"
            ],
            description: "Open shortcuts dialog"
        },
        {
            keys: [
                "Tab"
            ],
            description: "Navigate between fields"
        },
        {
            keys: [
                "Esc"
            ],
            description: "Close dialogs"
        }
    ];
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(Dialog, {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(DialogContent, {
            className: "sm:max-w-md",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsxs)(DialogHeader, {
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(DialogTitle, {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(keyboard/* default */.A, {
                                    className: "h-5 w-5"
                                }),
                                "Keyboard Shortcuts"
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(DialogDescription, {
                            children: "Use these keyboard shortcuts to quickly navigate and use the application."
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                    className: "py-4",
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "space-y-2",
                        children: shortcuts.map((shortcut, index)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                        className: "text-sm",
                                        children: shortcut.description
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "flex items-center gap-1",
                                        children: shortcut.keys.map((key, keyIndex)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("kbd", {
                                                        className: "px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-xs",
                                                        children: key
                                                    }),
                                                    keyIndex < shortcut.keys.length - 1 && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "mx-1 text-gray-400",
                                                        children: "+"
                                                    })
                                                ]
                                            }, keyIndex))
                                    })
                                ]
                            }, index))
                    })
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)(DialogFooter, {
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                        onClick: ()=>onOpenChange(false),
                        children: "Close"
                    })
                })
            ]
        })
    });
}

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/copy.js
var copy = __webpack_require__(24357);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/mail.js
var mail = __webpack_require__(28883);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/twitter.js
var twitter = __webpack_require__(18175);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/facebook.js
var facebook = __webpack_require__(10488);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/download.js
var download = __webpack_require__(91788);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/printer.js
var printer = __webpack_require__(81304);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs + 11 modules
var react_dropdown_menu_dist = __webpack_require__(44198);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/check.js
var check = __webpack_require__(5196);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/circle.js
var circle = __webpack_require__(9428);
;// ./components/ui/dropdown-menu.tsx
/* __next_internal_client_entry_do_not_use__ DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem,DropdownMenuCheckboxItem,DropdownMenuRadioItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuShortcut,DropdownMenuGroup,DropdownMenuPortal,DropdownMenuSub,DropdownMenuSubContent,DropdownMenuSubTrigger,DropdownMenuRadioGroup auto */ 




const DropdownMenu = react_dropdown_menu_dist/* Root */.bL;
const DropdownMenuTrigger = react_dropdown_menu_dist/* Trigger */.l9;
const DropdownMenuGroup = react_dropdown_menu_dist/* Group */.YJ;
const DropdownMenuPortal = react_dropdown_menu_dist/* Portal */.ZL;
const DropdownMenuSub = react_dropdown_menu_dist/* Sub */.Pb;
const DropdownMenuRadioGroup = react_dropdown_menu_dist/* RadioGroup */.z6;
const DropdownMenuSubTrigger = /*#__PURE__*/ react.forwardRef((param, ref)=>{
    let { className, inset, children, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(react_dropdown_menu_dist/* SubTrigger */.ZP, {
        ref: ref,
        className: (0,utils.cn)("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent", inset && "pl-8", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0,jsx_runtime.jsx)(chevron_right/* default */.A, {
                className: "ml-auto h-4 w-4"
            })
        ]
    });
});
DropdownMenuSubTrigger.displayName = react_dropdown_menu_dist/* SubTrigger */.ZP.displayName;
const DropdownMenuSubContent = /*#__PURE__*/ react.forwardRef((param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(react_dropdown_menu_dist/* SubContent */.G5, {
        ref: ref,
        className: (0,utils.cn)("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground dark:bg-popover dark:text-popover-foreground p-1 shadow-md animate-in slide-in-from-left-1", className),
        ...props
    });
});
DropdownMenuSubContent.displayName = react_dropdown_menu_dist/* SubContent */.G5.displayName;
const DropdownMenuContent = /*#__PURE__*/ react.forwardRef((param, ref)=>{
    let { className, sideOffset = 4, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(react_dropdown_menu_dist/* Portal */.ZL, {
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(react_dropdown_menu_dist/* Content */.UC, {
            ref: ref,
            sideOffset: sideOffset,
            className: (0,utils.cn)("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground dark:bg-popover dark:text-popover-foreground p-1 shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
            ...props
        })
    });
});
DropdownMenuContent.displayName = react_dropdown_menu_dist/* Content */.UC.displayName;
const DropdownMenuItem = /*#__PURE__*/ react.forwardRef((param, ref)=>{
    let { className, inset, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(react_dropdown_menu_dist/* Item */.q7, {
        ref: ref,
        className: (0,utils.cn)("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", inset && "pl-8", className),
        ...props
    });
});
DropdownMenuItem.displayName = react_dropdown_menu_dist/* Item */.q7.displayName;
const DropdownMenuCheckboxItem = /*#__PURE__*/ react.forwardRef((param, ref)=>{
    let { className, children, checked, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(react_dropdown_menu_dist/* CheckboxItem */.H_, {
        ref: ref,
        className: (0,utils.cn)("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        checked: checked,
        ...props,
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(react_dropdown_menu_dist/* ItemIndicator */.VF, {
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(check/* default */.A, {
                        className: "h-4 w-4"
                    })
                })
            }),
            children
        ]
    });
});
DropdownMenuCheckboxItem.displayName = react_dropdown_menu_dist/* CheckboxItem */.H_.displayName;
const DropdownMenuRadioItem = /*#__PURE__*/ react.forwardRef((param, ref)=>{
    let { className, children, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(react_dropdown_menu_dist/* RadioItem */.hN, {
        ref: ref,
        className: (0,utils.cn)("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        ...props,
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(react_dropdown_menu_dist/* ItemIndicator */.VF, {
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(circle/* default */.A, {
                        className: "h-2 w-2 fill-current"
                    })
                })
            }),
            children
        ]
    });
});
DropdownMenuRadioItem.displayName = react_dropdown_menu_dist/* RadioItem */.hN.displayName;
const DropdownMenuLabel = /*#__PURE__*/ react.forwardRef((param, ref)=>{
    let { className, inset, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(react_dropdown_menu_dist/* Label */.JU, {
        ref: ref,
        className: (0,utils.cn)("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
        ...props
    });
});
DropdownMenuLabel.displayName = react_dropdown_menu_dist/* Label */.JU.displayName;
const DropdownMenuSeparator = /*#__PURE__*/ react.forwardRef((param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(react_dropdown_menu_dist/* Separator */.wv, {
        ref: ref,
        className: (0,utils.cn)("-mx-1 my-1 h-px bg-muted", className),
        ...props
    });
});
DropdownMenuSeparator.displayName = react_dropdown_menu_dist/* Separator */.wv.displayName;
const DropdownMenuShortcut = (param)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
        className: (0,utils.cn)("ml-auto text-xs tracking-widest opacity-60", className),
        ...props
    });
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";


// EXTERNAL MODULE: ./components/ui/label.tsx
var label = __webpack_require__(82714);
// EXTERNAL MODULE: ./components/ui/input.tsx
var input = __webpack_require__(89852);
// EXTERNAL MODULE: ./app/aimarker-hooks.js
var aimarker_hooks = __webpack_require__(86653);
// EXTERNAL MODULE: ./components/theme-toggle.tsx
var theme_toggle = __webpack_require__(27971);
// EXTERNAL MODULE: ./node_modules/sonner/dist/index.mjs
var sonner_dist = __webpack_require__(56671);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/cloud-upload.js
var cloud_upload = __webpack_require__(42337);
// EXTERNAL MODULE: ./node_modules/react-hotkeys-hook/packages/react-hotkeys-hook/dist/index.js
var react_hotkeys_hook_dist = __webpack_require__(8310);
// EXTERNAL MODULE: ./components/ui/scroll-area.tsx
var scroll_area = __webpack_require__(16891);
;// ./components/ui/sheet.tsx
/* __next_internal_client_entry_do_not_use__ Sheet,SheetTrigger,SheetClose,SheetContent,SheetHeader,SheetFooter,SheetTitle,SheetDescription auto */ 




function Sheet(param) {
    let { ...props } = param;
    return /*#__PURE__*/ _jsx(SheetPrimitive.Root, {
        "data-slot": "sheet",
        ...props
    });
}
function SheetTrigger(param) {
    let { ...props } = param;
    return /*#__PURE__*/ _jsx(SheetPrimitive.Trigger, {
        "data-slot": "sheet-trigger",
        ...props
    });
}
function SheetClose(param) {
    let { ...props } = param;
    return /*#__PURE__*/ _jsx(SheetPrimitive.Close, {
        "data-slot": "sheet-close",
        ...props
    });
}
function SheetPortal(param) {
    let { ...props } = param;
    return /*#__PURE__*/ _jsx(SheetPrimitive.Portal, {
        "data-slot": "sheet-portal",
        ...props
    });
}
function SheetOverlay(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ _jsx(SheetPrimitive.Overlay, {
        "data-slot": "sheet-overlay",
        className: cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className),
        ...props
    });
}
function SheetContent(param) {
    let { className, children, side = "right", ...props } = param;
    return /*#__PURE__*/ _jsxs(SheetPortal, {
        children: [
            /*#__PURE__*/ _jsx(SheetOverlay, {}),
            /*#__PURE__*/ _jsxs(SheetPrimitive.Content, {
                "data-slot": "sheet-content",
                className: cn("bg-background text-foreground dark:bg-background dark:text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500", side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm", side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm", side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b", side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t", className),
                ...props,
                children: [
                    children,
                    /*#__PURE__*/ _jsxs(SheetPrimitive.Close, {
                        className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none",
                        children: [
                            /*#__PURE__*/ _jsx(XIcon, {
                                className: "size-4"
                            }),
                            /*#__PURE__*/ _jsx("span", {
                                className: "sr-only",
                                children: "Close"
                            })
                        ]
                    })
                ]
            })
        ]
    });
}
function SheetHeader(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ _jsx("div", {
        "data-slot": "sheet-header",
        className: cn("flex flex-col gap-1.5 p-4", className),
        ...props
    });
}
function SheetFooter(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ _jsx("div", {
        "data-slot": "sheet-footer",
        className: cn("mt-auto flex flex-col gap-2 p-4", className),
        ...props
    });
}
function SheetTitle(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ _jsx(SheetPrimitive.Title, {
        "data-slot": "sheet-title",
        className: cn("text-foreground font-semibold", className),
        ...props
    });
}
function SheetDescription(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ _jsx(SheetPrimitive.Description, {
        "data-slot": "sheet-description",
        className: cn("text-muted-foreground text-sm", className),
        ...props
    });
}


// EXTERNAL MODULE: ./node_modules/@radix-ui/react-slider/dist/index.mjs + 3 modules
var react_slider_dist = __webpack_require__(73181);
;// ./components/ui/slider.tsx
/* __next_internal_client_entry_do_not_use__ Slider auto */ 



function Slider(param) {
    let { className, defaultValue, value, min = 0, max = 100, ...props } = param;
    const _values = react.useMemo(()=>Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [
            min,
            max
        ], [
        value,
        defaultValue,
        min,
        max
    ]);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(react_slider_dist/* Root */.bL, {
        "data-slot": "slider",
        defaultValue: defaultValue,
        value: value,
        min: min,
        max: max,
        className: (0,utils.cn)("relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col", className),
        ...props,
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(react_slider_dist/* Track */.CC, {
                "data-slot": "slider-track",
                className: (0,utils.cn)("bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"),
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(react_slider_dist/* Range */.Q6, {
                    "data-slot": "slider-range",
                    className: (0,utils.cn)("bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full")
                })
            }),
            Array.from({
                length: _values.length
            }, (_, index)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(react_slider_dist/* Thumb */.zi, {
                    "data-slot": "slider-thumb",
                    className: "border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                }, index))
        ]
    });
}


// EXTERNAL MODULE: ./node_modules/@radix-ui/react-switch/dist/index.mjs + 2 modules
var react_switch_dist = __webpack_require__(96440);
;// ./components/ui/switch.tsx
/* __next_internal_client_entry_do_not_use__ Switch auto */ 



function Switch(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(react_switch_dist/* Root */.bL, {
        "data-slot": "switch",
        className: (0,utils.cn)("peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className),
        ...props,
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(react_switch_dist/* Thumb */.zi, {
            "data-slot": "switch-thumb",
            className: (0,utils.cn)("bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0")
        })
    });
}


// EXTERNAL MODULE: ./node_modules/papaparse/papaparse.min.js
var papaparse_min = __webpack_require__(60408);
var papaparse_min_default = /*#__PURE__*/__webpack_require__.n(papaparse_min);
// EXTERNAL MODULE: ./lib/api-helpers.js
var api_helpers = __webpack_require__(2452);
;// ./app/aimarker.jsx
/* __next_internal_client_entry_do_not_use__ default auto */ 




 // Add import for KaTeX CSS
 // Add import for remark-math plugin
 // Add import for rehype-katex plugin





 // Changed alias to SelectItem














 // Added Maximize, Minimize, Moon, Sun, UploadCloud, User





 // ADDED Dialog for OCR Preview
 // Import PapaParse
// Import API helper functions from separate file
 // Renamed import
// API URL for our backend
// NEXT_PUBLIC_API_BASE_URL should be set in your environment variables.
// For GitHub Pages, it should point to your Render backend.
// For local development, it can point to your local backend.
const API_BASE_URL = "https://beenycool-github-io.onrender.com" || 0; // Fallback for local if not set
// Determine if running on GitHub Pages using the helper
const isGHPages = (0,api_helpers/* isGitHubPages */.sC)();
// Constants moved to a separate section for easier management
const HISTORY_LIMIT = 10; // Define the maximum number of history items to keep
const SUBJECTS = [
    {
        value: "english",
        label: "English"
    },
    {
        value: "maths",
        label: "Maths",
        hasTiers: true
    },
    {
        value: "science",
        label: "Science",
        hasTiers: true
    },
    {
        value: "history",
        label: "History"
    },
    {
        value: "geography",
        label: "Geography"
    },
    {
        value: "computerScience",
        label: "Computer Science"
    },
    {
        value: "businessStudies",
        label: "Business Studies"
    }
];
const EXAM_BOARDS = [
    {
        value: "aqa",
        label: "AQA"
    },
    {
        value: "edexcel",
        label: "Edexcel"
    },
    {
        value: "ocr",
        label: "OCR"
    },
    {
        value: "wjec",
        label: "WJEC"
    }
];
const USER_TYPES = [
    {
        value: "student",
        label: "Student"
    },
    {
        value: "teacher",
        label: "Teacher"
    }
];
const AI_MODELS = [
    {
        value: "o3",
        label: "O3",
        description: "Most powerful model, but heavily rate limited."
    },
    {
        value: "o4-mini",
        label: "O4 Mini",
        description: "Delivers compareable performance to o3, but much faster"
    },
    {
        value: "xai/grok-3",
        label: "Grok-3",
        description: "X AI Model (Grok)"
    },
    {
        value: "xai/grok-3-mini",
        label: "Grok-3 Mini",
        description: "Smaller, faster X AI Model"
    },
    {
        value: "gemini-2.5-flash-preview-05-20",
        label: "Gemini 2.5 Flash Preview",
        description: "Best quality with faster response times"
    },
    {
        value: "microsoft/mai-ds-r1:free",
        label: "R1 (thinking model)",
        description: "Most thorough reasoning process (may take 1-2 minutes)"
    },
    {
        value: "deepseek/deepseek-chat-v3-0324:free",
        label: "V3 (balanced model)",
        description: "Balanced speed and quality"
    },
    {
        value: "google/gemini-2.0-flash-exp:free",
        label: "Gemini 2.0 Flash (OCR only)",
        description: "Special model for OCR with exam board OCR"
    }
];
// Add fallback models for when primary models are rate limited
const FALLBACK_MODELS = {
    "gemini-2.5-flash-preview-05-20": "deepseek/deepseek-chat-v3-0324:free",
    "deepseek/deepseek-chat-v3-0324:free": "microsoft/mai-ds-r1:free",
    "microsoft/mai-ds-r1:free": "gemini-2.5-flash-preview-05-20",
    "o3": "o4-mini",
    "o4-mini": "deepseek/deepseek-chat-v3-0324:free",
    "xai/grok-3": "deepseek/deepseek-chat-v3-0324:free",
    "google/gemini-2.0-flash-exp:free": "deepseek/deepseek-chat-v3-0324:free" // Fallback for Gemini 2.0 Flash
};
// Define model-specific rate limits (in milliseconds)
// Based on GitHub Copilot Pro rate limits
const MODEL_RATE_LIMITS = {
    // Standard models
    "gemini-2.5-flash-preview-05-20": 60000,
    "deepseek/deepseek-chat-v3-0324:free": 10000,
    // DeepSeek-R1 and MAI-DS-R1: 1 request per minute
    "microsoft/mai-ds-r1:free": 60000,
    // OpenRouter Masr1
    "openrouter/masr1": 30000,
    // Models with 8k/4k token limits
    "o3": 60000,
    "o4-mini": 30000,
    "o4": 60000,
    // xAI Grok-3
    "xai/grok-3": 60000,
    // Gemini 2.0 Flash (for OCR only)
    "google/gemini-2.0-flash-exp:free": 60000 // 1 minute
};
// Define specific models for specific tasks
const TASK_SPECIFIC_MODELS = {
    "image_processing": {
        "default": "gemini-2.5-flash-preview-05-20",
        "ocr": "google/gemini-2.0-flash-exp:free" // Special case for OCR exam board
    },
    "subject_assessment": "gemini-2.5-flash-preview-05-20" // Use Gemini 2.5 Flash for subject assessments
};
// Define default thinking budgets for models that support it
const DEFAULT_THINKING_BUDGETS = {
    "gemini-2.5-flash-preview-05-20": 1024,
    "microsoft/mai-ds-r1:free": 0,
    "o3": 4000,
    "o4-mini": 4000,
    "xai/grok-3": 2048,
    "google/gemini-2.0-flash-exp:free": 1024
};
const subjectKeywords = {
    english: [
        'shakespeare',
        'poem',
        'poetry',
        'novel',
        'character',
        'theme',
        'literature'
    ],
    maths: [
        'equation',
        'solve',
        'calculate',
        'algebra',
        'geometry',
        'trigonometry',
        'formula'
    ],
    science: [
        'experiment',
        'hypothesis',
        'cell',
        'atom',
        'energy',
        'physics',
        'chemistry',
        'biology'
    ],
    history: [
        'war',
        'battle',
        'king',
        'queen',
        'century',
        'revolution',
        'empire',
        'historical'
    ],
    geography: [
        'map',
        'climate',
        'population',
        'country',
        'city',
        'river',
        'mountain',
        'ecosystem'
    ],
    computerScience: [
        'programming',
        'algorithm',
        'code',
        'computer',
        'software',
        'hardware'
    ],
    businessStudies: [
        'business',
        'market',
        'finance',
        'profit',
        'enterprise',
        'economy'
    ]
};
// Add question types for English subject
const QUESTION_TYPES = {
    english: {
        aqa: [
            {
                value: "general",
                label: "General Assessment"
            },
            {
                value: "paper1q3",
                label: "Paper 1, Question 3 (Structure)"
            },
            {
                value: "paper1q4",
                label: "Paper 1, Question 4 (Evaluation)"
            },
            {
                value: "paper2q2",
                label: "Paper 2, Question 2 (Summary)"
            },
            {
                value: "paper2q5",
                label: "Paper 2, Question 5 (Writing)"
            }
        ],
        edexcel: [
            {
                value: "general",
                label: "General Assessment"
            }
        ],
        ocr: [
            {
                value: "general",
                label: "General Assessment"
            }
        ],
        wjec: [
            {
                value: "general",
                label: "General Assessment"
            }
        ]
    }
};
// Simple placeholder function since we removed the test button
const testMarkSchemeGeneration = ()=>{
    toast.info("Test generation functionality has been removed");
};
// Add function to automatically detect total marks from question
const detectTotalMarksFromQuestion = (questionText)=>{
    if (!questionText) return null;
    // Common patterns for total marks in GCSE questions
    const patterns = [
        /\[(\d+) marks?\]/i,
        /\((\d+) marks?\)/i,
        /worth (\d+) marks?/i,
        /for (\d+) marks?/i,
        /total (?:of )?(\d+) marks?/i,
        /\[Total:? (\d+)(?:\s*marks?)?\]/i,
        /\(Total:? (\d+)(?:\s*marks?)?\)/i,
        /^(\d+) marks?:?/i,
        /\[(\d+)(?:\s*m)\]/i,
        /\((\d+)(?:\s*m)\)/i // (8m)
    ];
    for (const pattern of patterns){
        const match = questionText.match(pattern);
        if (match && match[1]) {
            const marks = parseInt(match[1]);
            if (!isNaN(marks) && marks > 0) {
                console.log("Detected ".concat(marks, " total marks from question"));
                // Show a toast notification to inform the user
                if (typeof sonner_dist/* toast */.oR !== 'undefined') {
                    sonner_dist/* toast */.oR.info("Automatically detected ".concat(marks, " total marks from the question"));
                }
                return marks.toString();
            }
        }
    }
    return null;
};
// Helper function to copy feedback to clipboard
const copyFeedbackToClipboard = (feedback)=>{
    if (feedback) {
        navigator.clipboard.writeText(feedback);
        alert("Feedback copied to clipboard!");
    }
};
// Enhanced Backend Status Checker Component
const BackendStatusChecker = (param)=>{
    let { onStatusChange } = param;
    const [status, setStatus] = useState('checking'); // 'checking', 'online', 'offline', 'error', 'rate_limited', 'waking_up'
    const [statusDetail, setStatusDetail] = useState(null);
    const [lastChecked, setLastChecked] = useState(null);
    const [isWakingUp, setIsWakingUp] = useState(false);
    const [wakeupProgress, setWakeupProgress] = useState(0);
    const [wakeupAttempts, setWakeupAttempts] = useState(0);
    const wakeupTimerRef = useRef(null);
    const { checkBackendStatus } = useBackendStatus(API_BASE_URL);
    const checkStatus = useCallback(async ()=>{
        try {
            setStatus('checking');
            // Check if the backend is reachable
            const result = await checkBackendStatus();
            setLastChecked(new Date().toLocaleTimeString());
            if (!result.ok) {
                // If it's a timeout, assume the server is waking up
                if (result.status === 'timeout') {
                    setStatus('waking_up');
                    setStatusDetail('Server is waking up...');
                    setIsWakingUp(true);
                    setWakeupProgress(0);
                    // Start a progress timer for visual feedback - max 50 seconds for wakeup
                    clearInterval(wakeupTimerRef.current);
                    wakeupTimerRef.current = setInterval(()=>{
                        setWakeupProgress((prev)=>{
                            const newProgress = prev + 2; // Increment by 2% every second
                            if (newProgress >= 100) {
                                clearInterval(wakeupTimerRef.current);
                                return 100;
                            }
                            return newProgress;
                        });
                    }, 1000);
                    // Schedule an automatic recheck after 10 seconds
                    setTimeout(()=>{
                        checkStatus();
                    }, 10000);
                } else {
                    setStatus(result.status || 'error');
                    setStatusDetail(result.error);
                    setIsWakingUp(false);
                    clearInterval(wakeupTimerRef.current);
                }
                if (onStatusChange) onStatusChange(result.status || 'error', result.data);
                // Store status in window object for other components to access
                if (true) {
                    window.BACKEND_STATUS = {
                        status: result.status || 'error',
                        lastChecked: new Date().toLocaleTimeString()
                    };
                }
                return;
            }
            // All checks passed
            setStatus('online');
            setStatusDetail(null);
            setIsWakingUp(false);
            setWakeupAttempts(0);
            clearInterval(wakeupTimerRef.current);
            // Store status in window object for other components to access
            if (true) {
                window.BACKEND_STATUS = {
                    status: 'online',
                    lastChecked: new Date().toLocaleTimeString()
                };
            }
            if (onStatusChange) onStatusChange('online', result.data);
        } catch (error) {
            console.error('Backend status check failed:', error);
            if (error.name === 'AbortError') {
                setStatus('timeout');
                setStatusDetail('Connection timed out');
            } else {
                setStatus('error');
                setStatusDetail(error.message);
            }
            // Store status in window object
            if (true) {
                window.BACKEND_STATUS = {
                    status: error.name === 'AbortError' ? 'timeout' : 'error',
                    lastChecked: new Date().toLocaleTimeString(),
                    error: error.message
                };
            }
            if (onStatusChange) onStatusChange(error.name === 'AbortError' ? 'timeout' : 'error');
        }
    }, [
        checkBackendStatus,
        onStatusChange
    ]);
    // Automatic status check on component mount
    useEffect(()=>{
        checkStatus();
        // Set up interval to check status every 60 seconds
        const intervalId = setInterval(()=>{
            checkStatus();
        }, 60000);
        return ()=>{
            clearInterval(intervalId);
            clearInterval(wakeupTimerRef.current);
        };
    }, [
        checkStatus
    ]);
    // Manual refresh handler
    const handleRefresh = useCallback(()=>{
        checkStatus();
    }, [
        checkStatus
    ]);
    // Skip rendering if online - MODIFIED TO USE STYLE FOR VISIBILITY
    // if (status === 'online') return null;
    // Render a prominent notification when backend is offline
    return /*#__PURE__*/ _jsxs("div", {
        style: {
            display: status === 'online' ? 'none' : 'block'
        },
        className: "mb-4 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg shadow-sm",
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: "flex items-center",
                        children: [
                            /*#__PURE__*/ _jsx(AlertTriangle, {
                                className: "h-5 w-5 text-amber-500 mr-2 flex-shrink-0"
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                children: [
                                    /*#__PURE__*/ _jsx("h3", {
                                        className: "font-medium text-amber-800 dark:text-amber-300",
                                        children: status === 'waking_up' ? 'Backend Server is Starting Up' : 'Backend Server is Offline'
                                    }),
                                    /*#__PURE__*/ _jsx("p", {
                                        className: "text-sm text-amber-700 dark:text-amber-400 mt-1",
                                        children: status === 'waking_up' ? 'This can take up to 30-60 seconds as the server initializes.' : 'The backend server is currently offline. Click the button to wake it up.'
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: "w-full sm:w-auto",
                        children: /*#__PURE__*/ _jsx(Button, {
                            onClick: handleRefresh,
                            disabled: isWakingUp && wakeupProgress < 95,
                            className: "w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white",
                            children: isWakingUp ? /*#__PURE__*/ _jsxs(_Fragment, {
                                children: [
                                    /*#__PURE__*/ _jsx(Loader2, {
                                        className: "mr-2 h-4 w-4 animate-spin"
                                    }),
                                    "Waking Up... (",
                                    Math.min(wakeupProgress, 95),
                                    "%)"
                                ]
                            }) : /*#__PURE__*/ _jsxs(_Fragment, {
                                children: [
                                    /*#__PURE__*/ _jsx(Zap, {
                                        className: "mr-2 h-4 w-4"
                                    }),
                                    wakeupAttempts > 0 ? 'Try Again' : 'Wake Up API'
                                ]
                            })
                        })
                    })
                ]
            }),
            isWakingUp && /*#__PURE__*/ _jsx("div", {
                className: "mt-3",
                children: /*#__PURE__*/ _jsx("div", {
                    className: "w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2.5",
                    children: /*#__PURE__*/ _jsx("div", {
                        className: "bg-amber-500 h-2.5 rounded-full transition-all duration-300",
                        style: {
                            width: "".concat(Math.min(wakeupProgress, 95), "%")
                        }
                    })
                })
            }),
            statusDetail && /*#__PURE__*/ _jsxs("p", {
                className: "mt-2 text-xs text-amber-700 dark:text-amber-400",
                children: [
                    "Details: ",
                    statusDetail
                ]
            }),
            /*#__PURE__*/ _jsx("p", {
                className: "mt-3 text-xs text-amber-700 dark:text-amber-400 italic",
                children: 'The backend API automatically spins down after periods of inactivity to save resources. This is why it may take up to a minute to "wake up" when you first visit the site.'
            })
        ]
    });
};
// Add a better success alert component with animations
const EnhancedAlert = (param)=>{
    let { success, error, onRetryAction } = param;
    var _error_message, _error_message1, _error_type, _error_message2, _error_message3;
    if (!success && !error) return null;
    if (success) {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)(Alert, {
            className: "mb-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_check/* default */.A, {
                    className: "h-4 w-4 text-green-600 dark:text-green-400"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)(AlertTitle, {
                    className: "text-green-800 dark:text-green-300 ml-2",
                    children: "Success"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)(AlertDescription, {
                    className: "text-green-700 dark:text-green-400 ml-2",
                    children: success.message
                })
            ]
        });
    }
    // For error messages
    const isApiError = error.type === 'api_error' || ((_error_message = error.message) === null || _error_message === void 0 ? void 0 : _error_message.includes('API')) || ((_error_message1 = error.message) === null || _error_message1 === void 0 ? void 0 : _error_message1.includes('backend'));
    const isRateLimited = ((_error_type = error.type) === null || _error_type === void 0 ? void 0 : _error_type.startsWith('rate_limit')) || ((_error_message2 = error.message) === null || _error_message2 === void 0 ? void 0 : _error_message2.includes('rate limit')) || ((_error_message3 = error.message) === null || _error_message3 === void 0 ? void 0 : _error_message3.toLowerCase().includes('too many requests'));
    let title = 'Error';
    if (isApiError) title = 'API Error';
    else if (error.type === 'rate_limit_with_fallback') title = 'Rate Limited (Fallback Available)';
    else if (error.type === 'rate_limit_wait') title = 'Rate Limited (Please Wait)';
    else if (isRateLimited) title = 'Rate Limited';
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(Alert, {
        className: "mb-4 ".concat(isRateLimited ? 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900' : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900'),
        children: [
            isRateLimited ? /*#__PURE__*/ (0,jsx_runtime.jsx)(triangle_alert/* default */.A, {
                className: "h-4 w-4 text-amber-600 dark:text-amber-400"
            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(triangle_alert/* default */.A, {
                className: "h-4 w-4 text-red-600 dark:text-red-400"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(AlertTitle, {
                className: "".concat(isRateLimited ? 'text-amber-800 dark:text-amber-300' : 'text-red-800 dark:text-red-300', " ml-2 flex items-center gap-2"),
                children: [
                    title,
                    error.code && /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                        className: "text-xs opacity-75",
                        children: [
                            "(",
                            error.code,
                            ")"
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(AlertDescription, {
                className: "".concat(isRateLimited ? 'text-amber-700 dark:text-amber-400' : 'text-red-700 dark:text-red-400', " ml-2 flex flex-col gap-2"),
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                        children: error.message
                    }),
                    isApiError && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                        className: "text-sm",
                        children: "The backend API service may be offline or starting up. This is normal as the server goes to sleep after periods of inactivity."
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex flex-wrap items-center gap-2 mt-2",
                        children: [
                            error.type === 'rate_limit_with_fallback' && error.fallbackModel && error.onRetryFallback && /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                                size: "sm",
                                variant: "outline",
                                className: "text-xs h-7 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300",
                                onClick: ()=>error.onRetryFallback(error.fallbackModel),
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_cw/* default */.A, {
                                        className: "h-3 w-3 mr-1"
                                    }),
                                    " Try with a different model"
                                ]
                            }),
                            error.type === 'rate_limit_wait' && error.waitTime && error.onRetry && /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                                size: "sm",
                                variant: "outline",
                                className: "text-xs h-7 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300",
                                onClick: ()=>{
                                    sonner_dist/* toast */.oR.info("Retrying in ".concat(error.waitTime, " seconds..."));
                                    setTimeout(()=>error.onRetry(), error.waitTime * 1000);
                                },
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_cw/* default */.A, {
                                        className: "h-3 w-3 mr-1"
                                    }),
                                    " Retry in ",
                                    error.waitTime,
                                    "s"
                                ]
                            }),
                            (error.type === 'api_error' || error.type === 'network' || error.type === 'timeout') && error.onRetry && /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                                size: "sm",
                                variant: "outline",
                                className: "text-xs h-7 ".concat(isRateLimited ? 'border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300' : 'border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900 text-red-800 dark:text-red-300'),
                                onClick: error.onRetry === true ? ()=>window.location.reload() : error.onRetry,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_cw/* default */.A, {
                                        className: "h-3 w-3 mr-1"
                                    }),
                                    " Try with a different model"
                                ]
                            }),
                            isApiError && onRetryAction && typeof onRetryAction.checkBackendStatus === 'function' && /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                                size: "sm",
                                variant: "outline",
                                className: "text-xs h-7 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-800 dark:text-blue-300",
                                onClick: ()=>onRetryAction.checkBackendStatus(),
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(zap/* default */.A, {
                                        className: "h-3 w-3 mr-1"
                                    }),
                                    " Check Server Status"
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
};
// Add a progress indicator component
const ProgressIndicator = (param)=>{
    let { loading, progress } = param;
    // Don't show if not loading or if progress is empty (stream finished)
    if (!loading || !progress) return null;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        className: "absolute inset-0 bg-black/5 dark:bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-50 rounded-lg",
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            className: "bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg flex flex-col items-center gap-2 min-w-[200px]",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)(loader_circle/* default */.A, {
                    className: "h-6 w-6 animate-spin text-primary"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                    className: "text-sm font-medium",
                    children: progress || "Processing..."
                })
            ]
        })
    });
};
// Enhanced Markdown component with LaTeX support
const MathMarkdown = (param)=>{
    let { children } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(lib/* Markdown */.oz, {
        remarkPlugins: [
            remark_math_lib/* default */.A
        ],
        rehypePlugins: [
            rehype_katex_lib/* default */.A
        ],
        components: {
            // You can customize components if needed
            h1: (param)=>{
                let { node, ...props } = param;
                return /*#__PURE__*/ (0,jsx_runtime.jsx)("h1", {
                    className: "text-xl my-3 font-bold",
                    ...props
                });
            },
            h2: (param)=>{
                let { node, ...props } = param;
                return /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                    className: "text-lg my-3 font-bold",
                    ...props
                });
            },
            h3: (param)=>{
                let { node, ...props } = param;
                return /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                    className: "text-base my-2.5 font-semibold",
                    ...props
                });
            },
            p: (param)=>{
                let { node, ...props } = param;
                return /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                    className: "my-2",
                    ...props
                });
            },
            ul: (param)=>{
                let { node, ...props } = param;
                return /*#__PURE__*/ (0,jsx_runtime.jsx)("ul", {
                    className: "list-disc pl-5 my-2",
                    ...props
                });
            },
            ol: (param)=>{
                let { node, ...props } = param;
                return /*#__PURE__*/ (0,jsx_runtime.jsx)("ol", {
                    className: "list-decimal pl-5 my-2",
                    ...props
                });
            },
            li: (param)=>{
                let { node, ...props } = param;
                return /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                    className: "ml-2 my-1",
                    ...props
                });
            },
            strong: (param)=>{
                let { node, ...props } = param;
                return /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                    className: "font-bold",
                    ...props
                });
            },
            em: (param)=>{
                let { node, ...props } = param;
                return /*#__PURE__*/ (0,jsx_runtime.jsx)("em", {
                    className: "italic",
                    ...props
                });
            }
        },
        children: children
    });
};
// Enhanced feedback sharing functionality
const shareFeedback = (feedback, method, grade)=>{
    const title = "GCSE Grade ".concat(grade, " Feedback");
    const cleanFeedback = feedback.replace(/\[GRADE:\d\]/g, '');
    switch(method){
        case 'clipboard':
            navigator.clipboard.writeText(cleanFeedback);
            return 'Feedback copied to clipboard!';
        case 'email':
            const emailSubject = encodeURIComponent(title);
            const emailBody = encodeURIComponent(cleanFeedback);
            window.open("mailto:?subject=".concat(emailSubject, "&body=").concat(emailBody));
            return 'Email client opened';
        case 'twitter':
            const tweetText = encodeURIComponent("I received a Grade ".concat(grade, " on my GCSE assessment! #GCSE #Education"));
            window.open("https://twitter.com/intent/tweet?text=".concat(tweetText));
            return 'Twitter share opened';
        case 'facebook':
            window.open("https://www.facebook.com/sharer/sharer.php?u=".concat(encodeURIComponent(window.location.href)));
            return 'Facebook share opened';
        default:
            return '';
    }
};
// Improved PDF export function using html2canvas and jsPDF
const saveFeedbackAsPdf = async (feedbackElement, grade)=>{
    try {
        const html2canvasModule = await __webpack_require__.e(/* import() */ 699).then(__webpack_require__.t.bind(__webpack_require__, 52699, 23));
        const jsPDFModule = await __webpack_require__.e(/* import() */ 978).then(__webpack_require__.bind(__webpack_require__, 40978));
        const html2canvas = html2canvasModule.default;
        const jsPDF = jsPDFModule.default;
        const feedbackContainer = feedbackElement.current;
        if (!feedbackContainer) {
            sonner_dist/* toast */.oR.error("Feedback element not found for PDF export.");
            return;
        }
        // Slightly increase scale for better quality, ensure all content is captured
        const canvas = await html2canvas(feedbackContainer, {
            scale: 2.5,
            useCORS: true,
            logging: false,
            scrollY: -window.scrollY,
            windowWidth: feedbackContainer.scrollWidth,
            windowHeight: feedbackContainer.scrollHeight,
            backgroundColor: window.getComputedStyle(document.documentElement).getPropertyValue('--card').trim() || '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4', true); // Added 'true' for better compression
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = (pdfHeight - imgHeight * ratio) / 2; // Center vertically too
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save("GCSE_Grade".concat(grade || 'N/A', "_Feedback.pdf"));
        sonner_dist/* toast */.oR.success('Feedback saved as PDF');
        return 'Feedback saved as PDF';
    } catch (error) {
        console.error('Error saving PDF:', error);
        sonner_dist/* toast */.oR.error('Could not generate PDF. Please try again.');
    }
};
// Improved print functionality
const printFeedback = (feedbackElement)=>{
    try {
        const printWindow = window.open('', '_blank');
        const feedbackHTML = feedbackElement.current.innerHTML;
        printWindow.document.write('\n      <!DOCTYPE html>\n      <html>\n        <head>\n          <title>GCSE Assessment Feedback</title>\n          <style>\n            body { font-family: Arial, sans-serif; padding: 20px; }\n            .feedback-container { max-width: 800px; margin: 0 auto; }\n            h1, h2, h3 { color: #333; }\n            ul { padding-left: 20px; }\n            li { margin-bottom: 5px; }\n            .grade { display: inline-block; width: 40px; height: 40px; \n                    background: #f0f0f0; border-radius: 50%; text-align: center; \n                    line-height: 40px; font-weight: bold; font-size: 20px; \n                    margin: 10px 0; }\n          </style>\n        </head>\n        <body>\n          <div class="feedback-container">\n            <h1>GCSE Assessment Feedback</h1>\n            '.concat(feedbackHTML, "\n          </div>\n          <script>\n            window.onload = function() { window.print(); window.close(); }\n          </script>\n        </body>\n      </html>\n    "));
        printWindow.document.close();
        return 'Print dialog opened';
    } catch (error) {
        console.error('Error printing feedback:', error);
        alert('Could not open print dialog. Please try again or use another method to save the feedback.');
    }
};
// Add this new component
const MotionListItem = /*#__PURE__*/ (0,react.forwardRef)((param, ref)=>{
    let { children, ...props } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(proxy/* motion */.P.li, {
        ref: ref,
        ...props,
        children: children
    });
});
MotionListItem.displayName = 'MotionListItem';
// Enhanced Feedback UI component
const EnhancedFeedback = (param)=>{
    let { feedback, grade, modelName, achievedMarks, totalMarks, hasMarkScheme, onAskFollowUp = ()=>{}, followUpEnabled = true } = param;
    const feedbackRef = (0,react.useRef)(null);
    const [shareMessage, setShareMessage] = (0,react.useState)(null);
    const handleShare = (method)=>{
        const message = shareFeedback(feedback, method, grade);
        setShareMessage(message);
        setTimeout(()=>setShareMessage(null), 2000);
    };
    const handleSaveAsPdf = async ()=>{
        const message = await saveFeedbackAsPdf(feedbackRef, grade);
        setShareMessage(message);
        setTimeout(()=>setShareMessage(null), 2000);
    };
    const handlePrint = ()=>{
        const message = printFeedback(feedbackRef);
        setShareMessage(message);
        setTimeout(()=>setShareMessage(null), 2000);
    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "relative",
        children: [
            shareMessage && /*#__PURE__*/ (0,jsx_runtime.jsx)(proxy/* motion */.P.div, {
                initial: {
                    opacity: 0,
                    y: -10
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                exit: {
                    opacity: 0,
                    y: -10
                },
                className: "absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1.5 rounded text-sm z-10",
                children: shareMessage
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex justify-between items-center mb-3",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex items-center gap-2",
                        children: [
                            grade && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex flex-col items-start gap-2 mr-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-bold rounded-md shadow-md",
                                        children: [
                                            "Grade: ",
                                            grade
                                        ]
                                    }),
                                    achievedMarks && totalMarks && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-br from-green-600 to-teal-600 dark:from-green-500 dark:to-teal-500 text-white font-bold rounded-md shadow-md",
                                        children: [
                                            "Mark: ",
                                            achievedMarks,
                                            "/",
                                            totalMarks
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("h3", {
                                    className: "text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center",
                                    children: [
                                        "Feedback",
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                            className: "ml-2 text-xs text-gray-500 dark:text-gray-400",
                                            children: [
                                                "by ",
                                                modelName
                                            ]
                                        }),
                                        hasMarkScheme && /*#__PURE__*/ (0,jsx_runtime.jsx)(badge/* Badge */.E, {
                                            variant: "outline",
                                            className: "ml-2 px-1.5 py-0 text-[10px] bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900/50",
                                            children: "Mark Scheme Analysis"
                                        })
                                    ]
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipProvider */.Bc, {
                                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(tooltip/* Tooltip */.m_, {
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipTrigger */.k$, {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                                variant: "ghost",
                                                size: "sm",
                                                onClick: ()=>window.location.reload(),
                                                className: "h-8 w-8 p-0 rounded-full",
                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_cw/* default */.A, {
                                                    className: "h-4 w-4 text-gray-600 dark:text-gray-400"
                                                })
                                            })
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipContent */.ZI, {
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                children: "Try a different model"
                                            })
                                        })
                                    ]
                                })
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(DropdownMenu, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipProvider */.Bc, {
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(tooltip/* Tooltip */.m_, {
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipTrigger */.k$, {
                                                    asChild: true,
                                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(DropdownMenuTrigger, {
                                                        asChild: true,
                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                                            variant: "ghost",
                                                            size: "sm",
                                                            className: "h-8 w-8 p-0 rounded-full",
                                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(share_2/* default */.A, {
                                                                className: "h-4 w-4 text-gray-600 dark:text-gray-400"
                                                            })
                                                        })
                                                    })
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipContent */.ZI, {
                                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                        children: "Share feedback"
                                                    })
                                                })
                                            ]
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(DropdownMenuContent, {
                                        align: "end",
                                        className: "w-56",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(DropdownMenuLabel, {
                                                children: "Share Feedback"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(DropdownMenuSeparator, {}),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(DropdownMenuItem, {
                                                onClick: ()=>handleShare('clipboard'),
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(copy/* default */.A, {
                                                        className: "mr-2 h-4 w-4"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        children: "Copy to clipboard"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(DropdownMenuItem, {
                                                onClick: ()=>handleShare('email'),
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(mail/* default */.A, {
                                                        className: "mr-2 h-4 w-4"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        children: "Share via email"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(DropdownMenuItem, {
                                                onClick: ()=>handleShare('twitter'),
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(twitter/* default */.A, {
                                                        className: "mr-2 h-4 w-4"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        children: "Share on Twitter"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(DropdownMenuItem, {
                                                onClick: ()=>handleShare('facebook'),
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(facebook/* default */.A, {
                                                        className: "mr-2 h-4 w-4"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        children: "Share on Facebook"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(DropdownMenuSeparator, {}),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(DropdownMenuItem, {
                                                onClick: handleSaveAsPdf,
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(download/* default */.A, {
                                                        className: "mr-2 h-4 w-4"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        children: "Save as PDF"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(DropdownMenuItem, {
                                                onClick: handlePrint,
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(printer/* default */.A, {
                                                        className: "mr-2 h-4 w-4"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        children: "Print feedback"
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                ref: feedbackRef,
                className: "prose prose-sm dark:prose-invert prose-p:my-2 prose-h1:text-xl prose-h1:my-3 prose-h2:text-lg prose-h2:my-3 prose-h3:text-base prose-h3:font-semibold prose-h3:my-2.5 max-w-none bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(MathMarkdown, {
                    children: feedback
                })
            }),
            followUpEnabled && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "mt-6 border-t border-gray-200 dark:border-gray-700 pt-4",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("h4", {
                                    className: "text-base font-semibold mb-1 flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_help/* default */.A, {
                                            className: "h-4 w-4 mr-1.5 text-primary"
                                        }),
                                        "Need more help understanding this feedback?"
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "text-sm text-muted-foreground",
                                    children: "Ask a follow-up question about anything you didn't understand in the feedback."
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                            onClick: onAskFollowUp,
                            className: "whitespace-nowrap",
                            children: "Ask Follow-Up Question"
                        })
                    ]
                })
            })
        ]
    });
};
// Add this component for displaying the Model Thinking Process
const ModelThinkingBox = (param)=>{
    let { thinking, loading } = param;
    // If loading and no thinking content yet, show a generic loading message
    if (loading && (!thinking || thinking.length === 0)) {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            className: "absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg p-4",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)(loader_circle/* default */.A, {
                    className: "h-8 w-8 animate-spin text-indigo-500 mb-3"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                    className: "text-sm font-medium text-gray-700 dark:text-gray-300",
                    children: "Model is thinking..."
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                    className: "text-xs text-gray-500 dark:text-gray-400 mt-1",
                    children: "Please wait while the AI processes your request."
                })
            ]
        });
    }
    // If there is thinking content, display it
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(AnimatePresence/* AnimatePresence */.N, {
        children: thinking && thinking.length > 0 && /*#__PURE__*/ (0,jsx_runtime.jsxs)(proxy/* motion */.P.div, {
            initial: {
                opacity: 0,
                y: 10
            },
            animate: {
                opacity: 1,
                y: 0
            },
            exit: {
                opacity: 0,
                y: 10
            },
            transition: {
                duration: 0.3
            },
            className: "absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex flex-col items-center justify-center z-10 rounded-lg p-6 shadow-xl border border-gray-200 dark:border-gray-700",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "flex items-center mb-3",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(zap/* default */.A, {
                            className: "h-6 w-6 text-yellow-500 mr-2"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                            className: "text-lg font-semibold text-gray-800 dark:text-gray-200",
                            children: "Model Thinking Process"
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)(scroll_area/* ScrollArea */.F, {
                    className: "h-[120px] w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-3 text-sm",
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)("ul", {
                        className: "space-y-1.5 text-gray-700 dark:text-gray-300",
                        children: thinking.map((thought, index)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)(MotionListItem, {
                                initial: {
                                    opacity: 0,
                                    x: -10
                                },
                                animate: {
                                    opacity: 1,
                                    x: 0
                                },
                                transition: {
                                    delay: index * 0.1
                                },
                                className: "flex items-start",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_check/* default */.A, {
                                        className: "h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                        children: thought
                                    })
                                ]
                            }, index))
                    })
                }),
                loading && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "flex items-center mt-3 text-xs text-gray-500 dark:text-gray-400",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(loader_circle/* default */.A, {
                            className: "h-3 w-3 animate-spin mr-1.5"
                        }),
                        "Still processing..."
                    ]
                })
            ]
        })
    });
};
// New FeedbackDisplay component to organize the tab content
const FeedbackDisplay = (param)=>{
    let { loading, feedback, grade, selectedModel, modelThinking, achievedMarks, totalMarks, processingProgress, setActiveTab, markScheme, onAskFollowUp, followUpEnabled = true } = param;
    var _AI_MODELS_find;
    // Get the model name for display
    const modelName = ((_AI_MODELS_find = AI_MODELS.find((m)=>m.value === selectedModel)) === null || _AI_MODELS_find === void 0 ? void 0 : _AI_MODELS_find.label) || 'AI';
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(ProgressIndicator, {
                loading: loading,
                progress: processingProgress
            }),
            (loading || modelThinking) && selectedModel === "microsoft/mai-ds-r1:free" && /*#__PURE__*/ (0,jsx_runtime.jsx)(ModelThinkingBox, {
                thinking: modelThinking,
                loading: loading
            }),
            feedback ? /*#__PURE__*/ (0,jsx_runtime.jsx)(EnhancedFeedback, {
                feedback: feedback,
                grade: grade,
                modelName: modelName,
                achievedMarks: achievedMarks,
                totalMarks: totalMarks,
                hasMarkScheme: !!markScheme,
                onAskFollowUp: onAskFollowUp,
                followUpEnabled: followUpEnabled
            }) : loading ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "min-h-[300px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-lg bg-muted/20",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                        className: "text-lg font-medium",
                        children: "Generating Feedback..."
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "text-muted-foreground max-w-md mt-2",
                        children: "Please wait while the AI analyzes your answer. This may take up to 90 seconds depending on the model selected."
                    })
                ]
            }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "min-h-[300px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-lg bg-muted/20",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "mb-4 p-3 rounded-full bg-muted",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_help/* default */.A, {
                            className: "h-6 w-6 text-muted-foreground"
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                        className: "text-lg font-medium",
                        children: "No Feedback Yet"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "text-muted-foreground max-w-md mb-6",
                        children: 'Enter your question and answer in the Answer tab, then click "Mark Answer" to receive AI feedback and a GCSE grade.'
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                        variant: "outline",
                        onClick: ()=>setActiveTab("answer"),
                        className: "text-sm",
                        children: "Go to Answer Tab"
                    })
                ]
            })
        ]
    });
};
// Add a hook to detect viewport size
const useViewport = ()=>{
    const [viewportSize, setViewportSize] = useState({
        width:  true ? window.innerWidth : 0,
        height:  true ? window.innerHeight : 0
    });
    useEffect(()=>{
        const handleResize = ()=>{
            setViewportSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        if (true) {
            window.addEventListener('resize', handleResize);
            // Initial call
            handleResize();
            return ()=>window.removeEventListener('resize', handleResize);
        }
    }, []);
    return viewportSize;
};
// Add QuickGuide component definition before the main component
const QuickGuide = (param)=>{
    let { onClose } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "mb-6 bg-white dark:bg-gray-900 rounded-lg border shadow-sm overflow-hidden",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex justify-between items-center bg-blue-50 dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 p-3",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "text-lg font-semibold text-blue-800 dark:text-blue-300",
                                children: "Quick Guide"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "text-sm text-blue-600 dark:text-blue-400",
                                children: "How to use the GCSE AI Marker"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                        variant: "ghost",
                        size: "sm",
                        className: "text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 h-8 w-8 p-0 rounded-full",
                        onClick: onClose,
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(x/* default */.A, {
                                className: "h-5 w-5"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                className: "sr-only",
                                children: "Close"
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "p-4",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("ol", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("li", {
                                className: "flex gap-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium",
                                        children: "1"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-gray-700 dark:text-gray-300",
                                        children: "Enter your question and answer in the text boxes."
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("li", {
                                className: "flex gap-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium",
                                        children: "2"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-gray-700 dark:text-gray-300",
                                        children: "Select the subject, exam board, and question type."
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("li", {
                                className: "flex gap-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium",
                                        children: "3"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-gray-700 dark:text-gray-300",
                                        children: 'Click "Mark Answer" to get AI feedback.'
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("li", {
                                className: "flex gap-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium",
                                        children: "4"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-gray-700 dark:text-gray-300",
                                        children: "Review the feedback and grade provided."
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("li", {
                                className: "flex gap-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium",
                                        children: "5"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-gray-700 dark:text-gray-300",
                                        children: "Optionally save, share or print your feedback."
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mt-6 pt-4 border-t border-border",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "font-medium text-base mb-3 text-gray-800 dark:text-gray-200",
                                children: "Quick Tips"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("ul", {
                                className: "text-sm text-gray-600 dark:text-gray-400 space-y-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("li", {
                                        className: "flex items-start",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(chevron_right/* default */.A, {
                                                className: "h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                children: "Enter both the question and your full answer for accurate marking."
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("li", {
                                        className: "flex items-start",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(chevron_right/* default */.A, {
                                                className: "h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                children: "Select the correct subject and exam board for tailored feedback."
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("li", {
                                        className: "flex items-start",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(chevron_right/* default */.A, {
                                                className: "h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                children: "For image uploads, ensure the text is clear and readable."
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("li", {
                                        className: "flex items-start",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(chevron_right/* default */.A, {
                                                className: "h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                children: "The AI models are good, but always cross-reference with official materials."
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("li", {
                                        className: "flex items-start",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(chevron_right/* default */.A, {
                                                className: "h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                children: "Wait for the backend to wake up when you first visit the site (may take up to 60 seconds)"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
};
// Define keys for localStorage
const LOCALSTORAGE_KEYS = {
    QUESTION: 'aimarker_question',
    ANSWER: 'aimarker_answer',
    SUBJECT: 'aimarker_subject',
    EXAM_BOARD: 'aimarker_examBoard',
    MODEL: 'aimarker_model',
    TIER: 'aimarker_tier'
};
// ADDED: Enhanced Bulk Item Preview Dialog component
const BulkItemPreviewDialog = (param)=>{
    let { open, onOpenChange, item, onClose } = param;
    var _AI_MODELS_find;
    if (!item) return null;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(Dialog, {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(DialogContent, {
            className: "sm:max-w-[700px] max-h-[80vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsxs)(DialogHeader, {
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(DialogTitle, {
                            children: [
                                "Item ",
                                item.itemIndex + 1,
                                " Details"
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(DialogDescription, {
                            children: "Full question, answer and feedback details"
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "space-y-4 my-4",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "border-b pb-2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                    className: "font-medium text-lg",
                                    children: "Question"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "mt-1",
                                    children: item.question
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "border-b pb-2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                    className: "font-medium text-lg",
                                    children: "Answer"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "mt-1",
                                    children: item.answer
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "border-b pb-2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                    className: "font-medium text-lg",
                                    children: "Feedback"
                                }),
                                item.error ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(Alert, {
                                    variant: "destructive",
                                    className: "mt-2",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(triangle_alert/* default */.A, {
                                            className: "h-4 w-4"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(AlertTitle, {
                                            children: "Error"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(AlertDescription, {
                                            children: item.error
                                        })
                                    ]
                                }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: "mt-1 prose prose-sm dark:prose-invert max-w-none",
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(MathMarkdown, {
                                        children: item.feedback
                                    })
                                })
                            ]
                        }),
                        !item.error && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "font-medium mr-2",
                                            children: "Grade:"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                            className: "inline-flex items-center justify-center h-8 w-8 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-bold rounded-full shadow-md",
                                            children: item.grade || 'N/A'
                                        })
                                    ]
                                }),
                                item.achievedMarks && item.totalMarks && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "font-medium mr-2",
                                            children: "Marks:"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                            className: "px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full",
                                            children: [
                                                item.achievedMarks,
                                                "/",
                                                item.totalMarks
                                            ]
                                        })
                                    ]
                                }),
                                item.modelName && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "text-sm text-muted-foreground",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "font-medium",
                                            children: "Model:"
                                        }),
                                        " ",
                                        ((_AI_MODELS_find = AI_MODELS.find((m)=>m.value === item.modelName)) === null || _AI_MODELS_find === void 0 ? void 0 : _AI_MODELS_find.label) || item.modelName
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)(DialogFooter, {
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                        onClick: onClose,
                        children: "Close"
                    })
                })
            ]
        })
    });
};
// MODIFIED: BatchProcessingControls component with parallelism setting
const BatchProcessingControls = (param)=>{
    let { isProcessing, progress, onPause, onResume, onCancel, isPaused, parallelism, onParallelismChange } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "flex flex-col space-y-3 mt-2 mb-4",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "w-full bg-muted rounded-full h-2.5",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                    className: "bg-primary h-2.5 rounded-full transition-all duration-300",
                    style: {
                        width: "".concat(Math.round(progress.processed / progress.total * 100), "%")
                    }
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex justify-between items-center text-xs text-muted-foreground",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                        children: [
                            "Processing ",
                            progress.processed,
                            " of ",
                            progress.total,
                            " items"
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                        children: [
                            Math.round(progress.processed / progress.total * 100),
                            "% complete"
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex flex-wrap gap-2 justify-between items-center",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(label/* Label */.J, {
                                htmlFor: "parallelism",
                                className: "text-xs whitespace-nowrap",
                                children: "Parallel Tasks:"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_select/* Select */.l6, {
                                value: parallelism.toString(),
                                onValueChange: (value)=>onParallelismChange(parseInt(value)),
                                disabled: isProcessing,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectTrigger */.bq, {
                                        className: "h-7 w-16 text-xs",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectValue */.yv, {
                                            placeholder: parallelism
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_select/* SelectContent */.gC, {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                value: "1",
                                                children: "1"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                value: "2",
                                                children: "2"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                value: "3",
                                                children: "3"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                value: "4",
                                                children: "4"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex gap-2",
                        children: [
                            isPaused ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                                size: "sm",
                                variant: "outline",
                                onClick: onResume,
                                disabled: !isProcessing,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_cw/* default */.A, {
                                        className: "mr-1.5 h-3.5 w-3.5"
                                    }),
                                    "Resume"
                                ]
                            }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                                size: "sm",
                                variant: "outline",
                                onClick: onPause,
                                disabled: !isProcessing,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(pause/* default */.A, {
                                        className: "mr-1.5 h-3.5 w-3.5"
                                    }),
                                    "Pause"
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                                size: "sm",
                                variant: "outline",
                                onClick: onCancel,
                                disabled: !isProcessing,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(x/* default */.A, {
                                        className: "mr-1.5 h-3.5 w-3.5"
                                    }),
                                    "Cancel"
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
};
// Enhanced AIMarker component with mobile responsiveness
const AIMarker = ()=>{
    var _allSubjects_find, _EXAM_BOARDS_find, _allSubjects_find1, _allSubjects_find2;
    // console.log('AIMarker component is rendering', { window: typeof window !== 'undefined' ? window.location.hostname : 'SSR' });
    (0,react.useEffect)(()=>{
        console.log("Using API URL: ".concat(API_BASE_URL), "GitHub Pages: ".concat(isGHPages));
        if ( true && !window.BACKEND_STATUS) {
            window.BACKEND_STATUS = {
                status: 'checking',
                lastChecked: null
            };
        }
    }, []);
    // State for form inputs and data
    const [question, setQuestion] = (0,react.useState)("");
    const [answer, setAnswer] = (0,react.useState)("");
    const [subject, setSubject] = (0,react.useState)("english");
    const [examBoard, setExamBoard] = (0,react.useState)("aqa");
    const [questionType, setQuestionType] = (0,react.useState)("general"); // Not persisted for now, resets with subject/board
    const [userType, setUserType] = (0,react.useState)("student"); // Not persisted for now
    const [markScheme, setMarkScheme] = (0,react.useState)("");
    const [image, setImage] = (0,react.useState)(null);
    const [activeTab, setActiveTab] = (0,react.useState)("answer");
    const [customSubject, setCustomSubject] = (0,react.useState)("");
    const [isAddingSubject, setIsAddingSubject] = (0,react.useState)(false);
    const [customSubjects, setCustomSubjects] = (0,react.useState)([]);
    const [allSubjects, setAllSubjects] = (0,react.useState)(SUBJECTS);
    const customSubjectInputRef = (0,react.useRef)(null);
    const [totalMarks, setTotalMarks] = (0,react.useState)("");
    const [textExtract, setTextExtract] = (0,react.useState)("");
    const [relevantMaterial, setRelevantMaterial] = (0,react.useState)("");
    const [relevantMaterialImage, setRelevantMaterialImage] = (0,react.useState)(null);
    const [relevantMaterialImageBase64, setRelevantMaterialImageBase64] = (0,react.useState)(null);
    const [relevantMaterialImageLoading, setRelevantMaterialImageLoading] = (0,react.useState)(false);
    const [modelThinking, setModelThinking] = (0,react.useState)("");
    const [showKeyboardShortcuts, setShowKeyboardShortcuts] = (0,react.useState)(false);
    const [isGitHubPages, setIsGitHubPages] = (0,react.useState)(false);
    const [tier, setTier] = (0,react.useState)("higher");
    const [achievedMarks, setAchievedMarks] = (0,react.useState)(null);
    const [ocrTextPreview, setOcrTextPreview] = (0,react.useState)("");
    const [showOcrPreviewDialog, setShowOcrPreviewDialog] = (0,react.useState)(false);
    const [hasExtractedText, setHasExtractedText] = (0,react.useState)(false); // Add this line
    // ADDED: State for Subject Guidance Dialog
    const [showSubjectGuidanceDialog, setShowSubjectGuidanceDialog] = (0,react.useState)(false);
    const [currentSubjectGuidance, setCurrentSubjectGuidance] = (0,react.useState)("");
    const { checkBackendStatus: refreshBackendStatusHook } = (0,aimarker_hooks/* useBackendStatus */.Q)(API_BASE_URL); // Alias for clarity
    // ADDED: State for Bulk Assessment
    const [bulkFile, setBulkFile] = (0,react.useState)(null);
    const [bulkItems, setBulkItems] = (0,react.useState)([]); // Array of {question, answer, subject?, examBoard?, ...}
    const [bulkResults, setBulkResults] = (0,react.useState)([]); // Array of {itemIndex, feedback, grade, error?
    const [bulkProcessing, setBulkProcessing] = (0,react.useState)(false);
    const [bulkSettingPreference, setBulkSettingPreference] = (0,react.useState)('global'); // 'global' or 'file'
    const [bulkProgress, setBulkProgress] = (0,react.useState)({
        processed: 0,
        total: 0,
        currentItem: null
    });
    const bulkFileUploadRef = (0,react.useRef)(null);
    // ADDED: State for Bulk Item Preview
    const [previewItem, setPreviewItem] = (0,react.useState)(null);
    const [showPreviewDialog, setShowPreviewDialog] = (0,react.useState)(false);
    // ADDED: State for batch processing controls
    const [isBulkProcessingPaused, setIsBulkProcessingPaused] = (0,react.useState)(false);
    const bulkProcessingRef = (0,react.useRef)({
        cancel: false,
        pause: false
    });
    // ADDED: State for parallel processing
    const [parallelProcessing, setParallelProcessing] = (0,react.useState)(1);
    // ADDED: State for follow-up dialog
    const [showFollowUpDialog, setShowFollowUpDialog] = (0,react.useState)(false);
    const [followUpQuestion, setFollowUpQuestion] = (0,react.useState)("");
    const [followUpResponse, setFollowUpResponse] = (0,react.useState)("");
    const [followUpLoading, setFollowUpLoading] = (0,react.useState)(false);
    // Handle image upload
    const handleImageChange = (e)=>{
        if (e.target.files && e.target.files[0]) {
            const selectedImage1 = e.target.files[0];
            setImage(selectedImage1);
            // Clear previous preview and reset model visibility
            setOcrTextPreview("");
            setHasExtractedText(false);
        }
    };
    // Handle relevant material image upload
    const handleRelevantMaterialImageChange = (e)=>{
        if (e.target.files && e.target.files[0]) {
            const selectedImage1 = e.target.files[0];
            setRelevantMaterialImage(selectedImage1);
            setRelevantMaterialImageLoading(true);
            // Convert image to base64 for Gemini API
            const reader = new FileReader();
            reader.onloadend = ()=>{
                const base64String = reader.result.split(',')[1];
                setRelevantMaterialImageBase64(base64String);
                setRelevantMaterialImageLoading(false);
                sonner_dist/* toast */.oR.success("Image added as relevant material");
            };
            reader.onerror = ()=>{
                setRelevantMaterialImageLoading(false);
                sonner_dist/* toast */.oR.error("Failed to process image");
            };
            reader.readAsDataURL(selectedImage1);
        }
    };
    // MODIFIED: Handle image processing - convert to text using AI OCR
    const handleProcessImage = async ()=>{
        if (!selectedImage) {
            sonner_dist/* toast */.oR.error("Please upload an image first");
            return;
        }
        try {
            sonner_dist/* toast */.oR.info("Processing image...");
            setProcessingStep("reading_image");
            setIsProcessing(true);
            setProcessingProgress(10);
            const formData = new FormData();
            formData.append('image', selectedImage);
            // Select the appropriate model for image processing based on exam board
            let ocrModel;
            if (examBoard === "ocr") {
                ocrModel = TASK_SPECIFIC_MODELS.image_processing.ocr;
                sonner_dist/* toast */.oR.info("Using OCR-specific model for processing");
            } else {
                ocrModel = TASK_SPECIFIC_MODELS.image_processing.default;
            }
            // Add the selected model to the form data
            formData.append('model', ocrModel);
            // Use the CORRECT backend URL when on GitHub Pages
            const isGitHubPagesEnv =  true && (window.location.hostname.includes('github.io') || window.location.hostname === 'beenycool.github.io');
            // Always use the remote server for GitHub Pages since GitHub Pages can't handle file uploads
            // The backend server REQUIRES the /api prefix in the URL
            const apiUrl = isGitHubPagesEnv ? 'https://beenycool-github-io.onrender.com/api/github/completions' : (0,api_helpers.constructApiUrl)('github/completions');
            setProcessingStep("analyzing_content");
            setProcessingProgress(30);
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error("OCR failed: ".concat(response.status, " ").concat(errorText));
            }
            const data = await response.json();
            // Add detailed debugging for API response
            console.log("API Response received:", data);
            if (data.choices && data.choices[0]) {
                console.log("First choice:", data.choices[0]);
                if (data.choices[0].message) {
                    console.log("Message content:", data.choices[0].message.content);
                }
            }
            if (data.text && data.text.trim() !== "") {
                setOcrTextPreview(data.text);
                setShowOcrPreviewDialog(true);
                sonner_dist/* toast */.oR.success("Image processed. Review extracted text.");
            } else {
                sonner_dist/* toast */.oR.warning("No text detected in image, or extracted text is empty.");
                setOcrTextPreview(""); // Clear preview if no text
            }
        } catch (error) {
            console.error('Error processing image:', error);
            setError({
                type: "api",
                message: "Failed to process image: ".concat(error.message)
            });
            sonner_dist/* toast */.oR.error("Failed to process image: " + error.message);
        } finally{
            setImageLoading(false);
        }
    };
    // ADDED: Handle OCR text confirmation
    const handleConfirmOcrText = ()=>{
        if (ocrTextPreview) {
            setAnswer((prev)=>{
                const separator = prev.trim() ? '\n\n' : '';
                return prev + separator + ocrTextPreview;
            });
            setHasExtractedText(true); // Set to true when text is confirmed
            sonner_dist/* toast */.oR.success("Text added to answer field.");
        }
        setShowOcrPreviewDialog(false);
    // setOcrTextPreview(""); // Optionally clear preview after adding
    };
    // UI state
    const [showGuide, setShowGuide] = (0,react.useState)(false);
    const [showAdvancedOptions, setShowAdvancedOptions] = (0,react.useState)(false);
    const [loading, setLoading] = (0,react.useState)(false);
    const [feedback, setFeedback] = (0,react.useState)("");
    const [grade, setGrade] = (0,react.useState)("");
    const [error, setError] = (0,react.useState)(null);
    const [success, setSuccess] = (0,react.useState)(null);
    const [detectedSubject, setDetectedSubject] = (0,react.useState)(null);
    const [shortcutFeedback, setShortcutFeedback] = (0,react.useState)(null);
    const [processingProgress, setProcessingProgress] = (0,react.useState)("");
    const [history, setHistory] = (0,react.useState)([]);
    // API and rate limiting
    const [lastRequestTime, setLastRequestTime] = (0,react.useState)(0);
    const [dailyRequests, setDailyRequests] = (0,react.useState)(0); // This seems locally managed, let's use getRequestTokens for display
    const [lastRequestDate, setLastRequestDate] = (0,react.useState)(new Date().toDateString());
    // Model options for testing:
    // "deepseek/deepseek-chat-v3-0324:free" - Balanced model
    // "microsoft/mai-ds-r1:free" - Thinking model
    // "xai/grok-3" - X AI model
    // "o4-mini" - O4 mini model
    // "gemini-2.5-flash-preview-04-17" - Gemini 2.5 Flash
    const [selectedModel, setSelectedModel] = (0,react.useState)("deepseek/deepseek-chat-v3-0324:free");
    const [modelLastRequestTimes, setModelLastRequestTimes] = (0,react.useState)({});
    const [imageLoading, setImageLoading] = (0,react.useState)(false);
    const [backendError, setBackendError] = (0,react.useState)(false);
    const helpButtonRef = (0,react.useRef)(null);
    const questionInputRef = (0,react.useRef)(null);
    const answerInputRef = (0,react.useRef)(null);
    const marksInputRef = (0,react.useRef)(null);
    const markSchemeButtonRef = (0,react.useRef)(null);
    const submitButtonRef = (0,react.useRef)(null);
    const hasManuallySetSubject = (0,react.useRef)(false);
    const backendStatusRef = (0,react.useRef)('checking');
    const currentModelForRequestRef = (0,react.useRef)(null);
    const [backendUpdated, setBackendUpdated] = (0,react.useState)(false);
    const [autoMaxTokens, setAutoMaxTokens] = (0,react.useState)(true);
    const [maxTokens, setMaxTokens] = (0,react.useState)(2048);
    const [remainingRequestTokens, setRemainingRequestTokens] = (0,react.useState)(0);
    const [thinkingBudget, setThinkingBudget] = (0,react.useState)(DEFAULT_THINKING_BUDGETS["deepseek/deepseek-chat-v3-0324:free"] || 1024);
    const [enableThinkingBudget, setEnableThinkingBudget] = (0,react.useState)(true);
    // Define the missing setCurrentModelForRequest function
    const setCurrentModelForRequest = (model)=>{
        currentModelForRequestRef.current = model;
        // Update thinking budget based on the selected model
        if (enableThinkingBudget && DEFAULT_THINKING_BUDGETS[model]) {
            setThinkingBudget(DEFAULT_THINKING_BUDGETS[model]);
        }
        // Track the last request time for this model
        setModelLastRequestTimes((prev)=>({
                ...prev,
                [model]: Date.now()
            }));
    };
    // Debounced save function for question and answer
    const debouncedSaveDraft = (0,react.useCallback)((q, a)=>{
        const debouncedFn = lodash_debounce_default()((question, answer)=>{
            localStorage.setItem(LOCALSTORAGE_KEYS.QUESTION, question);
            localStorage.setItem(LOCALSTORAGE_KEYS.ANSWER, answer);
        // console.log('Draft saved');
        }, 1500);
        debouncedFn(q, a);
    }, [] // No dependencies needed with this approach
    );
    // Effect for auto-saving question and answer drafts
    (0,react.useEffect)(()=>{
        if (question || answer) {
            debouncedSaveDraft(question, answer);
        }
    }, [
        question,
        answer,
        debouncedSaveDraft
    ]);
    // Token management for rate limiting
    const getRequestTokens = (0,react.useCallback)(()=>{
        const stored = localStorage.getItem('requestTokens');
        const now = new Date().toDateString();
        let tokens = stored ? JSON.parse(stored) : {
            count: 500,
            lastReset: now
        };
        if (tokens.lastReset !== now) {
            tokens = {
                count: 500,
                lastReset: now
            };
        }
        // Don't set localStorage here, do it in consumeToken or a dedicated update function
        // localStorage.setItem('requestTokens', JSON.stringify(tokens)); 
        return tokens;
    }, []);
    // Effect for loading persistent user preferences and drafts on initial mount
    (0,react.useEffect)(()=>{
        // Load drafts
        const savedQuestion = localStorage.getItem(LOCALSTORAGE_KEYS.QUESTION);
        const savedAnswer = localStorage.getItem(LOCALSTORAGE_KEYS.ANSWER);
        if (savedQuestion) setQuestion(savedQuestion);
        if (savedAnswer) setAnswer(savedAnswer);
        // Load preferences
        const savedSubject = localStorage.getItem(LOCALSTORAGE_KEYS.SUBJECT);
        if (savedSubject && SUBJECTS.find((s)=>s.value === savedSubject)) {
            setSubject(savedSubject);
        }
        const savedExamBoard = localStorage.getItem(LOCALSTORAGE_KEYS.EXAM_BOARD);
        if (savedExamBoard && EXAM_BOARDS.find((eb)=>eb.value === savedExamBoard)) {
            setExamBoard(savedExamBoard);
        }
        let initialModel = "gemini-2.5-flash-preview-05-20"; // Default model
        const savedModel = localStorage.getItem(LOCALSTORAGE_KEYS.MODEL);
        if (savedModel && AI_MODELS.find((m)=>m.value === savedModel)) {
            initialModel = savedModel;
        }
        if (selectedModel !== initialModel) {
            setSelectedModel(initialModel);
        }
        currentModelForRequestRef.current = initialModel;
        // Set thinking budget based on the effectively loaded model
        setThinkingBudget(DEFAULT_THINKING_BUDGETS[initialModel] || 1024);
        const savedTier = localStorage.getItem(LOCALSTORAGE_KEYS.TIER);
        if (savedTier === "higher" || savedTier === "foundation") {
            setTier(savedTier);
        }
        // Initialize remaining tokens display
        const tokens = getRequestTokens();
        setRemainingRequestTokens(tokens.count);
    }, [
        getRequestTokens,
        selectedModel
    ]); // Added selectedModel to dependencies
    // Effects for saving preferences to localStorage when they change
    (0,react.useEffect)(()=>{
        localStorage.setItem(LOCALSTORAGE_KEYS.SUBJECT, subject);
    }, [
        subject
    ]);
    (0,react.useEffect)(()=>{
        localStorage.setItem(LOCALSTORAGE_KEYS.EXAM_BOARD, examBoard);
    }, [
        examBoard
    ]);
    (0,react.useEffect)(()=>{
        localStorage.setItem(LOCALSTORAGE_KEYS.MODEL, selectedModel);
        // Update thinking budget only if different from current value
        const newThinkingBudget = DEFAULT_THINKING_BUDGETS[selectedModel] || 1024;
        if (thinkingBudget !== newThinkingBudget) {
            setThinkingBudget(newThinkingBudget);
        }
        // Keep the reference updated with the current model
        currentModelForRequestRef.current = selectedModel;
    }, [
        selectedModel,
        thinkingBudget
    ]);
    (0,react.useEffect)(()=>{
        localStorage.setItem(LOCALSTORAGE_KEYS.TIER, tier);
    }, [
        tier
    ]);
    // ADDED: Effect to initialize and update remaining tokens display
    (0,react.useEffect)(()=>{
        const tokens = getRequestTokens();
        setRemainingRequestTokens(tokens.count);
    }, [
        getRequestTokens
    ]);
    const consumeToken = (0,react.useCallback)(()=>{
        const tokens = getRequestTokens();
        if (tokens.count <= 0) return false;
        tokens.count -= 1;
        localStorage.setItem('requestTokens', JSON.stringify(tokens));
        setRemainingRequestTokens(tokens.count); // Update display state
        return true;
    }, [
        getRequestTokens
    ]);
    // Handler for backend status changes
    const handleBackendStatusChange = (0,react.useCallback)((status, data)=>{
        console.log('Backend status changed:', status, data);
        backendStatusRef.current = status;
        // setBackendUpdated(prev => !prev); // REMOVE THIS LINE to prevent potential loop
        // If backend is offline, show appropriate error
        if (status === 'offline' || status === 'error') {
            setBackendError(true);
        } else {
            setBackendError(false);
        }
    }, []);
    // Fix: Using custom hooks for subject classification and backend status
    const { classifySubjectAI, debouncedClassifySubject } = (0,aimarker_hooks/* useSubjectDetection */.h)(subjectKeywords, loading);
    const { checkBackendStatus } = (0,aimarker_hooks/* useBackendStatus */.Q)(API_BASE_URL);
    // Special handling for GitHub Pages environment
    (0,react.useEffect)(()=>{
        if (true) {
            const isGitHubPagesHost = window.location.hostname.includes('github.io') || window.location.hostname === 'beenycool.github.io';
            setIsGitHubPages(isGitHubPagesHost);
            if (isGitHubPagesHost) {
                console.log('Running on GitHub Pages - simulating online status for UI rendering (mount effect)');
                backendStatusRef.current = 'online';
            // REMOVED: setBackendUpdated(prev => !prev); // This was likely causing the loop
            }
        }
    }, []); // Empty dependency array to run only on mount
    // Effect for automatic subject detection based on question and answer
    (0,react.useEffect)(()=>{
        if (question.length > 20 && !hasManuallySetSubject.current && !loading) {
            // Ensure both question and answer are passed for detection
            debouncedClassifySubject(question + " " + answer, subject, hasManuallySetSubject, allSubjects, setSubject, setDetectedSubject, setSuccess);
        }
    // Add answer to dependency array
    }, [
        question,
        answer,
        debouncedClassifySubject,
        subject,
        loading,
        allSubjects,
        setDetectedSubject,
        setSuccess,
        hasManuallySetSubject
    ]);
    // ======== MAIN FUNCTIONS ========
    // Add the missing addCustomSubject function
    const addCustomSubject = ()=>{
        if (!customSubject.trim()) return;
        const newSubjectValue = customSubject.toLowerCase().replace(/\s+/g, '');
        const newSubject = {
            value: newSubjectValue,
            label: customSubject.trim()
        };
        // Add to both state arrays
        setCustomSubjects((prev)=>[
                ...prev,
                newSubject
            ]);
        setAllSubjects((prev)=>[
                ...prev,
                newSubject
            ]);
        // Set as current selection
        setSubject(newSubjectValue);
        hasManuallySetSubject.current = true;
        // Reset custom subject input and hide the add input
        setCustomSubject('');
        setIsAddingSubject(false);
        // Focus back on the select after adding
        setTimeout(()=>{
            if (customSubjectInputRef.current) {
                customSubjectInputRef.current.blur();
            }
        }, 10);
    };
    // Submit handler
    // Define the prompt building functions
    const buildSystemPrompt = ()=>{
        var _allSubjects_find;
        // System prompt logic based on component state
        console.log("AIMarker state for system prompt:", {
            subject,
            examBoard,
            questionType,
            userType,
            markScheme,
            totalMarks,
            textExtract,
            relevantMaterial,
            tier,
            allSubjects
        });
        let prompt = "You are an AI assistant specialized in educational assessment.";
        if (userType) prompt += " You are acting as a ".concat(userType, ".");
        if (subject) prompt += " Your current task is to assess a piece of work for the subject: ".concat(subject, ".");
        if (allSubjects && ((_allSubjects_find = allSubjects.find((s)=>s.value === subject)) === null || _allSubjects_find === void 0 ? void 0 : _allSubjects_find.hasTiers) && tier) {
            prompt += " The work is for the ".concat(tier, " tier.");
        }
        if (examBoard) prompt += " The examination board is ".concat(examBoard, ".");
        if (questionType && questionType !== "general") {
            var _QUESTION_TYPES_subject_examBoard, _QUESTION_TYPES_subject;
            const selectedQuestionType = (_QUESTION_TYPES_subject = QUESTION_TYPES[subject]) === null || _QUESTION_TYPES_subject === void 0 ? void 0 : (_QUESTION_TYPES_subject_examBoard = _QUESTION_TYPES_subject[examBoard]) === null || _QUESTION_TYPES_subject_examBoard === void 0 ? void 0 : _QUESTION_TYPES_subject_examBoard.find((qt)=>qt.value === questionType);
            if (selectedQuestionType) {
                prompt += " Specifically, this is for ".concat(selectedQuestionType.label, ".");
            }
        }
        if (totalMarks) prompt += " The question is out of ".concat(totalMarks, " marks.");
        if (markScheme) prompt += "\n\nThe following mark scheme should be used as a guide if available:\n```\n".concat(markScheme, "\n```\n");
        if (textExtract) prompt += "\n\nA text extract has been provided and may be relevant:\n```\n".concat(textExtract, "\n```\n");
        if (relevantMaterial) prompt += "\n\nOther relevant material to consider:\n```\n".concat(relevantMaterial, "\n```\n");
        prompt += "\nYour primary goal is to provide constructive feedback and a grade based on the user's answer to the question. Adhere to the provided mark scheme if available.";
        return prompt;
    };
    const buildUserPrompt = ()=>{
        // User prompt logic based on component state
        console.log("AIMarker state for user prompt:", {
            question,
            answer,
            totalMarks,
            subject,
            examBoard,
            questionType,
            textExtract,
            relevantMaterial,
            relevantMaterialImageBase64
        });
        let prompt = "Please assess the following student's answer.\n\n";
        if (question) {
            prompt += "**Question:**\n".concat(question, "\n\n");
        } else {
            prompt += "**Question:** [Not explicitly provided, infer from context if possible or provide general feedback on the answer below.]\n\n";
        }
        if (answer) {
            prompt += "**Student's Answer:**\n".concat(answer, "\n\n");
        } else {
            // This case should ideally be caught by validation, but as a fallback:
            prompt += "**Student's Answer:** [No answer provided. Please indicate that an answer is needed for assessment.]\n\n";
            return prompt; // Early exit if no answer
        }
        if (totalMarks) {
            prompt += "The question is out of **".concat(totalMarks, " marks**.\n\n");
        }
        if (textExtract) {
            prompt += "**Provided Text Extract (for context):**\n```\n".concat(textExtract, "\n```\n\n");
        }
        if (relevantMaterial) {
            prompt += "**Other Provided Relevant Material (for context):**\n```\n".concat(relevantMaterial, "\n```\n\n");
        }
        if (relevantMaterialImageBase64) {
            prompt += "**An image has also been provided with relevant material.** Please consider this in your assessment.\n\n";
        }
        prompt += "Based on all the information provided (including the system prompt context like subject, exam board, and mark scheme if available), please provide:\n";
        prompt += "1.  **Overall Feedback:** Constructive comments on the student's performance, highlighting strengths and areas for improvement.\n";
        prompt += "2.  **Mark Allocation (if applicable):** If a total mark is specified, suggest a mark out of the total. Briefly justify your mark allocation against the mark scheme or assessment criteria.\n";
        prompt += "3.  **Specific Pointers:** Bullet points on specific aspects of the answer, referencing parts of the mark scheme or good practice where appropriate.\n";
        prompt += "4.  **Actionable Advice:** Suggestions for how the student can improve in the future.\n\n";
        prompt += "Present the feedback clearly and concisely. If a mark scheme was provided in the system prompt, ensure your feedback aligns with it.";
        return prompt;
    };
    const handleSubmitForMarking = (0,react.useCallback)(async ()=>{
        var _AI_MODELS_find;
        // Clear previous feedback and errors
        setFeedback(""); // Clear feedback before streaming
        setGrade("");
        setError(null);
        setSuccess(null);
        setModelThinking("");
        setAchievedMarks(null);
        // Determine the model to use for this request
        const modelForSubjectAssessment = TASK_SPECIFIC_MODELS.subject_assessment;
        const effectiveModel = subject && modelForSubjectAssessment ? modelForSubjectAssessment : selectedModel;
        setCurrentModelForRequest(effectiveModel);
        // Validate inputs
        if (!answer) {
            setError({
                type: "validation",
                message: "Please enter an answer to be marked"
            });
            return;
        }
        setLoading(true);
        setActiveTab("feedback");
        setSuccess({
            message: "Initiating request..."
        }); // Initial message
        // Backend status check (simplified for brevity, assuming it's handled)
        const backendStatus = await checkBackendStatus(selectedModel);
        if (!backendStatus.ok) {
            setLoading(false);
            setError({
                type: "network",
                message: "Backend connection error: ".concat(backendStatus.error, ". Please try again."),
                retry: true
            });
            return;
        }
        // Rate limiting checks
        const now = Date.now();
        const modelRateLimit = MODEL_RATE_LIMITS[currentModelForRequestRef.current] || 10000;
        const modelLastRequestTime = modelLastRequestTimes[currentModelForRequestRef.current] || 0;
        if (now - modelLastRequestTime < modelRateLimit) {
            setLoading(false);
            const waitTimeSeconds = Math.ceil((modelRateLimit - (now - modelLastRequestTime)) / 1000);
            const fallback = FALLBACK_MODELS[currentModelForRequestRef.current];
            if (fallback) {
                var _AI_MODELS_find1;
                setError({
                    type: "rate_limit_with_fallback",
                    message: "".concat((_AI_MODELS_find1 = AI_MODELS.find((m)=>m.value === currentModelForRequestRef.current)) === null || _AI_MODELS_find1 === void 0 ? void 0 : _AI_MODELS_find1.label, " is rate limited. Try fallback or wait ").concat(waitTimeSeconds, "s."),
                    fallbackModel: fallback,
                    onRetryFallback: (newModel)=>{
                        var _AI_MODELS_find;
                        setSelectedModel(newModel); // This will trigger a re-render and user can click submit again
                        sonner_dist/* toast */.oR.info("Switched to ".concat((_AI_MODELS_find = AI_MODELS.find((m)=>m.value === newModel)) === null || _AI_MODELS_find === void 0 ? void 0 : _AI_MODELS_find.label, '. Click "Get Feedback" again.'));
                    },
                    onRetry: ()=>handleSubmitForMarking(),
                    waitTime: waitTimeSeconds
                });
            } else {
                var _AI_MODELS_find2;
                setError({
                    type: "rate_limit_wait",
                    message: "".concat((_AI_MODELS_find2 = AI_MODELS.find((m)=>m.value === currentModelForRequestRef.current)) === null || _AI_MODELS_find2 === void 0 ? void 0 : _AI_MODELS_find2.label, " is limited. Wait ").concat(waitTimeSeconds, "s."),
                    waitTime: waitTimeSeconds,
                    onRetry: ()=>handleSubmitForMarking()
                });
            }
            return;
        }
        // Token consumption check
        if (!consumeToken()) {
            setLoading(false);
            setError({
                type: "rate_limit",
                message: "Daily request limit reached (500/day)"
            });
            return;
        }
        setModelLastRequestTimes((prev)=>({
                ...prev,
                [currentModelForRequestRef.current]: now
            }));
        setLastRequestTime(now); // Update general last request time
        const systemPrompt = buildSystemPrompt();
        const userPrompt = buildUserPrompt();
        setProcessingProgress("Sending request to AI model...");
        setSuccess({
            message: "Processing with ".concat(((_AI_MODELS_find = AI_MODELS.find((m)=>m.value === currentModelForRequestRef.current)) === null || _AI_MODELS_find === void 0 ? void 0 : _AI_MODELS_find.label) || currentModelForRequestRef.current, "...")
        });
        try {
            const requestBodyPayload = {
                model: currentModelForRequestRef.current.startsWith("openai/") || currentModelForRequestRef.current.startsWith("xai/") ? currentModelForRequestRef.current : "xai/grok-3",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: userPrompt
                    }
                ],
                temperature: 0.7,
                top_p: 1.0,
                stream: true
            };
            // Add image if relevant for Gemini (assuming /api/github/completions handles this)
            if (currentModelForRequestRef.current.startsWith("gemini") && relevantMaterialImage && relevantMaterialImageBase64) {
                // The backend /api/github/completions needs to be adapted to pass this to Gemini if it's the intermediary
                // For simplicity, we assume the backend handles this structure.
                // This part might need adjustment based on how the backend expects image data for Gemini streams.
                requestBodyPayload.messages[1].content += "\n\nIMAGE PROVIDED: An image has been attached. Please analyze this image.";
            // The actual image data would need to be handled by the backend if it's proxying to Gemini.
            // If hitting Gemini directly, the payload structure for images with streaming would be different.
            // For this exercise, we'll assume the backend's /github/completions is smart enough.
            }
            // Use the CORRECT backend URL when on GitHub Pages
            const isGitHubPagesEnv =  true && (window.location.hostname.includes('github.io') || window.location.hostname === 'beenycool.github.io');
            // Always use the remote server for GitHub Pages
            // The backend server REQUIRES the /api prefix in the URL
            const completionsApiUrl = isGitHubPagesEnv ? 'https://beenycool-github-io.onrender.com/api/github/completions' : (0,api_helpers.constructApiUrl)('github/completions');
            console.log('Sending completions request to:', completionsApiUrl);
            const response = await fetch(completionsApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream'
                },
                body: JSON.stringify(requestBodyPayload)
            });
            if (!response.ok) {
                const errorStatus = response.status;
                const errorText = await response.text();
                console.error("GitHub API error: ".concat(errorStatus), errorText);
                // Try to parse as JSON for structured error messages
                let parsedError = null;
                try {
                    parsedError = JSON.parse(errorText);
                } catch (e) {
                // Not JSON, use as plain text
                }
                // Handle specific error codes
                if (errorStatus === 401) {
                    setError({
                        type: "api_error",
                        message: "Authentication error with GitHub API. Please try a different model.",
                        onRetry: ()=>{
                            setSelectedModel("deepseek/deepseek-chat-v3-0324:free");
                            setCurrentModelForRequest("deepseek/deepseek-chat-v3-0324:free");
                            handleProcessImage();
                        }
                    });
                } else if (errorStatus === 404) {
                    // 404 commonly means the GitHub API key is missing or the endpoint is not available
                    setError({
                        type: "api_error",
                        message: "GitHub API is not available. Please try a different model.",
                        onRetry: ()=>{
                            setSelectedModel("deepseek/deepseek-chat-v3-0324:free");
                            setCurrentModelForRequest("deepseek/deepseek-chat-v3-0324:free");
                            handleProcessImage();
                        }
                    });
                } else {
                    const errorMessage = (parsedError === null || parsedError === void 0 ? void 0 : parsedError.error) || (parsedError === null || parsedError === void 0 ? void 0 : parsedError.message) || errorText || "Unknown error";
                    setError({
                        type: "api_error",
                        message: "API error (".concat(errorStatus, "): ").concat(errorMessage),
                        onRetry: errorStatus >= 500 ? ()=>handleProcessImage() : undefined
                    });
                }
                setLoading(false);
                return;
            }
            if (!response.ok) {
                const errorText = await response.text();
                let parsedError = {
                    message: "API request failed: ".concat(response.status)
                };
                try {
                    parsedError = JSON.parse(errorText);
                } catch (e) {}
                const fallback = FALLBACK_MODELS[currentModelForRequestRef.current];
                if (response.status === 429 && fallback) {
                    var _AI_MODELS_find3;
                    setError({
                        type: "rate_limit_with_fallback",
                        message: "Model ".concat((_AI_MODELS_find3 = AI_MODELS.find((m)=>m.value === currentModelForRequestRef.current)) === null || _AI_MODELS_find3 === void 0 ? void 0 : _AI_MODELS_find3.label, " API rate limited. Error: ").concat(parsedError.error || errorText),
                        fallbackModel: fallback,
                        onRetryFallback: (newModel)=>{
                            var _AI_MODELS_find;
                            setSelectedModel(newModel);
                            sonner_dist/* toast */.oR.info("Switched to ".concat((_AI_MODELS_find = AI_MODELS.find((m)=>m.value === newModel)) === null || _AI_MODELS_find === void 0 ? void 0 : _AI_MODELS_find.label, '. Click "Get Feedback" again.'));
                        },
                        onRetry: ()=>handleSubmitForMarking()
                    });
                } else {
                    setError({
                        type: "api_error",
                        message: "API Error: ".concat(parsedError.error || errorText),
                        onRetry: handleSubmitForMarking
                    });
                }
                setLoading(false);
                setProcessingProgress("");
                return;
            }
            setProcessingProgress("Receiving feedback stream...");
            setModelThinking("Receiving stream..."); // Indicate stream has started
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedChunk = "";
            while(true){
                const { value, done } = await reader.read();
                if (done) {
                    // Don't show "Stream finished" message as it overlaps with content
                    setProcessingProgress("");
                    setModelThinking("Stream complete.");
                    break; // Exit while loop
                }
                accumulatedChunk += decoder.decode(value, {
                    stream: true
                });
                let errorEncounteredInStream = false;
                let newlineIndex;
                while((newlineIndex = accumulatedChunk.indexOf('\n\n')) >= 0){
                    const eventBlock = accumulatedChunk.substring(0, newlineIndex);
                    accumulatedChunk = accumulatedChunk.substring(newlineIndex + 2);
                    const lines = eventBlock.split('\n');
                    for (const line of lines){
                        if (line.startsWith('event: error')) {
                            var _lines_find;
                            // Improved SSE error event handling
                            console.error("SSE stream error event received:", eventBlock);
                            const errorDataLineContent = (_lines_find = lines.find((l)=>l.startsWith('data: '))) === null || _lines_find === void 0 ? void 0 : _lines_find.substring(6);
                            let errorMessage = "Error in stream";
                            if (errorDataLineContent) {
                                try {
                                    const parsedError = JSON.parse(errorDataLineContent);
                                    errorMessage = parsedError.error || parsedError.message || "Unknown error from stream";
                                } catch (e) {
                                    errorMessage = "Malformed error data in stream";
                                }
                            }
                            setError({
                                type: "api_stream_error",
                                message: errorMessage,
                                onRetry: handleSubmitForMarking
                            });
                            errorEncounteredInStream = true;
                            break; // Break from inner for-loop (lines)
                        } else if (line.startsWith('data: ')) {
                            const jsonDataString = line.substring(6);
                            if (jsonDataString.trim() === '[DONE]') {
                                console.log('Stream signaled DONE.');
                                continue;
                            }
                            try {
                                const parsedData = JSON.parse(jsonDataString);
                                if (parsedData.choices && parsedData.choices[0] && parsedData.choices[0].delta && parsedData.choices[0].delta.content) {
                                    setFeedback((prev)=>prev + parsedData.choices[0].delta.content);
                                } else if (parsedData.text) {
                                    setFeedback((prev)=>prev + parsedData.text);
                                }
                            } catch (e) {
                                console.warn('Failed to parse streamed JSON data:', jsonDataString, e);
                            }
                        }
                    } // End of for-loop (lines)
                    if (errorEncounteredInStream) break; // Break from inner while-loop (eventBlock processing)
                } // End of inner while-loop (eventBlock processing)
                if (errorEncounteredInStream) {
                    setLoading(false); // Ensure loading is stopped
                    setProcessingProgress("Error occurred during stream.");
                    setModelThinking("Error processing stream.");
                    // Cleanly close the reader if possible
                    if (reader && typeof reader.cancel === 'function') {
                        reader.cancel().catch((cancelError)=>console.warn("Error cancelling reader:", cancelError));
                    }
                    break; // Break from outer while-loop (reader.read())
                }
            } // End of outer while (true) for SSE stream
        // Success message will be set in the useEffect after parsing
        } catch (error) {
            console.error("Error during streaming submission:", error);
            setError({
                type: "api_error",
                message: "Streaming Error: ".concat(error.message),
                onRetry: handleSubmitForMarking
            });
            setProcessingProgress("Error occurred.");
            setModelThinking("Error during stream.");
        } finally{
        // setLoading will be set to false in the useEffect after feedback processing
        // This ensures history saving and parsing happens *after* all stream data is in.
        }
    }, [
        answer,
        question,
        subject,
        examBoard,
        questionType,
        userType,
        markScheme,
        totalMarks,
        textExtract,
        relevantMaterial,
        selectedModel,
        tier,
        // Removed allSubjects, API_BASE_URL as they are outer scope values
        // Removed lastRequestDate, lastRequestTime, setDailyRequests, setLastRequestDate as they are not used directly
        modelLastRequestTimes,
        consumeToken,
        buildSystemPrompt,
        buildUserPrompt,
        relevantMaterialImage,
        relevantMaterialImageBase64,
        enableThinkingBudget,
        thinkingBudget,
        // No need for setFeedback, setGrade etc. here as they are handled by stream or useEffect
        setLoading,
        setActiveTab,
        setModelLastRequestTimes,
        autoMaxTokens,
        maxTokens,
        setSelectedModel,
        checkBackendStatus,
        setCurrentModelForRequest
    ]);
    // useEffect for post-processing feedback after streaming is complete and saving to history
    (0,react.useEffect)(()=>{
        if (!loading && feedback.trim() !== "" && !error) {
            let currentFeedback = feedback;
            let extractedGrade = "";
            let extractedMarkSchemeText = ""; // Renamed to avoid conflict with markScheme state if it's input
            let extractedAchievedMarks = null;
            const gradeMatch = currentFeedback.match(/\[GRADE:(\d+)\]/i);
            if (gradeMatch && gradeMatch[1]) {
                extractedGrade = gradeMatch[1];
                currentFeedback = currentFeedback.replace(gradeMatch[0], "").trim();
            }
            const marksMatch = currentFeedback.match(/\[MARKS:(\d+)\/(\d+)\]/i);
            if (marksMatch && marksMatch[1]) {
                extractedAchievedMarks = marksMatch[1];
                // If totalMarks wasn't set from input, try to get it from here
                if (!totalMarks && marksMatch[2]) {
                    setTotalMarks(marksMatch[2]); // Update totalMarks state if detected
                }
                currentFeedback = currentFeedback.replace(marksMatch[0], "").trim();
            }
            // Assuming mark scheme is part of the main feedback body if not input separately
            // This parsing might need to be more robust depending on AI output format
            const markSchemePattern = /Mark Scheme:([\s\S]+?)(?=\n\n[A-Z]|Grade:|Marks:|$)/i; // More robust regex
            const markSchemeMatch = currentFeedback.match(markSchemePattern);
            if (markSchemeMatch && markSchemeMatch[1]) {
                extractedMarkSchemeText = markSchemeMatch[1].trim();
            // Remove it from the main feedback to avoid duplication if you display them separately
            // currentFeedback = currentFeedback.replace(markSchemeMatch[0], "").trim();
            }
            setGrade(extractedGrade);
            setAchievedMarks(extractedAchievedMarks);
            // If you have a separate state for the parsed mark scheme text:
            // setParsedMarkScheme(extractedMarkSchemeText);
            // For now, we assume `feedback` state holds the primary text, and `markScheme` state is for input.
            // If the AI generates a mark scheme and it's not from input, you might want to store it.
            // For this task, we'll assume the main `feedback` state contains everything not explicitly parsed out.
            setSuccess({
                message: "Feedback processed and displayed!"
            });
            setProcessingProgress(""); // Clear progress
            setLoading(false); // Ensure loading is false
            // Save to history
            const newHistoryItem = {
                id: Date.now(),
                question,
                answer,
                feedback: feedback,
                grade: extractedGrade,
                achievedMarks: extractedAchievedMarks,
                totalMarks: totalMarks || (marksMatch && marksMatch[2] ? marksMatch[2] : null),
                markSchemeOutput: extractedMarkSchemeText,
                subject,
                examBoard,
                questionType,
                userType,
                model: currentModelForRequestRef.current,
                tier,
                timestamp: new Date().toISOString(),
                relevantMaterial: relevantMaterial || "",
                markSchemeInput: markScheme || "",
                relevantMaterialImagePreview: relevantMaterialImage || null,
                settings: {
                    autoMaxTokens,
                    maxTokens,
                    enableThinkingBudget,
                    thinkingBudget
                } // Add relevant settings
            };
            setHistory((prevHistory)=>[
                    newHistoryItem,
                    ...prevHistory.slice(0, HISTORY_LIMIT - 1)
                ]);
        } else if (loading && error) {
            setLoading(false); // Ensure loading is stopped on error too
            setProcessingProgress("Error occurred.");
        }
    }, [
        loading,
        feedback,
        error,
        question,
        answer,
        subject,
        examBoard,
        questionType,
        userType,
        markScheme,
        totalMarks,
        relevantMaterial,
        selectedModel,
        tier,
        autoMaxTokens,
        maxTokens,
        enableThinkingBudget,
        thinkingBudget,
        relevantMaterialImage,
        setHistory,
        setGrade,
        setAchievedMarks,
        setTotalMarks,
        setSuccess,
        setLoading,
        setProcessingProgress
    ]);
    const generateMarkScheme = async ()=>{
        // Check if we have a question
        if (!question) {
            setError({
                type: "validation",
                message: "Please enter a question to generate a mark scheme"
            });
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess({
            message: "Generating mark scheme..."
        });
        // Variables for retry logic
        let retryCount = 0;
        const maxRetries = 3;
        let successFlag = false;
        const failedModels = new Set();
        const modelsToTry = [
            selectedModel,
            ...Object.values(FALLBACK_MODELS)
        ];
        try {
            var _AI_MODELS_find;
            // We'll start with the selected model and fall back to others if needed
            let currentModel = selectedModel;
            let modelLabel = ((_AI_MODELS_find = AI_MODELS.find((m)=>m.value === currentModel)) === null || _AI_MODELS_find === void 0 ? void 0 : _AI_MODELS_find.label) || currentModel;
            // Detect total marks if not already set
            const detectedMarks = !totalMarks ? detectTotalMarksFromQuestion(question) : null;
            const marksToUse = totalMarks || detectedMarks;
            const systemPrompt = "You are an experienced GCSE examiner for ".concat(subject, ". Create a detailed mark scheme for the provided question based on ").concat(examBoard, " examination standards. \n      Include clear assessment objectives, point-by-point criteria, level descriptors if applicable, and a total mark allocation. ").concat(marksToUse ? "The question is out of ".concat(marksToUse, " marks.") : '', "\n      IMPORTANT: Please provide the mark scheme in plain text format only. Do NOT use any Markdown formatting (e.g., no headings, bold text, lists, etc.).");
            const userPrompt = "Please create a detailed mark scheme for this GCSE ".concat(subject, " question for the ").concat(examBoard, " exam board:\n      \n      QUESTION: ").concat(question, "\n      ").concat(marksToUse ? "\nTOTAL MARKS: ".concat(marksToUse) : '', "\n      \n      FORMAT YOUR RESPONSE AS A PROFESSIONAL MARK SCHEME WITH:\n      1. Clear assessment criteria\n      2. Point-by-point allocation of marks\n      3. Examples of acceptable answers where appropriate\n      4. Level descriptors for extended responses\n      5. Total mark allocation");
            let response;
            let data;
            if (currentModel === "gemini-2.5-flash-preview-05-20") {
                const requestBody = {
                    contents: [
                        {
                            parts: [
                                {
                                    text: "System: ".concat(systemPrompt, "\n\nUser: ").concat(userPrompt)
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.3
                    }
                };
                // Add thinking config if enabled (though less critical for mark scheme generation)
                if (enableThinkingBudget && thinkingBudget > 0 && DEFAULT_THINKING_BUDGETS[currentModel]) {
                    requestBody.config = {
                        thinkingConfig: {
                            thinkingBudget: thinkingBudget
                        }
                    };
                }
                try {
                    // Use the CORRECT backend URL when on GitHub Pages
                    const isGitHubPagesEnv =  true && (window.location.hostname.includes('github.io') || window.location.hostname === 'beenycool.github.io');
                    // Always use the remote server for GitHub Pages
                    // The backend server REQUIRES the /api prefix in the URL
                    const geminiApiUrl = isGitHubPagesEnv ? 'https://beenycool-github-io.onrender.com/api/gemini/generate' : (0,api_helpers.constructApiUrl)('gemini/generate');
                    console.log('Sending Gemini generate request to:', geminiApiUrl);
                    response = await fetch(geminiApiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(requestBody),
                        signal: AbortSignal.timeout(60000)
                    });
                    // If we get a 400 error with the specific model ID, try the fallback endpoint
                    if (!response.ok && response.status === 400) {
                        const errorText = await response.text();
                        if (errorText.includes("not a valid model ID")) {
                            console.warn("Model ".concat(currentModel, " not supported by direct Gemini API, falling back to standard chat API"));
                            // Fallback to using the standard chat API endpoint
                            // Use the CORRECT backend URL when on GitHub Pages
                            const isGitHubPagesEnv =  true && (window.location.hostname.includes('github.io') || window.location.hostname === 'beenycool.github.io');
                            // Always use the remote server for GitHub Pages
                            // The backend server REQUIRES the /api prefix in the URL
                            const chatApiUrl = isGitHubPagesEnv ? 'https://beenycool-github-io.onrender.com/api/chat/completions' : (0,api_helpers.constructApiUrl)('chat/completions');
                            console.log('Falling back to chat completions API:', chatApiUrl);
                            response = await fetch(chatApiUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    model: FALLBACK_MODELS[currentModel],
                                    messages: [
                                        {
                                            role: "system",
                                            content: systemPrompt
                                        },
                                        {
                                            role: "user",
                                            content: userPrompt
                                        }
                                    ],
                                    temperature: 0.3
                                }),
                                signal: AbortSignal.timeout(60000)
                            });
                        } else {
                            throw new Error("Mark scheme generation failed with Gemini API: ".concat(errorText));
                        }
                    }
                } catch (error) {
                    throw error; // Re-throw to be handled by the main try/catch
                }
            } else if (currentModel.startsWith("openai/") || currentModel.startsWith("xai/")) {
                // GitHub models API for GitHub and Grok models
                // Use the CORRECT backend URL when on GitHub Pages
                const isGitHubPagesEnv =  true && (window.location.hostname.includes('github.io') || window.location.hostname === 'beenycool.github.io');
                // Always use the remote server for GitHub Pages
                // The backend server REQUIRES the /api prefix in the URL
                const githubApiUrl = isGitHubPagesEnv ? 'https://beenycool-github-io.onrender.com/api/github/completions' : (0,api_helpers.constructApiUrl)('github/completions');
                console.log('Sending GitHub completions request to:', githubApiUrl);
                response = await fetch(githubApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: currentModel.startsWith("openai/") || currentModel.startsWith("xai/") ? currentModel : "xai/grok-3",
                        messages: [
                            {
                                role: "system",
                                content: systemPrompt
                            },
                            {
                                role: "user",
                                content: userPrompt
                            }
                        ],
                        temperature: 0.7,
                        top_p: 1.0
                    }),
                    signal: AbortSignal.timeout(60000) // 60 second timeout
                });
            } else {
                const chatApiUrl = (0,api_helpers.constructApiUrl)('chat/completions');
                console.log('Sending chat completions request to:', chatApiUrl);
                response = await fetch(chatApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: currentModel,
                        messages: [
                            {
                                role: "system",
                                content: systemPrompt
                            },
                            {
                                role: "user",
                                content: userPrompt
                            }
                        ],
                        temperature: 0.3
                    }),
                    signal: AbortSignal.timeout(60000) // 60 second timeout
                });
            }
            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = "Unknown error occurred";
                try {
                    var _errorJson_error;
                    const errorJson = JSON.parse(errorText);
                    errorMessage = ((_errorJson_error = errorJson.error) === null || _errorJson_error === void 0 ? void 0 : _errorJson_error.message) || errorJson.message || JSON.stringify(errorJson);
                } catch (e) {
                    errorMessage = errorText || response.statusText;
                }
                throw new Error("Mark scheme generation failed: ".concat(errorMessage));
            }
            data = await response.json();
            // Extract the response content
            let markSchemeText = "";
            // Log the data structure for debugging
            console.log("API response format:", Object.keys(data).join(", "));
            try {
                if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
                    // Gemini API format
                    if (data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                        markSchemeText = data.candidates[0].content.parts[0].text;
                        console.log("Using data.candidates[0].content.parts[0].text format");
                    } else if (typeof data.candidates[0].content.text === 'string') {
                        markSchemeText = data.candidates[0].content.text;
                        console.log("Using data.candidates[0].content.text format");
                    }
                } else if (data.choices && data.choices[0] && data.choices[0].message) {
                    // Standard OpenAI-compatible API format
                    markSchemeText = data.choices[0].message.content;
                    console.log("Using data.choices[0].message.content format");
                } else if (data.content) {
                    // Simple content format
                    markSchemeText = data.content;
                    console.log("Using data.content format");
                } else if (typeof data === 'object' && Object.keys(data).length > 0) {
                    // Try to extract any text content from unknown format
                    const extractTextFromObject = (obj)=>{
                        if (typeof obj === 'string') return obj;
                        if (!obj || typeof obj !== 'object') return '';
                        // Check for content key
                        if (obj.content && typeof obj.content === 'string') return obj.content;
                        // Check for text key
                        if (obj.text && typeof obj.text === 'string') return obj.text;
                        // Check for message.content
                        if (obj.message && obj.message.content && typeof obj.message.content === 'string') {
                            return obj.message.content;
                        }
                        // Try to find any string that might be the content
                        for(const key in obj){
                            if (typeof obj[key] === 'string' && obj[key].length > 100) {
                                return obj[key]; // Assumes large string is content
                            }
                            if (typeof obj[key] === 'object') {
                                const extracted = extractTextFromObject(obj[key]);
                                if (extracted) return extracted;
                            }
                        }
                        return '';
                    };
                    markSchemeText = extractTextFromObject(data);
                    if (markSchemeText) {
                        console.log("Extracted content from unknown format");
                    }
                }
            } catch (e) {
                console.error("Error parsing API response:", e);
            }
            if (!markSchemeText) {
                console.warn("Unexpected API response format for mark scheme:", data);
                throw new Error("Unable to extract mark scheme text from API response");
            }
            // Update the mark scheme field
            setMarkScheme(markSchemeText);
            setSuccess({
                message: "Mark scheme generated successfully!"
            });
            successFlag = true;
        } catch (error) {
            console.error("Error generating mark scheme:", error);
            if (error.name === 'AbortError') {
                setError({
                    type: "timeout",
                    message: "Mark scheme generation timed out.",
                    onRetry: generateMarkScheme
                });
            } else {
                setError({
                    type: "api_error",
                    message: "Failed to generate mark scheme: ".concat(error.message),
                    onRetry: generateMarkScheme
                });
            }
        } finally{
            setLoading(false);
        }
    };
    // Reset form fields
    const resetForm = ()=>{
        setQuestion("");
        setAnswer("");
        setMarkScheme("");
        setImage(null);
        setTextExtract("");
        setRelevantMaterial("");
        setRelevantMaterialImage(null);
        setRelevantMaterialImageBase64(null);
        setTotalMarks("");
        setFeedback("");
        setGrade("");
        setAchievedMarks(null);
        setError(null);
        setSuccess(null);
        // Clear drafts from localStorage
        localStorage.removeItem(LOCALSTORAGE_KEYS.QUESTION);
        localStorage.removeItem(LOCALSTORAGE_KEYS.ANSWER);
        // Optionally reset preferences to default if desired, or leave them persisted
        // setSubject("english"); localStorage.setItem(LOCALSTORAGE_KEYS.SUBJECT, "english");
        // setExamBoard("aqa"); localStorage.setItem(LOCALSTORAGE_KEYS.EXAM_BOARD, "aqa");
        // setSelectedModel("google/gemini-2.5-pro-exp-03-25"); localStorage.setItem(LOCALSTORAGE_KEYS.MODEL, "google/gemini-2.5-pro-exp-03-25");
        // setTier("higher"); localStorage.setItem(LOCALSTORAGE_KEYS.TIER, "higher");
        sonner_dist/* toast */.oR.success("Form has been reset and drafts cleared");
    };
    // TopBar component
    const TopBar = (param)=>{
        let { version = "2.1.0", backendStatus, remainingTokens } = param;
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            className: "sticky top-0 z-10 flex items-center justify-between py-2 px-4 border-b border-border bg-card shadow-sm backdrop-blur-sm bg-opacity-90",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "flex items-center space-x-4",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "font-semibold text-xl",
                            children: "AI GCSE Marker"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "text-xs text-muted-foreground hidden sm:block",
                            children: [
                                "v",
                                version
                            ]
                        }),
                        backendStatus && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "hidden sm:flex items-center space-x-1",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: "h-2 w-2 rounded-full ".concat(backendStatus === 'online' ? 'bg-green-500' : backendStatus === 'rate_limited' ? 'bg-yellow-500' : 'bg-red-500')
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: "text-xs text-muted-foreground",
                                    children: backendStatus === 'online' ? 'API Connected' : backendStatus === 'rate_limited' ? 'API Rate Limited' : 'API Offline'
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipProvider */.Bc, {
                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(tooltip/* Tooltip */.m_, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipTrigger */.k$, {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                            className: "text-xs text-muted-foreground hidden sm:flex items-center",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(zap/* default */.A, {
                                                    size: 12,
                                                    className: "mr-1"
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                    children: [
                                                        remainingTokens,
                                                        " requests left"
                                                    ]
                                                })
                                            ]
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipContent */.ZI, {})
                                ]
                            })
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "flex items-center space-x-2",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(theme_toggle/* ThemeToggle */.U, {}),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                            variant: "ghost",
                            size: "sm",
                            className: "text-muted-foreground hover:text-foreground",
                            onClick: ()=>setShowKeyboardShortcuts(true),
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(keyboard/* default */.A, {
                                    size: 18
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                    className: "sr-only",
                                    children: "Keyboard shortcuts"
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                            variant: "ghost",
                            size: "sm",
                            className: "text-muted-foreground hover:text-foreground",
                            onClick: ()=>setShowGuide(!showGuide),
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_help/* default */.A, {
                                    size: 18
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                    className: "sr-only",
                                    children: "Help"
                                })
                            ]
                        })
                    ]
                })
            ]
        });
    };
    // ADDED: Function to show subject guidance
    const handleShowSubjectGuidance = ()=>{
        const guidance = (0,utils/* getSubjectGuidance */.$G)(subject, examBoard);
        setCurrentSubjectGuidance(guidance || "No specific guidance available for the current selection.");
        setShowSubjectGuidanceDialog(true);
    };
    // ADDED: Handler for bulk file upload
    const handleBulkFileChange = (event)=>{
        const file = event.target.files[0];
        if (file) {
            setBulkFile(file);
            const fileType = file.name.split('.').pop().toLowerCase();
            // Show appropriate message based on file type
            sonner_dist/* toast */.oR.info('File "'.concat(file.name, '" selected. Ready to process.'));
            // Clear previous bulk items and results
            setBulkItems([]);
            setBulkResults([]);
        }
    };
    // Function to process a single bulk item - Defined within AIMarker component scope
    const processSingleBulkItem = async (itemData, itemIndex, totalItemsInBulk)=>{
        var _itemData_question;
        sonner_dist/* toast */.oR.info("Processing item ".concat(itemIndex + 1, "/").concat(totalItemsInBulk, ": ").concat((_itemData_question = itemData.question) === null || _itemData_question === void 0 ? void 0 : _itemData_question.substring(0, 30), "..."));
        const currentModelForItem = itemData.model;
        const modelRateLimit = MODEL_RATE_LIMITS[currentModelForItem] || 10000;
        const now = Date.now();
        const globalLastReqTime = modelLastRequestTimes['global_request_time'] || 0;
        if (now - globalLastReqTime < 5000) {
            const waitTime = Math.ceil((5000 - (now - globalLastReqTime)) / 1000);
            sonner_dist/* toast */.oR.warning("Global rate limit: Waiting ".concat(waitTime, "s."));
            await new Promise((resolve)=>setTimeout(resolve, waitTime * 1000));
        }
        const modelLastReq = modelLastRequestTimes[currentModelForItem] || 0;
        if (now - modelLastReq < modelRateLimit) {
            var _AI_MODELS_find;
            const waitTime = Math.ceil((modelRateLimit - (now - modelLastReq)) / 1000);
            sonner_dist/* toast */.oR.warning("Rate limit for ".concat(((_AI_MODELS_find = AI_MODELS.find((m)=>m.value === currentModelForItem)) === null || _AI_MODELS_find === void 0 ? void 0 : _AI_MODELS_find.label) || currentModelForItem, ": Waiting ").concat(waitTime, "s."));
            await new Promise((resolve)=>setTimeout(resolve, waitTime * 1000));
        }
        setModelLastRequestTimes((prev)=>({
                ...prev,
                [currentModelForItem]: Date.now(),
                'global_request_time': Date.now()
            }));
        // Optional: Consume token if daily limits apply to bulk items
        // if (!consumeToken()) { 
        //   return { error: "Daily request limit reached.", feedback: null, grade: null, modelName: currentModelForItem };
        // }
        const buildSystemPromptForItem = ()=>{
            let basePrompt = "You are an experienced GCSE ".concat(itemData.subject, " examiner. Your task is to provide detailed, constructive feedback for ").concat(itemData.userType === 'teacher' ? 'assessment purposes' : 'student learning', " following these guidelines:\n\n1. ASSESSMENT CRITERIA:\n- Accuracy of content (subject knowledge)\n- Clarity and structure of response\n- Use of evidence/examples\n- Depth of analysis (where applicable)\n- Technical accuracy (spelling, grammar, terminology)");
            const currentSubjectDetails = allSubjects.find((s)=>s.value === itemData.subject);
            if (currentSubjectDetails === null || currentSubjectDetails === void 0 ? void 0 : currentSubjectDetails.hasTiers) {
                var _itemData_tier;
                basePrompt += "\n- This is a ".concat((_itemData_tier = itemData.tier) === null || _itemData_tier === void 0 ? void 0 : _itemData_tier.toUpperCase(), " tier question");
            }
            basePrompt += '\n\n2. FEEDBACK STRUCTURE:\na) Performance overview that addresses the overall quality of the answer (2-3 sentences)\nb) 3-4 specific strengths with concrete examples from the student\'s work, using phrases like "You demonstrated...", "Your analysis of...", or "I was particularly impressed by..."\nc) 3-4 specific areas for improvement using the "WWW/EBI" format (What Went Well/Even Better If), with each point structured as:\n   * Clear identification of the issue\n   * Evidence from the student\'s work\n   * Specific, achievable action to improve\n   * Link to how this would affect their grade\nd) Clear progression pathway that explains exactly what would be needed to achieve the next grade level\ne) GCSE grade (9-1) in the format: [GRADE:X] where X is the grade number, with a brief justification of the grade awarded';
            // Check for detected marks if totalMarks is not provided
            const detectedMarks = !itemData.totalMarks ? detectTotalMarksFromQuestion(itemData.question) : null;
            const marksToUse = itemData.totalMarks || detectedMarks;
            if (marksToUse) {
                basePrompt += "\nf) Marks achieved in the format: [MARKS:Y/".concat(marksToUse, "] where Y is the number of marks achieved");
            }
            // Add mark scheme analysis instructions if provided
            if (itemData.markScheme) {
                basePrompt += '\n\n3. MARK SCHEME ANALYSIS:\n- Approach the mark scheme like an examiner, using precise analytical language\n- Assess each assessment objective (AO) point-by-point with specific examples:\n  * For each point awarded: "Credit given for [specific criteria] as evidenced by [exact quote/reference from answer]"\n  * For each point missed: "No credit for [specific criteria] because [specific explanation]"\n- Follow a structured marking pattern using annotations: \n  * ✓ = criterion fully met with specific highlighted evidence\n  * ~ = criterion partially met with explanation of what\'s missing\n  * ✗ = criterion not met with specific guidance for improvement\n- Use precise examiner language (e.g., "demonstrates comprehensive understanding," "shows limited analysis," "lacks sufficient development")\n- Award marks according to level descriptors, explaining why the answer falls into a particular band\n- Clearly justify the final mark total with reference to the mark scheme bands';
            }
            if (itemData.subject === "maths") {
                basePrompt += "\n\n4. MATHEMATICAL NOTATION:\n- Use LaTeX notation for mathematical expressions enclosed in $ $ for inline formulas and as separate blocks for complex formulas\n- Example inline: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$\n- Example block:\n$$\nx = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n$$\n- Format solutions step-by-step with clear explanations\n- Number equations and reference them in your feedback";
            } else {
                basePrompt += "\n\n4. SUBJECT-SPECIFIC GUIDANCE:\n".concat((0,utils/* getSubjectGuidance */.$G)(itemData.subject, itemData.examBoard), "\n\n5. PROFESSIONAL MARKING APPROACH:\n- Use exam board-specific terminology and assessment language\n- Focus on assessment objectives (AOs) relevant to ").concat(itemData.subject, '\n- Implement a tiered marking approach - first identify the band/level, then refine the exact mark within that band\n- Use marginal annotations to highlight specific points (e.g., "AO2 - Strong analysis here", "Limited evidence", "Good application of knowledge")\n- Balance critical assessment with encouraging language that motivates improvement\n- Ensure developmental feedback is specific and actionable\n- Apply a consistent marking standard throughout the assessment\n- Acknowledge partial understanding where appropriate');
            }
            if (currentModelForItem === "microsoft/mai-ds-r1:free") {
                basePrompt += "\n\n5. THINKING PROCESS:\n- First, analyze the student's answer carefully...\n- Mark your thinking process with [THINKING] and your final feedback with [FEEDBACK]";
            }
            return basePrompt;
        };
        const buildUserPromptForItem = ()=>{
            let userPromptText = "Please mark this GCSE ".concat(itemData.subject, " answer.\n\nQUESTION:\n").concat(itemData.question, "\n\nSTUDENT ANSWER:\n").concat(itemData.answer, "\n\n");
            // Check for detected marks if totalMarks is not provided
            const detectedMarks = !itemData.totalMarks ? detectTotalMarksFromQuestion(itemData.question) : null;
            const marksToUse = itemData.totalMarks || detectedMarks;
            if (marksToUse) {
                userPromptText += "TOTAL MARKS: ".concat(marksToUse, "\n\n");
            }
            userPromptText += "INSTRUCTIONS:\n1. Mark this answer as an experienced GCSE ".concat(itemData.subject, " examiner would for the ").concat(itemData.examBoard, " exam board\n2. Follow a methodical assessment process aligned with official marking standards\n3. Use professional examiner language and annotation techniques throughout\n4. Provide detailed, constructive feedback with specific evidence from the student's work\n5. Structure feedback using the WWW/EBI format (What Went Well/Even Better If)\n6. Assign a GCSE grade (9-1) in the format [GRADE:X] with clear justification\n7. Include specific guidance for improving to the next grade level").concat(itemData.markScheme ? "\n8. Apply a rigorous mark-by-mark assessment using the provided mark scheme\n9. Annotate each assessment point with appropriate symbols (✓, ~, ✗)\n10. Reference specific mark scheme criteria and bands in your assessment\n11. Demonstrate clear reasoning for each mark awarded or withheld" : '');
            if (marksToUse) {
                userPromptText += "\n4. Assign marks in the format [MARKS:Y/".concat(marksToUse, "]");
            }
            return userPromptText;
        };
        try {
            var _responseData_choices__message, _responseData_choices_, _responseData_choices;
            const systemPromptContent = buildSystemPromptForItem();
            const userPromptContent = buildUserPromptForItem();
            let response;
            if (currentModelForItem.startsWith("openai/") || currentModelForItem.startsWith("xai/")) {
                // GitHub models API for GitHub and Grok models
                response = await fetch("".concat(API_BASE_URL, "/api/github/completions"), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: currentModelForItem.startsWith("openai/") || currentModelForItem.startsWith("xai/") ? currentModelForItem : "xai/grok-3",
                        messages: [
                            {
                                role: "system",
                                content: systemPromptContent
                            },
                            {
                                role: "user",
                                content: userPromptContent
                            }
                        ],
                        max_tokens: autoMaxTokens ? undefined : maxTokens,
                        temperature: 0.7,
                        top_p: 1.0
                    })
                });
            } else {
                // Standard API for other models
                response = await fetch("".concat(API_BASE_URL, "/api/chat/completions"), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: currentModelForItem,
                        messages: [
                            {
                                role: "system",
                                content: systemPromptContent
                            },
                            {
                                role: "user",
                                content: userPromptContent
                            }
                        ],
                        max_tokens: autoMaxTokens ? undefined : maxTokens,
                        temperature: 0.7
                    })
                });
            }
            if (!response.ok) {
                const errorText = await response.text();
                let parsedErrorMessage = errorText;
                try {
                    var _JSON_parse_error;
                    parsedErrorMessage = ((_JSON_parse_error = JSON.parse(errorText).error) === null || _JSON_parse_error === void 0 ? void 0 : _JSON_parse_error.message) || JSON.parse(errorText).message || errorText;
                } catch (e) {}
                // Consider fallback model logic for bulk items here if desired.
                return {
                    error: "API Error (Item ".concat(itemIndex + 1, "): ").concat(parsedErrorMessage, " (Model: ").concat(currentModelForItem, ")"),
                    feedback: null,
                    grade: null,
                    modelName: currentModelForItem
                };
            }
            const responseData = await response.json();
            let apiResponseContent = ((_responseData_choices = responseData.choices) === null || _responseData_choices === void 0 ? void 0 : (_responseData_choices_ = _responseData_choices[0]) === null || _responseData_choices_ === void 0 ? void 0 : (_responseData_choices__message = _responseData_choices_.message) === null || _responseData_choices__message === void 0 ? void 0 : _responseData_choices__message.content) || responseData.content || responseData.text || responseData.answer || responseData.response || "";
            let itemModelThinking = [];
            if (currentModelForItem === "microsoft/mai-ds-r1:free") {
                const thinkingBlockMatch = apiResponseContent.match(/\[THINKING\]([\s\S]*?)(?:\[FEEDBACK\]|$)/i);
                if (thinkingBlockMatch === null || thinkingBlockMatch === void 0 ? void 0 : thinkingBlockMatch[1]) {
                    var _feedbackBlockMatch_;
                    itemModelThinking = thinkingBlockMatch[1].trim().split(/\n\s*\n/).map((s)=>s.trim());
                    const feedbackBlockMatch = apiResponseContent.match(/\[FEEDBACK\]([\s\S]*?)$/i);
                    apiResponseContent = (feedbackBlockMatch === null || feedbackBlockMatch === void 0 ? void 0 : (_feedbackBlockMatch_ = feedbackBlockMatch[1]) === null || _feedbackBlockMatch_ === void 0 ? void 0 : _feedbackBlockMatch_.trim()) || apiResponseContent;
                }
            }
            const gradeValueMatch = apiResponseContent.match(/\[GRADE:(\d+)\]/i);
            const itemGrade = (gradeValueMatch === null || gradeValueMatch === void 0 ? void 0 : gradeValueMatch[1]) || null;
            const marksValueMatch = apiResponseContent.match(/\[MARKS:(\d+)\/(\d+)\]/i);
            const itemAchievedMarks = (marksValueMatch === null || marksValueMatch === void 0 ? void 0 : marksValueMatch[1]) || null;
            const itemTotalMarks = (marksValueMatch === null || marksValueMatch === void 0 ? void 0 : marksValueMatch[2]) || itemData.totalMarks;
            const finalFeedback = apiResponseContent.replace(/\[GRADE:\d+\]/gi, '').replace(/\[MARKS:\d+\/\d+\]/gi, '').trim();
            return {
                feedback: finalFeedback,
                grade: itemGrade,
                achievedMarks: itemAchievedMarks,
                totalMarks: itemTotalMarks,
                modelThinking: itemModelThinking,
                modelName: currentModelForItem,
                error: null
            };
        } catch (error) {
            console.error("Error in processSingleBulkItem (Item ".concat(itemIndex + 1, "):"), error);
            return {
                error: "Processing failed (Item ".concat(itemIndex + 1, "): ").concat(error.message),
                feedback: null,
                grade: null,
                modelName: currentModelForItem
            };
        }
    };
    // MODIFIED: handleProcessBulkFile - to support multiple file formats
    const handleProcessBulkFile = async ()=>{
        if (!bulkFile) {
            sonner_dist/* toast */.oR.error("Please select a file for bulk processing.");
            return;
        }
        if (bulkProcessing) {
            sonner_dist/* toast */.oR.warning("Bulk processing is already active.");
            return;
        }
        // Reset control flags
        bulkProcessingRef.current = {
            cancel: false,
            pause: false
        };
        setIsBulkProcessingPaused(false);
        setBulkProcessing(true);
        setBulkResults([]);
        setBulkProgress({
            processed: 0,
            total: 0,
            currentItem: null
        });
        setActiveTab("bulk");
        try {
            sonner_dist/* toast */.oR.info('Initiating bulk processing for: "'.concat(bulkFile.name, '"...'));
            // Determine file type by extension
            const fileType = bulkFile.name.split('.').pop().toLowerCase();
            // Process based on file type
            if (fileType === 'csv') {
                // Process CSV file with PapaParse
                if (typeof (papaparse_min_default()) === 'undefined') {
                    sonner_dist/* toast */.oR.error("CSV Parsing library (PapaParse) is not available. Please ensure it's installed.");
                    setBulkProcessing(false);
                    return;
                }
                papaparse_min_default().parse(bulkFile, {
                    header: true,
                    skipEmptyLines: true,
                    complete: async (results)=>{
                        await processParseResults(results.data);
                    },
                    error: (error)=>{
                        console.error("CSV parsing error:", error);
                        sonner_dist/* toast */.oR.error("CSV parsing failed: ".concat(error.message));
                        setBulkResults([
                            {
                                itemIndex: -1,
                                error: "CSV parsing error: ".concat(error.message)
                            }
                        ]);
                        setBulkProcessing(false);
                    }
                });
            } else if (fileType === 'json') {
                // Process JSON file
                const reader = new FileReader();
                reader.onload = async (e)=>{
                    try {
                        const jsonData = JSON.parse(e.target.result);
                        // Handle both array and object formats
                        const dataArray = Array.isArray(jsonData) ? jsonData : [
                            jsonData
                        ];
                        await processParseResults(dataArray);
                    } catch (error) {
                        console.error("JSON parsing error:", error);
                        sonner_dist/* toast */.oR.error("JSON parsing failed: ".concat(error.message));
                        setBulkResults([
                            {
                                itemIndex: -1,
                                error: "JSON parsing error: ".concat(error.message)
                            }
                        ]);
                        setBulkProcessing(false);
                    }
                };
                reader.onerror = (error)=>{
                    console.error("File reading error:", error);
                    sonner_dist/* toast */.oR.error("File reading failed: ".concat(error.message));
                    setBulkProcessing(false);
                };
                reader.readAsText(bulkFile);
            } else if (fileType === 'txt') {
                // Process plain text file - assume one question/answer pair per line with tab or comma separation
                const reader = new FileReader();
                reader.onload = async (e)=>{
                    try {
                        const textData = e.target.result;
                        const lines = textData.split(/\r?\n/).filter((line)=>line.trim() !== '');
                        const parsedItems = lines.map((line, idx)=>{
                            var _parts_, _parts_1, _parts_2, _parts_3, _parts_4;
                            // Try to split by tab first, then by comma if no tab
                            const parts = line.includes('\t') ? line.split('\t') : line.split(',');
                            if (parts.length < 2) {
                                return {
                                    error: "Line ".concat(idx + 1, ": Could not parse question and answer")
                                };
                            }
                            return {
                                question: parts[0].trim(),
                                answer: parts[1].trim(),
                                // Optional fields if provided in subsequent columns
                                subjectFromFile: (_parts_ = parts[2]) === null || _parts_ === void 0 ? void 0 : _parts_.trim(),
                                examBoardFromFile: (_parts_1 = parts[3]) === null || _parts_1 === void 0 ? void 0 : _parts_1.trim(),
                                modelFromFile: (_parts_2 = parts[4]) === null || _parts_2 === void 0 ? void 0 : _parts_2.trim(),
                                tierFromFile: (_parts_3 = parts[5]) === null || _parts_3 === void 0 ? void 0 : _parts_3.trim(),
                                totalMarksFromFile: (_parts_4 = parts[6]) === null || _parts_4 === void 0 ? void 0 : _parts_4.trim()
                            };
                        }).filter((item)=>!item.error && item.question && item.answer);
                        if (parsedItems.length === 0) {
                            sonner_dist/* toast */.oR.error("No valid items found in the text file. Format should be: Question[tab]Answer");
                            setBulkProcessing(false);
                            return;
                        }
                        await processParseResults(parsedItems);
                    } catch (error) {
                        console.error("Text parsing error:", error);
                        sonner_dist/* toast */.oR.error("Text parsing failed: ".concat(error.message));
                        setBulkResults([
                            {
                                itemIndex: -1,
                                error: "Text parsing error: ".concat(error.message)
                            }
                        ]);
                        setBulkProcessing(false);
                    }
                };
                reader.onerror = (error)=>{
                    console.error("File reading error:", error);
                    sonner_dist/* toast */.oR.error("File reading failed: ".concat(error.message));
                    setBulkProcessing(false);
                };
                reader.readAsText(bulkFile);
            } else {
                sonner_dist/* toast */.oR.error("Unsupported file format: .".concat(fileType, ". Please use CSV, JSON, or TXT files."));
                setBulkProcessing(false);
            }
        } catch (error) {
            console.error("Bulk processing setup error:", error);
            sonner_dist/* toast */.oR.error("Bulk processing setup failed: ".concat(error.message));
            setBulkResults((prev)=>[
                    ...prev,
                    {
                        itemIndex: -1,
                        error: error.message
                    }
                ]);
            setBulkProcessing(false);
            setBulkProgress((prev)=>({
                    ...prev,
                    currentItem: null
                }));
        }
        // MODIFIED: Process parsed data with parallel processing
        async function processParseResults(parsedItems) {
            const validItems = parsedItems.map((item, idx)=>({
                    id: "item-".concat(idx),
                    question: item.Question || item.question,
                    answer: item.Answer || item.answer,
                    subjectFromFile: item.Subject || item.subject || item.subjectFromFile,
                    examBoardFromFile: item.ExamBoard || item.examBoard || item.examBoardFromFile,
                    modelFromFile: item.Model || item.model || item.modelFromFile,
                    tierFromFile: item.Tier || item.tier || item.tierFromFile,
                    totalMarksFromFile: item.TotalMarks || item.totalMarks || item.totalMarksFromFile
                })).filter((item)=>item.question && item.question.trim() !== '' && item.answer && item.answer.trim() !== '');
            if (validItems.length === 0) {
                sonner_dist/* toast */.oR.error("No valid items found in the file. Each item must have Question and Answer fields.");
                setBulkProcessing(false);
                return;
            }
            setBulkItems(validItems);
            setBulkProgress((prev)=>({
                    ...prev,
                    total: validItems.length,
                    processed: 0,
                    currentItem: null
                }));
            // Track active and completed tasks
            let results = [];
            let activeTaskCount = 0;
            let nextItemIndex = 0;
            let completedCount = 0;
            // Process items in parallel based on parallelism setting
            const processNextItems = async ()=>{
                // Continue processing until all items are processed or cancelled
                while(nextItemIndex < validItems.length && !bulkProcessingRef.current.cancel){
                    // Check if processing is paused
                    if (bulkProcessingRef.current.pause) {
                        await new Promise((resolve)=>setTimeout(resolve, 500));
                        continue;
                    }
                    // Check if we've reached the parallelism limit
                    if (activeTaskCount >= parallelProcessing) {
                        await new Promise((resolve)=>setTimeout(resolve, 100));
                        continue;
                    }
                    // Start a new task
                    const itemIndex = nextItemIndex++;
                    activeTaskCount++;
                    // Process the item
                    processItem(itemIndex).then(()=>{
                        activeTaskCount--;
                        completedCount++;
                        // Update progress
                        setBulkProgress((prev)=>({
                                ...prev,
                                processed: completedCount,
                                currentItem: nextItemIndex < validItems.length ? nextItemIndex : null
                            }));
                        // Check if we're done
                        if (completedCount >= validItems.length || nextItemIndex >= validItems.length) {
                            if (!bulkProcessingRef.current.cancel) {
                                sonner_dist/* toast */.oR.success("Bulk processing complete!");
                            }
                            setBulkProcessing(false);
                            setIsBulkProcessingPaused(false);
                        }
                    });
                }
            };
            // Process a single item
            const processItem = async (itemIndex)=>{
                const currentItem = validItems[itemIndex];
                // Check if cancelled
                if (bulkProcessingRef.current.cancel) {
                    return;
                }
                const itemPayload = {
                    question: currentItem.question,
                    answer: currentItem.answer,
                    subject: bulkSettingPreference === 'file' && currentItem.subjectFromFile ? currentItem.subjectFromFile : subject,
                    examBoard: bulkSettingPreference === 'file' && currentItem.examBoardFromFile ? currentItem.examBoardFromFile : examBoard,
                    model: bulkSettingPreference === 'file' && currentItem.modelFromFile && AI_MODELS.find((m)=>m.value === currentItem.modelFromFile) ? currentItem.modelFromFile : selectedModel,
                    tier: bulkSettingPreference === 'file' && currentItem.tierFromFile ? currentItem.tierFromFile : tier,
                    totalMarks: bulkSettingPreference === 'file' && currentItem.totalMarksFromFile ? currentItem.totalMarksFromFile : totalMarks,
                    userType: userType
                };
                const result = await processSingleBulkItem(itemPayload, itemIndex, validItems.length);
                // Add result to the results array
                results.push({
                    itemIndex: itemIndex,
                    question: currentItem.question,
                    answer: currentItem.answer,
                    feedback: result.feedback,
                    grade: result.grade,
                    achievedMarks: result.achievedMarks,
                    totalMarks: result.totalMarks,
                    modelName: result.modelName,
                    error: result.error
                });
                // Update the results state
                setBulkResults([
                    ...results
                ]);
            };
            // Start processing
            processNextItems();
        }
    };
    // ADDED: Handlers for batch processing controls
    const handlePauseBulkProcessing = ()=>{
        bulkProcessingRef.current.pause = true;
        setIsBulkProcessingPaused(true);
        sonner_dist/* toast */.oR.info("Bulk processing paused. Will complete current item before stopping.");
    };
    const handleResumeBulkProcessing = ()=>{
        bulkProcessingRef.current.pause = false;
        setIsBulkProcessingPaused(false);
        sonner_dist/* toast */.oR.info("Bulk processing resumed.");
    };
    const handleCancelBulkProcessing = ()=>{
        bulkProcessingRef.current.cancel = true;
        bulkProcessingRef.current.pause = false; // Unpause if paused to allow cancellation
        sonner_dist/* toast */.oR.info("Cancelling bulk processing after current item completes...");
    };
    // ADDED: Handler for viewing full item details
    const handleViewItemDetails = (item)=>{
        setPreviewItem(item);
        setShowPreviewDialog(true);
    };
    // ADDED: Handler for changing parallelism
    const handleParallelismChange = (value)=>{
        setParallelProcessing(value);
        sonner_dist/* toast */.oR.info("Parallel processing set to ".concat(value, " simultaneous tasks"));
    };
    // ADDED: Handler for asking follow-up questions
    const handleAskFollowUp = ()=>{
        setShowFollowUpDialog(true);
        setFollowUpQuestion("");
        setFollowUpResponse("");
        // Use a different model for follow-up questions if the current one has issues
        // Prioritize the faster model for follow-ups
        if (selectedModel === "microsoft/mai-ds-r1:free") {
            const fastModel = "gemini-2.5-flash-preview-05-20";
            console.log("Temporarily switching from ".concat(selectedModel, " to ").concat(fastModel, " for follow-up"));
            setSelectedModel(fastModel);
        }
    };
    // ADDED: Handler for submitting follow-up questions
    const handleSubmitFollowUp = async ()=>{
        if (!followUpQuestion.trim()) {
            sonner_dist/* toast */.oR.error("Please enter a question");
            return;
        }
        setFollowUpLoading(true);
        try {
            // Check if there are enough tokens
            if (!consumeToken()) {
                setFollowUpLoading(false);
                sonner_dist/* toast */.oR.error("Daily request limit reached");
                return;
            }
            // Check if backend is online
            if (backendStatusRef.current !== 'online') {
                setFollowUpLoading(false);
                sonner_dist/* toast */.oR.error("Backend API is not available. Please check connection status.");
                return;
            }
            console.log("Submitting follow-up question:", followUpQuestion);
            // Build the prompt for the follow-up question
            const promptText = "You previously provided feedback on a student's GCSE ".concat(subject, " answer, giving them a grade ").concat(grade || 'N/A', '. \nThe student has a follow-up question about your feedback: "').concat(followUpQuestion, '"\n\nYour feedback was:\n---\n').concat(feedback, "\n---\n\nPlease respond to their question clearly and constructively. Keep your answer concise but helpful. Remember you're speaking directly to the student.");
            // Make a request to the API
            let response;
            // Use different endpoints and request formats based on the model
            if (selectedModel === "gemini-2.5-flash-preview-05-20") {
                // Format for Gemini direct API
                const requestBody = {
                    contents: [
                        {
                            parts: [
                                {
                                    text: promptText
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7
                    }
                };
                // Add thinking config if enabled
                if (enableThinkingBudget && thinkingBudget > 0) {
                    requestBody.config = {
                        thinkingConfig: {
                            thinkingBudget: thinkingBudget
                        }
                    };
                }
                console.log("Sending follow-up to Gemini API:", requestBody);
                const maxRetriesFollowUp = 3;
                let retryCountFollowUp = 0;
                let successFollowUp = false;
                while(retryCountFollowUp < maxRetriesFollowUp && !successFollowUp){
                    try {
                        response = await fetch("".concat(API_BASE_URL, "/api/gemini/generate"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(requestBody),
                            signal: AbortSignal.timeout(60000)
                        });
                        successFollowUp = true; // If fetch is successful, mark as success
                    } catch (error) {
                        if (error.name === 'AbortError' || error.message && error.message.toLowerCase().includes('timeout')) {
                            retryCountFollowUp++;
                            console.log("Retrying Gemini API request in handleSubmitFollowUp (".concat(retryCountFollowUp, "/").concat(maxRetriesFollowUp, ")..."));
                            if (retryCountFollowUp < maxRetriesFollowUp) {
                                await new Promise((resolve)=>setTimeout(resolve, 1000)); // Wait 1 second before retrying
                            } else {
                                // If all retries fail, rethrow the error or handle it as a final failure
                                throw error;
                            }
                        } else {
                            throw error; // For non-timeout errors, rethrow immediately
                        }
                    }
                }
            } else if (selectedModel.startsWith("openai/") || selectedModel.startsWith("xai/")) {
                // GitHub models API for GitHub and Grok models
                response = await fetch("".concat(API_BASE_URL, "/api/github/completions"), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: selectedModel.startsWith("openai/") || selectedModel.startsWith("xai/") ? selectedModel : "xai/grok-3",
                        messages: [
                            {
                                role: "system",
                                content: "You are an AI tutor helping a student understand their GCSE feedback. Be clear, concise, and supportive."
                            },
                            {
                                role: "user",
                                content: promptText
                            }
                        ],
                        max_tokens: autoMaxTokens ? undefined : maxTokens,
                        temperature: 0.7,
                        top_p: 1.0
                    }),
                    // Add a timeout
                    signal: AbortSignal.timeout(60000)
                });
            } else {
                // Standard API request for other models
                response = await fetch("".concat(API_BASE_URL, "/api/chat/completions"), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: selectedModel,
                        messages: [
                            {
                                role: "system",
                                content: "You are an AI tutor helping a student understand their GCSE feedback. Be clear, concise, and supportive."
                            },
                            {
                                role: "user",
                                content: promptText
                            }
                        ],
                        max_tokens: autoMaxTokens ? undefined : maxTokens,
                        temperature: 0.7
                    }),
                    // Add a timeout
                    signal: AbortSignal.timeout(60000)
                });
            }
            if (!response.ok) {
                const errorText = await response.text();
                console.error("API error response for follow-up:", errorText);
                let errorMessage = "Error processing follow-up question";
                try {
                    var _errorJson_error;
                    const errorJson = JSON.parse(errorText);
                    errorMessage = ((_errorJson_error = errorJson.error) === null || _errorJson_error === void 0 ? void 0 : _errorJson_error.message) || errorJson.message || errorText;
                } catch (e) {
                    errorMessage = errorText;
                }
                throw new Error(errorMessage);
            }
            const responseData = await response.json();
            console.log("Follow-up response data:", responseData);
            let responseContent = "";
            // Handle different API response formats
            if (selectedModel === "gemini-2.5-flash-preview-05-20") {
                // Extract content from Gemini API response
                if (responseData.candidates && responseData.candidates[0] && responseData.candidates[0].content) {
                    const content = responseData.candidates[0].content;
                    if (content.parts && content.parts[0] && content.parts[0].text) {
                        responseContent = content.parts[0].text;
                    }
                }
            } else {
                var _responseData_choices__message, _responseData_choices_, _responseData_choices;
                // Standard API response format
                responseContent = ((_responseData_choices = responseData.choices) === null || _responseData_choices === void 0 ? void 0 : (_responseData_choices_ = _responseData_choices[0]) === null || _responseData_choices_ === void 0 ? void 0 : (_responseData_choices__message = _responseData_choices_.message) === null || _responseData_choices__message === void 0 ? void 0 : _responseData_choices__message.content) || responseData.content || responseData.text || responseData.answer || responseData.response || "";
            }
            if (!responseContent) {
                console.error("Empty or missing response content:", responseData);
                throw new Error("Received empty response from API");
            }
            setFollowUpResponse(responseContent);
        } catch (error) {
            console.error('Error processing follow-up question:', error);
            // Handle different error types
            if (error.name === 'AbortError') {
                sonner_dist/* toast */.oR.error("The request timed out. The server took too long to respond.");
            } else if (error.message.includes("rate limit") || error.message.includes("429")) {
                sonner_dist/* toast */.oR.error("Rate limit exceeded. Please try again in a minute or try a different model.");
            } else {
                sonner_dist/* toast */.oR.error("Failed to process follow-up: ".concat(error.message));
            }
            // Set a basic response to indicate the error
            setFollowUpResponse("I'm sorry, I couldn't process your question due to a technical issue. Please try again later or try a different model.");
        } finally{
            setFollowUpLoading(false);
        }
    };
    // Add a function to create a middleware API endpoint in Next.js    const createMiddlewareApiEndpoint = async () => {        try {            // Check if we're running in a browser environment            if (typeof window === 'undefined') return false;                        // Check if we're in static export mode            const isStaticExport = process.env.IS_STATIC_EXPORT === 'true';                        if (isStaticExport) {                console.log('Running in static export mode - API calls redirected to backend');        console.log(`Using API base URL: ${API_BASE_URL}`);        return true;            }                        try {        // Only try to use local API in development mode        const response = await fetch('/api/create-middleware', {                  method: 'POST',                  headers: {                      'Content-Type': 'application/json',                  },                  body: JSON.stringify({                      type: 'api_middleware',                      endpoints: ['auth/events', 'github/completions', 'chat/completions']                  })              });                            if (response.ok) {                  console.log('Successfully created middleware API endpoints');                  return true;              }      } catch (localApiError) {        console.warn('Local API middleware creation failed, falling back to remote API:', localApiError.message);                // If local API fails, try to check if the remote API is available        try {          const healthCheckUrl = constructApiUrl('health');          const healthCheck = await fetch(healthCheckUrl, {             method: 'GET',            headers: { 'Content-Type': 'application/json' }          });                    if (healthCheck.ok) {            console.log('Remote API is available, will use it instead of local API');            return true;          }        } catch (remoteApiError) {          console.error('Remote API health check failed:', remoteApiError.message);        }      }            return false;        } catch (error) {            console.error('Failed to create middleware API endpoint:', error);            // In static export, we want to gracefully handle this error            if (process.env.IS_STATIC_EXPORT === 'true') {                console.log('Running in static export mode - ignoring API middleware creation failure');                return true;            }            return false;        }    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "min-h-screen bg-background text-foreground",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(TopBar, {
                version: "2.1.3",
                backendStatus: backendStatusRef.current,
                remainingTokens: remainingRequestTokens
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Dialog, {
                open: showOcrPreviewDialog,
                onOpenChange: (open)=>{
                    if (!open) {
                        // If dialog is closed without confirming, reset the state
                        setHasExtractedText(false);
                    }
                    setShowOcrPreviewDialog(open);
                },
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(DialogContent, {
                    className: "sm:max-w-[600px]",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(DialogHeader, {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(DialogTitle, {
                                    children: "Review Extracted Text"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(DialogDescription, {
                                    children: "Review the text extracted from the image. You can edit it here before adding to your answer."
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(scroll_area/* ScrollArea */.F, {
                            className: "h-[300px] w-full rounded-md border p-3 my-4",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_textarea/* Textarea */.T, {
                                value: ocrTextPreview,
                                onChange: (e)=>setOcrTextPreview(e.target.value),
                                className: "min-h-[280px] text-sm",
                                placeholder: "No text extracted or an error occurred."
                            })
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(DialogFooter, {
                            className: "sm:justify-between",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                    variant: "outline",
                                    onClick: ()=>{
                                        setShowOcrPreviewDialog(false);
                                        setHasExtractedText(false);
                                    },
                                    children: "Cancel"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                    onClick: handleConfirmOcrText,
                                    children: "Add to Answer"
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Dialog, {
                open: showSubjectGuidanceDialog,
                onOpenChange: setShowSubjectGuidanceDialog,
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(DialogContent, {
                    className: "sm:max-w-md",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(DialogHeader, {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(DialogTitle, {
                                    children: "Subject Specific Guidance"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)(DialogDescription, {
                                    children: [
                                        "Guidance for ",
                                        (_allSubjects_find = allSubjects.find((s)=>s.value === subject)) === null || _allSubjects_find === void 0 ? void 0 : _allSubjects_find.label,
                                        " - ",
                                        (_EXAM_BOARDS_find = EXAM_BOARDS.find((eb)=>eb.value === examBoard)) === null || _EXAM_BOARDS_find === void 0 ? void 0 : _EXAM_BOARDS_find.label
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(scroll_area/* ScrollArea */.F, {
                            className: "h-[300px] w-full rounded-md border p-3 my-4",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(MathMarkdown, {
                                children: currentSubjectGuidance
                            })
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(DialogFooter, {
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                onClick: ()=>setShowSubjectGuidanceDialog(false),
                                children: "Close"
                            })
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "container mx-auto px-4 py-6 max-w-6xl",
                children: [
                    showGuide && /*#__PURE__*/ (0,jsx_runtime.jsx)(QuickGuide, {
                        onClose: ()=>setShowGuide(false)
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(EnhancedAlert, {
                        success: success,
                        error: error,
                        onRetryAction: {
                            checkBackendStatus: refreshBackendStatusHook
                        }
                    }),
                    detectedSubject && !hasManuallySetSubject.current && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mb-4 p-3 bg-primary/10 border border-primary/20 rounded-md flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex items-center",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_check/* default */.A, {
                                        className: "h-5 w-5 text-primary mr-2"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                        className: "text-sm text-primary",
                                        children: [
                                            "Subject detected: ",
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                                children: ((_allSubjects_find1 = allSubjects.find((s)=>s.value === detectedSubject)) === null || _allSubjects_find1 === void 0 ? void 0 : _allSubjects_find1.label) || 'Unknown'
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex space-x-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                        variant: "outline",
                                        size: "sm",
                                        className: "text-xs h-7 border-primary/20 hover:bg-primary/10",
                                        onClick: ()=>{
                                            setSubject(detectedSubject);
                                            hasManuallySetSubject.current = true;
                                            setDetectedSubject(null); // Add this line to hide the notification
                                        },
                                        children: "Accept"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                        variant: "ghost",
                                        size: "sm",
                                        className: "text-xs h-7 text-muted-foreground",
                                        onClick: ()=>setDetectedSubject(null),
                                        children: "Dismiss"
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(AnimatePresence/* AnimatePresence */.N, {
                        children: shortcutFeedback && /*#__PURE__*/ (0,jsx_runtime.jsx)(proxy/* motion */.P.div, {
                            initial: {
                                opacity: 0,
                                y: -10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            exit: {
                                opacity: 0
                            },
                            className: "fixed top-4 right-4 bg-background border border-border shadow-md text-foreground px-3 py-2 rounded-md z-50 text-sm",
                            children: shortcutFeedback
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(KeyboardShortcuts, {
                        open: showKeyboardShortcuts,
                        onOpenChange: setShowKeyboardShortcuts
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "lg:col-span-12 space-y-4",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(tabs/* Tabs */.tU, {
                                value: activeTab,
                                onValueChange: setActiveTab,
                                className: "w-full",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(tabs/* TabsList */.j7, {
                                        className: "grid w-full grid-cols-3",
                                        children: [
                                            " ",
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(tabs/* TabsTrigger */.Xi, {
                                                value: "answer",
                                                children: "Answer"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(tabs/* TabsTrigger */.Xi, {
                                                value: "feedback",
                                                children: "Feedback"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(tabs/* TabsTrigger */.Xi, {
                                                value: "bulk",
                                                children: [
                                                    "Bulk Mark",
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(badge/* Badge */.E, {
                                                        variant: "outline",
                                                        className: "ml-2 text-amber-600 border-amber-400 bg-amber-50 dark:bg-amber-900/30 text-xs font-semibold",
                                                        children: "Very Beta"
                                                    })
                                                ]
                                            }),
                                            " "
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(tabs/* TabsContent */.av, {
                                        value: "answer",
                                        className: "pt-4 space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(label/* Label */.J, {
                                                        htmlFor: "question",
                                                        className: "flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                        children: "Question"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                        className: "text-muted-foreground text-xs ml-1",
                                                                        children: "(Required)"
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(badge/* Badge */.E, {
                                                                variant: "outline",
                                                                className: "font-normal text-xs",
                                                                children: "GCSE Level"
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_textarea/* Textarea */.T, {
                                                        id: "question",
                                                        placeholder: "Enter the question here...",
                                                        className: "min-h-[60px]",
                                                        value: question,
                                                        onChange: (e)=>setQuestion(e.target.value),
                                                        ref: questionInputRef
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(label/* Label */.J, {
                                                                htmlFor: "answer",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                        children: "Your Answer"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                        className: "text-muted-foreground text-xs ml-1",
                                                                        children: "(Required)"
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                                                variant: "outline",
                                                                size: "sm",
                                                                onClick: ()=>document.getElementById('image-upload').click(),
                                                                className: "text-xs h-7 ml-2",
                                                                disabled: imageLoading,
                                                                children: imageLoading ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                                                    children: [
                                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(loader_circle/* default */.A, {
                                                                            className: "mr-1 h-3 w-3 animate-spin"
                                                                        }),
                                                                        " Processing..."
                                                                    ]
                                                                }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                                                    children: [
                                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(upload/* default */.A, {
                                                                            className: "mr-1 h-3 w-3"
                                                                        }),
                                                                        " Upload Image"
                                                                    ]
                                                                })
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                                        type: "file",
                                                        id: "image-upload",
                                                        accept: "image/*",
                                                        className: "hidden",
                                                        onChange: handleImageChange,
                                                        disabled: imageLoading
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_textarea/* Textarea */.T, {
                                                        id: "answer",
                                                        placeholder: "Enter your answer here...",
                                                        className: "min-h-[150px]",
                                                        value: answer,
                                                        onChange: (e)=>setAnswer(e.target.value),
                                                        ref: answerInputRef
                                                    }),
                                                    image && !imageLoading && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mt-2 flex items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(badge/* Badge */.E, {
                                                                variant: "outline",
                                                                className: "text-xs",
                                                                children: [
                                                                    image.name,
                                                                    " (",
                                                                    Math.round(image.size / 1024),
                                                                    " KB)"
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                                                size: "sm",
                                                                variant: "ghost",
                                                                className: "h-6 w-6 p-0 ml-2",
                                                                onClick: ()=>setImage(null),
                                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(x/* default */.A, {
                                                                    className: "h-4 w-4"
                                                                })
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                                                size: "sm",
                                                                variant: "outline",
                                                                className: "text-xs h-7 ml-2",
                                                                onClick: handleProcessImage,
                                                                children: "Process Image"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "flex items-center justify-between",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(label/* Label */.J, {
                                                                        htmlFor: "subject",
                                                                        className: "text-sm",
                                                                        children: "Subject"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                                                                        variant: "link",
                                                                        size: "sm",
                                                                        className: "text-xs h-7 px-1 text-muted-foreground hover:text-primary",
                                                                        onClick: handleShowSubjectGuidance,
                                                                        tabIndex: -1,
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_help/* default */.A, {
                                                                                className: "mr-1 h-3 w-3"
                                                                            }),
                                                                            " View Guidance"
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_select/* Select */.l6, {
                                                                value: subject,
                                                                onValueChange: (value)=>{
                                                                    if (value === 'custom') {
                                                                        setIsAddingSubject(true);
                                                                        return;
                                                                    }
                                                                    setSubject(value);
                                                                    hasManuallySetSubject.current = true;
                                                                    // Reset question type if subject changes, as types are subject-specific
                                                                    setQuestionType("general");
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectTrigger */.bq, {
                                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectValue */.yv, {
                                                                            placeholder: "Select a subject"
                                                                        })
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectContent */.gC, {
                                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_select/* SelectGroup */.s3, {
                                                                            children: [
                                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectLabel */.TR, {
                                                                                    children: "Common Subjects"
                                                                                }),
                                                                                allSubjects.map((subj)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                                                        value: subj.value,
                                                                                        children: subj.label
                                                                                    }, subj.value)),
                                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                                                    value: "custom",
                                                                                    className: "text-primary",
                                                                                    children: "+ Add Custom Subject"
                                                                                })
                                                                            ]
                                                                        })
                                                                    })
                                                                ]
                                                            }),
                                                            isAddingSubject && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "mt-2 flex",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(input/* Input */.p, {
                                                                        ref: customSubjectInputRef,
                                                                        value: customSubject,
                                                                        onChange: (e)=>setCustomSubject(e.target.value),
                                                                        placeholder: "Enter subject name",
                                                                        className: "text-sm"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                                                        size: "sm",
                                                                        className: "ml-2 px-2",
                                                                        onClick: addCustomSubject,
                                                                        disabled: !customSubject.trim(),
                                                                        children: "Add"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                                                        size: "sm",
                                                                        variant: "ghost",
                                                                        className: "ml-1 px-2",
                                                                        onClick: ()=>setIsAddingSubject(false),
                                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(x/* default */.A, {
                                                                            className: "h-4 w-4"
                                                                        })
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                className: "flex items-center justify-between",
                                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(label/* Label */.J, {
                                                                    htmlFor: "examBoard",
                                                                    className: "text-sm",
                                                                    children: "Exam Board"
                                                                })
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_select/* Select */.l6, {
                                                                value: examBoard,
                                                                onValueChange: setExamBoard,
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectTrigger */.bq, {
                                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectValue */.yv, {
                                                                            placeholder: "Select an exam board"
                                                                        })
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectContent */.gC, {
                                                                        children: EXAM_BOARDS.map((board)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                                                value: board.value,
                                                                                children: board.label
                                                                            }, board.value))
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    ((_allSubjects_find2 = allSubjects.find((s)=>s.value === subject)) === null || _allSubjects_find2 === void 0 ? void 0 : _allSubjects_find2.hasTiers) && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(label/* Label */.J, {
                                                                className: "text-sm",
                                                                children: "Tier"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "flex space-x-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                                                        variant: tier === "higher" ? "default" : "outline",
                                                                        size: "sm",
                                                                        className: "flex-1",
                                                                        onClick: ()=>setTier("higher"),
                                                                        children: "Higher"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                                                        variant: tier === "foundation" ? "default" : "outline",
                                                                        size: "sm",
                                                                        className: "flex-1",
                                                                        onClick: ()=>setTier("foundation"),
                                                                        children: "Foundation"
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    subject === "english" && examBoard === "aqa" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(label/* Label */.J, {
                                                                htmlFor: "questionType",
                                                                className: "text-sm",
                                                                children: "Question Type"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_select/* Select */.l6, {
                                                                value: questionType,
                                                                onValueChange: setQuestionType,
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectTrigger */.bq, {
                                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectValue */.yv, {
                                                                            placeholder: "Select question type"
                                                                        })
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectContent */.gC, {
                                                                        children: QUESTION_TYPES.english.aqa.map((type)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                                                value: type.value,
                                                                                children: type.label
                                                                            }, type.value))
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(label/* Label */.J, {
                                                                htmlFor: "userType",
                                                                className: "text-sm",
                                                                children: "I am a"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_select/* Select */.l6, {
                                                                value: userType,
                                                                onValueChange: setUserType,
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectTrigger */.bq, {
                                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectValue */.yv, {
                                                                            placeholder: "Select user type"
                                                                        })
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectContent */.gC, {
                                                                        children: USER_TYPES.map((type)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                                                value: type.value,
                                                                                children: type.label
                                                                            }, type.value))
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                                                        variant: "outline",
                                                        size: "sm",
                                                        onClick: ()=>setShowAdvancedOptions(!showAdvancedOptions),
                                                        className: "text-xs",
                                                        children: [
                                                            showAdvancedOptions ? /*#__PURE__*/ (0,jsx_runtime.jsx)(chevron_up/* default */.A, {
                                                                className: "mr-1 h-3 w-3"
                                                            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(chevron_down/* default */.A, {
                                                                className: "mr-1 h-3 w-3"
                                                            }),
                                                            "Advanced Options"
                                                        ]
                                                    }),
                                                    showAdvancedOptions && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mt-3 space-y-4 border p-4 rounded-md bg-muted border-border",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "flex justify-between items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(label/* Label */.J, {
                                                                                        htmlFor: "markScheme",
                                                                                        className: "text-sm",
                                                                                        children: [
                                                                                            "Mark Scheme ",
                                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                                className: "text-muted-foreground text-xs",
                                                                                                children: "(Optional)"
                                                                                            })
                                                                                        ]
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                                        className: "text-xs text-muted-foreground mt-0.5",
                                                                                        children: "Adding a mark scheme will enhance feedback with detailed criteria analysis"
                                                                                    })
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                                className: "flex gap-2",
                                                                                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                                                                                    variant: "outline",
                                                                                    size: "sm",
                                                                                    className: "text-xs h-7",
                                                                                    onClick: generateMarkScheme,
                                                                                    disabled: loading || !question || backendStatusRef.current !== 'online',
                                                                                    ref: markSchemeButtonRef,
                                                                                    children: [
                                                                                        loading ? /*#__PURE__*/ (0,jsx_runtime.jsx)(loader_circle/* default */.A, {
                                                                                            className: "mr-1 h-3 w-3 animate-spin"
                                                                                        }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(file_plus/* default */.A, {
                                                                                            className: "mr-1 h-3 w-3"
                                                                                        }),
                                                                                        "Generate"
                                                                                    ]
                                                                                })
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_textarea/* Textarea */.T, {
                                                                        id: "markScheme",
                                                                        placeholder: "Enter mark scheme details...",
                                                                        className: "min-h-[100px]",
                                                                        value: markScheme,
                                                                        onChange: (e)=>setMarkScheme(e.target.value)
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(label/* Label */.J, {
                                                                        htmlFor: "totalMarks",
                                                                        className: "text-sm",
                                                                        children: [
                                                                            "Total Marks ",
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                className: "text-muted-foreground text-xs",
                                                                                children: "(Optional)"
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(input/* Input */.p, {
                                                                        id: "totalMarks",
                                                                        type: "number",
                                                                        placeholder: "e.g., 20",
                                                                        value: totalMarks,
                                                                        onChange: (e)=>setTotalMarks(e.target.value),
                                                                        className: "max-w-[120px]",
                                                                        ref: marksInputRef
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "text-xs text-muted-foreground",
                                                                        children: 'If not provided, system will attempt to detect total marks from the question (like "8 marks" or "[Total: 10]").'
                                                                    })
                                                                ]
                                                            }),
                                                            subject === "english" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(label/* Label */.J, {
                                                                        htmlFor: "textExtract",
                                                                        className: "text-sm",
                                                                        children: [
                                                                            "Text Extract ",
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                className: "text-muted-foreground text-xs",
                                                                                children: "(Optional)"
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_textarea/* Textarea */.T, {
                                                                        id: "textExtract",
                                                                        placeholder: "Enter any text extract the question refers to...",
                                                                        className: "min-h-[100px]",
                                                                        value: textExtract,
                                                                        onChange: (e)=>setTextExtract(e.target.value)
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(label/* Label */.J, {
                                                                        htmlFor: "relevantMaterial",
                                                                        className: "text-sm",
                                                                        children: [
                                                                            "Relevant Material ",
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                className: "text-muted-foreground text-xs",
                                                                                children: "(Optional)"
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_textarea/* Textarea */.T, {
                                                                        id: "relevantMaterial",
                                                                        placeholder: "Enter any additional context, notes or material...",
                                                                        className: "min-h-[100px]",
                                                                        value: relevantMaterial,
                                                                        onChange: (e)=>setRelevantMaterial(e.target.value)
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "mt-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                className: "flex items-center justify-between",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                        className: "text-xs text-muted-foreground",
                                                                                        children: "Add image as relevant material"
                                                                                    }),
                                                                                    selectedModel !== "gemini-2.5-flash-preview-05-20" && /*#__PURE__*/ (0,jsx_runtime.jsx)(badge/* Badge */.E, {
                                                                                        variant: "outline",
                                                                                        className: "text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50",
                                                                                        children: "Only works with Gemini 2.5 Flash"
                                                                                    })
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                className: "flex items-center gap-2 mt-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                                                                        variant: "outline",
                                                                                        size: "sm",
                                                                                        onClick: ()=>document.getElementById('relevant-material-image').click(),
                                                                                        className: "text-xs h-7",
                                                                                        disabled: selectedModel !== "gemini-2.5-flash-preview-05-20" || relevantMaterialImageLoading,
                                                                                        children: relevantMaterialImageLoading ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(loader_circle/* default */.A, {
                                                                                                    className: "mr-1 h-3 w-3 animate-spin"
                                                                                                }),
                                                                                                " Processing..."
                                                                                            ]
                                                                                        }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(upload/* default */.A, {
                                                                                                    className: "mr-1 h-3 w-3"
                                                                                                }),
                                                                                                " Upload Image"
                                                                                            ]
                                                                                        })
                                                                                    }),
                                                                                    selectedModel !== "gemini-2.5-flash-preview-05-20" && /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                                                                        variant: "link",
                                                                                        size: "sm",
                                                                                        className: "text-xs h-7 text-amber-600 dark:text-amber-400 px-0",
                                                                                        onClick: ()=>{
                                                                                            setSelectedModel("gemini-2.5-flash-preview-05-20");
                                                                                            setHasExtractedText(true);
                                                                                        },
                                                                                        children: "Switch to Gemini 2.5 Flash"
                                                                                    })
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                                                                type: "file",
                                                                                id: "relevant-material-image",
                                                                                accept: "image/*",
                                                                                className: "hidden",
                                                                                onChange: handleRelevantMaterialImageChange,
                                                                                disabled: selectedModel !== "gemini-2.5-flash-preview-05-20" || relevantMaterialImageLoading
                                                                            }),
                                                                            relevantMaterialImage && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                className: "mt-2 flex items-center",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(badge/* Badge */.E, {
                                                                                        variant: "outline",
                                                                                        className: "text-xs",
                                                                                        children: [
                                                                                            relevantMaterialImage.name,
                                                                                            " (",
                                                                                            Math.round(relevantMaterialImage.size / 1024),
                                                                                            " KB)"
                                                                                        ]
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                                                                        size: "sm",
                                                                                        variant: "ghost",
                                                                                        className: "h-6 w-6 p-0 ml-2",
                                                                                        onClick: ()=>setRelevantMaterialImage(null),
                                                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(x/* default */.A, {
                                                                                            className: "h-4 w-4"
                                                                                        })
                                                                                    })
                                                                                ]
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(label/* Label */.J, {
                                                                        htmlFor: "aiModel",
                                                                        className: "text-sm",
                                                                        children: [
                                                                            "AI Model ",
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                className: "text-muted-foreground text-xs",
                                                                                children: "(Optional)"
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_select/* Select */.l6, {
                                                                        value: selectedModel,
                                                                        onValueChange: (value)=>{
                                                                            // Prevent re-renders if selecting the same model
                                                                            if (value === selectedModel) return;
                                                                            const now = Date.now();
                                                                            const modelRateLimit = MODEL_RATE_LIMITS[value] || 10000;
                                                                            const lastModelRequestTime = modelLastRequestTimes[value] || 0;
                                                                            const timeSinceLastRequest = now - lastModelRequestTime;
                                                                            // Always update the selected model in the UI first
                                                                            setSelectedModel(value);
                                                                            // Don't set thinking budget here - it will be set in the useEffect
                                                                            // This prevents a double state update
                                                                            // Then, if rate limited, show a toast. 
                                                                            // The actual API call will be blocked later if they try to use it.
                                                                            if (timeSinceLastRequest < modelRateLimit) {
                                                                                var _AI_MODELS_find;
                                                                                const waitTimeSeconds = Math.ceil((modelRateLimit - timeSinceLastRequest) / 1000);
                                                                                sonner_dist/* toast */.oR.warning("".concat(((_AI_MODELS_find = AI_MODELS.find((m)=>m.value === value)) === null || _AI_MODELS_find === void 0 ? void 0 : _AI_MODELS_find.label) || value, " was used recently. Actual use might be rate-limited for ").concat(waitTimeSeconds, " more seconds."));
                                                                            }
                                                                        },
                                                                        disabled: followUpLoading,
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectTrigger */.bq, {
                                                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectValue */.yv, {
                                                                                    placeholder: "Select AI model"
                                                                                })
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectContent */.gC, {
                                                                                children: AI_MODELS.map((model)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                                                        value: model.value,
                                                                                        className: "py-2",
                                                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                            className: "flex flex-col",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                                    children: model.label
                                                                                                }),
                                                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                                    className: "text-xs text-muted-foreground",
                                                                                                    children: model.description
                                                                                                })
                                                                                            ]
                                                                                        })
                                                                                    }, model.value))
                                                                            })
                                                                        ]
                                                                    }),
                                                                    selectedModel === "gemini-2.5-flash-preview-05-20" && hasExtractedText && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(triangle_alert/* default */.A, {
                                                                                className: "h-3 w-3 mr-1"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                children: "Uses direct Gemini API with custom key, may need backend updates"
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                className: "space-y-2 pt-2",
                                                                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                    className: "flex items-center justify-between",
                                                                    children: [
                                                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(label/* Label */.J, {
                                                                            htmlFor: "autoMaxTokens",
                                                                            className: "text-sm flex items-center",
                                                                            children: [
                                                                                "Automatic Max Tokens",
                                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipProvider */.Bc, {
                                                                                    children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(tooltip/* Tooltip */.m_, {
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipTrigger */.k$, {
                                                                                                asChild: true,
                                                                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_help/* default */.A, {
                                                                                                    className: "h-3 w-3 ml-1.5 text-muted-foreground cursor-help"
                                                                                                })
                                                                                            }),
                                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipContent */.ZI, {
                                                                                                side: "top",
                                                                                                className: "max-w-xs",
                                                                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                                                    children: "When enabled, the AI will automatically determine the appropriate maximum number of tokens for the response. Disable to set a custom limit."
                                                                                                })
                                                                                            })
                                                                                        ]
                                                                                    })
                                                                                })
                                                                            ]
                                                                        }),
                                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Switch, {
                                                                            id: "autoMaxTokens",
                                                                            checked: autoMaxTokens,
                                                                            onCheckedChange: setAutoMaxTokens
                                                                        })
                                                                    ]
                                                                })
                                                            }),
                                                            !autoMaxTokens && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "space-y-2 mt-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(label/* Label */.J, {
                                                                        htmlFor: "maxTokensSlider",
                                                                        className: "text-sm",
                                                                        children: [
                                                                            "Max Tokens: ",
                                                                            maxTokens
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "flex items-center gap-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Slider, {
                                                                                id: "maxTokensSlider",
                                                                                min: 256,
                                                                                max: 8192,
                                                                                step: 128,
                                                                                value: [
                                                                                    maxTokens
                                                                                ],
                                                                                onValueChange: (value)=>setMaxTokens(value[0]),
                                                                                className: "flex-grow"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(input/* Input */.p, {
                                                                                id: "maxTokensInput",
                                                                                type: "number",
                                                                                value: maxTokens,
                                                                                onChange: (e)=>{
                                                                                    const val = parseInt(e.target.value);
                                                                                    if (!isNaN(val)) {
                                                                                        if (val >= 256 && val <= 8192) {
                                                                                            setMaxTokens(val);
                                                                                        } else if (val < 256) {
                                                                                            setMaxTokens(256);
                                                                                        } else if (val > 8192) {
                                                                                            setMaxTokens(8192);
                                                                                        }
                                                                                    } else if (e.target.value === '') {
                                                                                        setMaxTokens(256); // Default to min if empty
                                                                                    }
                                                                                },
                                                                                className: "w-24 text-sm h-9",
                                                                                min: 256,
                                                                                max: 8192,
                                                                                step: 128
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "text-xs text-muted-foreground",
                                                                        children: "Defines the maximum length of the AI's response. (Min: 256, Max: 8192). Default is 2048."
                                                                    })
                                                                ]
                                                            }),
                                                            selectedModel === "gemini-2.5-flash-preview-05-20" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "space-y-2 pt-2 border-t border-border mt-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "flex items-center justify-between",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(label/* Label */.J, {
                                                                                htmlFor: "enableThinkingBudget",
                                                                                className: "text-sm flex items-center",
                                                                                children: [
                                                                                    "Enable Thinking Budget",
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipProvider */.Bc, {
                                                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(tooltip/* Tooltip */.m_, {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipTrigger */.k$, {
                                                                                                    asChild: true,
                                                                                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_help/* default */.A, {
                                                                                                        className: "h-3 w-3 ml-1.5 text-muted-foreground cursor-help"
                                                                                                    })
                                                                                                }),
                                                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipContent */.ZI, {
                                                                                                    side: "top",
                                                                                                    className: "max-w-xs",
                                                                                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                                                        children: "When enabled, the model will use a thinking budget to solve more complex tasks. This may improve answer quality but might increase response time."
                                                                                                    })
                                                                                                })
                                                                                            ]
                                                                                        })
                                                                                    })
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Switch, {
                                                                                id: "enableThinkingBudget",
                                                                                checked: enableThinkingBudget,
                                                                                onCheckedChange: (checked)=>{
                                                                                    setEnableThinkingBudget(checked);
                                                                                }
                                                                            })
                                                                        ]
                                                                    }),
                                                                    enableThinkingBudget && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "space-y-2 mt-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(label/* Label */.J, {
                                                                                htmlFor: "thinkingBudgetSlider",
                                                                                className: "text-sm",
                                                                                children: [
                                                                                    "Thinking Budget: ",
                                                                                    thinkingBudget
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                className: "flex items-center gap-3",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Slider, {
                                                                                        id: "thinkingBudgetSlider",
                                                                                        min: 512,
                                                                                        max: 24576,
                                                                                        step: 512,
                                                                                        value: [
                                                                                            thinkingBudget
                                                                                        ],
                                                                                        onValueChange: (value)=>setThinkingBudget(value[0]),
                                                                                        className: "flex-grow"
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(input/* Input */.p, {
                                                                                        id: "thinkingBudgetInput",
                                                                                        type: "number",
                                                                                        value: thinkingBudget,
                                                                                        onChange: (e)=>{
                                                                                            const val = parseInt(e.target.value);
                                                                                            if (!isNaN(val)) {
                                                                                                if (val >= 0 && val <= 24576) {
                                                                                                    setThinkingBudget(val);
                                                                                                } else if (val < 0) {
                                                                                                    setThinkingBudget(0);
                                                                                                } else if (val > 24576) {
                                                                                                    setThinkingBudget(24576); // Max is 24576
                                                                                                }
                                                                                            } else if (e.target.value === '') {
                                                                                                setThinkingBudget(0); // Default to 0 if empty
                                                                                            }
                                                                                        },
                                                                                        className: "w-24 text-sm h-9",
                                                                                        min: 0,
                                                                                        max: 24576,
                                                                                        step: 512
                                                                                    })
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                                className: "text-xs text-muted-foreground",
                                                                                children: "Defines the maximum tokens used for thinking. Higher values may improve quality for complex tasks. (Min: 0, Max: 24576)"
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            }, "thinking-budget-controls")
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                                        ref: submitButtonRef,
                                                        onClick: handleSubmitForMarking,
                                                        disabled: loading || !answer || backendStatusRef.current !== 'online',
                                                        className: "w-full",
                                                        children: loading ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                                            children: [
                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(loader_circle/* default */.A, {
                                                                    className: "mr-2 h-4 w-4 animate-spin"
                                                                }),
                                                                "Processing..."
                                                            ]
                                                        }) : backendStatusRef.current !== 'online' ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                                            children: [
                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(triangle_alert/* default */.A, {
                                                                    className: "mr-2 h-4 w-4"
                                                                }),
                                                                "Wake up API first"
                                                            ]
                                                        }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                                            children: [
                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(zap/* default */.A, {
                                                                    className: "mr-2 h-4 w-4"
                                                                }),
                                                                "Mark Answer"
                                                            ]
                                                        })
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "flex justify-between",
                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                                                            variant: "outline",
                                                            size: "sm",
                                                            onClick: resetForm,
                                                            className: "text-xs",
                                                            disabled: loading,
                                                            children: [
                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_cw/* default */.A, {
                                                                    className: "mr-1 h-3 w-3"
                                                                }),
                                                                "Reset Form"
                                                            ]
                                                        })
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(tabs/* TabsContent */.av, {
                                        value: "feedback",
                                        className: "pt-4 relative",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(FeedbackDisplay, {
                                            loading: loading,
                                            feedback: feedback,
                                            grade: grade,
                                            selectedModel: selectedModel,
                                            modelThinking: modelThinking,
                                            achievedMarks: achievedMarks,
                                            totalMarks: totalMarks,
                                            processingProgress: processingProgress,
                                            setActiveTab: setActiveTab,
                                            markScheme: markScheme,
                                            onAskFollowUp: handleAskFollowUp,
                                            followUpEnabled: !!feedback && backendStatusRef.current === 'online'
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(tabs/* TabsContent */.av, {
                                        value: "bulk",
                                        className: "pt-4 space-y-6",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(card/* Card */.Zp, {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(card/* CardHeader */.aR, {
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(card/* CardTitle */.ZB, {
                                                                children: "Bulk Assessment Processing"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(card/* CardDescription */.BT, {
                                                                children: "Upload a file containing multiple questions and answers to mark in bulk. Supported formats: CSV, JSON, and TXT files."
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(card/* CardContent */.Wu, {
                                                        className: "space-y-4",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(label/* Label */.J, {
                                                                        htmlFor: "bulk-file-upload",
                                                                        children: "Upload File"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(input/* Input */.p, {
                                                                        id: "bulk-file-upload",
                                                                        type: "file",
                                                                        accept: ".csv,.json,.txt",
                                                                        onChange: handleBulkFileChange,
                                                                        ref: bulkFileUploadRef,
                                                                        disabled: bulkProcessing
                                                                    }),
                                                                    bulkFile && /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                        className: "text-sm text-muted-foreground",
                                                                        children: [
                                                                            "Selected file: ",
                                                                            bulkFile.name
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                        className: "text-xs text-muted-foreground",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                                                                children: "Format requirements:"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("br", {}),
                                                                            "- CSV: Include 'Question' and 'Answer' columns",
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("br", {}),
                                                                            "- JSON: Array of objects with 'question' and 'answer' properties",
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("br", {}),
                                                                            "- TXT: One item per line with question and answer separated by tab or comma"
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(label/* Label */.J, {
                                                                        children: "Settings Preference"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_select/* Select */.l6, {
                                                                        value: bulkSettingPreference,
                                                                        onValueChange: setBulkSettingPreference,
                                                                        disabled: bulkProcessing,
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectTrigger */.bq, {
                                                                                className: "w-[280px]",
                                                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectValue */.yv, {
                                                                                    placeholder: "Choose settings source"
                                                                                })
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_select/* SelectContent */.gC, {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                                                        value: "global",
                                                                                        children: "Use Global Settings (from Answer tab)"
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                                                        value: "file",
                                                                                        children: "Use Settings from File (if available)"
                                                                                    })
                                                                                ]
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "text-xs text-muted-foreground",
                                                                        children: "If 'Use Settings from File' is chosen and a setting is missing for an item, global settings will be used as a fallback."
                                                                    })
                                                                ]
                                                            }),
                                                            bulkProcessing && bulkProgress.total > 0 && /*#__PURE__*/ (0,jsx_runtime.jsx)(BatchProcessingControls, {
                                                                isProcessing: bulkProcessing,
                                                                progress: bulkProgress,
                                                                onPause: handlePauseBulkProcessing,
                                                                onResume: handleResumeBulkProcessing,
                                                                onCancel: handleCancelBulkProcessing,
                                                                isPaused: isBulkProcessingPaused,
                                                                parallelism: parallelProcessing,
                                                                onParallelismChange: handleParallelismChange
                                                            }),
                                                            !bulkProcessing && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(label/* Label */.J, {
                                                                        htmlFor: "parallelism-setting",
                                                                        className: "text-sm whitespace-nowrap",
                                                                        children: "Parallel Processing:"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_select/* Select */.l6, {
                                                                        id: "parallelism-setting",
                                                                        value: parallelProcessing.toString(),
                                                                        onValueChange: (value)=>setParallelProcessing(parseInt(value)),
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectTrigger */.bq, {
                                                                                className: "w-24",
                                                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectValue */.yv, {
                                                                                    placeholder: parallelProcessing
                                                                                })
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_select/* SelectContent */.gC, {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                                                        value: "1",
                                                                                        children: "1 task"
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                                                        value: "2",
                                                                                        children: "2 tasks"
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                                                        value: "3",
                                                                                        children: "3 tasks"
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                                                        value: "4",
                                                                                        children: "4 tasks"
                                                                                    })
                                                                                ]
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipProvider */.Bc, {
                                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(tooltip/* Tooltip */.m_, {
                                                                            children: [
                                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipTrigger */.k$, {
                                                                                    asChild: true,
                                                                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_help/* default */.A, {
                                                                                        className: "h-4 w-4 text-muted-foreground"
                                                                                    })
                                                                                }),
                                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(tooltip/* TooltipContent */.ZI, {
                                                                                    side: "right",
                                                                                    className: "max-w-xs",
                                                                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                                        children: "Process multiple items simultaneously to speed up bulk marking. Higher values may increase API rate limiting."
                                                                                    })
                                                                                })
                                                                            ]
                                                                        })
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                                                onClick: handleProcessBulkFile,
                                                                disabled: !bulkFile || bulkProcessing || backendStatusRef.current !== 'online',
                                                                className: "w-full sm:w-auto",
                                                                children: bulkProcessing ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(react.Fragment, {
                                                                    children: [
                                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(loader_circle/* default */.A, {
                                                                            className: "mr-2 h-4 w-4 animate-spin"
                                                                        }),
                                                                        isBulkProcessingPaused ? "Paused" : "Processing (".concat(bulkProgress.processed, "/").concat(bulkProgress.total, ")...")
                                                                    ]
                                                                }) : backendStatusRef.current !== 'online' ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(react.Fragment, {
                                                                    children: [
                                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(triangle_alert/* default */.A, {
                                                                            className: "mr-2 h-4 w-4"
                                                                        }),
                                                                        " API Offline"
                                                                    ]
                                                                }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)(react.Fragment, {
                                                                    children: [
                                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(cloud_upload/* default */.A, {
                                                                            className: "mr-2 h-4 w-4"
                                                                        }),
                                                                        " Process File"
                                                                    ]
                                                                })
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            (bulkProcessing || bulkResults.length > 0) && /*#__PURE__*/ (0,jsx_runtime.jsxs)(card/* Card */.Zp, {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(card/* CardHeader */.aR, {
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(card/* CardTitle */.ZB, {
                                                                children: "Bulk Results"
                                                            }),
                                                            bulkProcessing && bulkProgress.total > 0 && /*#__PURE__*/ (0,jsx_runtime.jsxs)(card/* CardDescription */.BT, {
                                                                children: [
                                                                    "Processing item ",
                                                                    bulkProgress.currentItem || '-',
                                                                    " of ",
                                                                    bulkProgress.total,
                                                                    ". Processed: ",
                                                                    bulkProgress.processed,
                                                                    "."
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(card/* CardContent */.Wu, {
                                                        children: [
                                                            bulkResults.length === 0 && bulkProcessing && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "flex items-center justify-center p-6 text-muted-foreground",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(loader_circle/* default */.A, {
                                                                        className: "mr-2 h-5 w-5 animate-spin"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                        children: "Waiting for results..."
                                                                    })
                                                                ]
                                                            }),
                                                            bulkResults.length > 0 && /*#__PURE__*/ (0,jsx_runtime.jsxs)(scroll_area/* ScrollArea */.F, {
                                                                className: "h-[400px] w-full",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                        className: "space-y-4 pr-4",
                                                                        children: bulkResults.map((result, index)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                className: "p-3 border rounded-md bg-muted/30",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                        className: "flex justify-between items-start mb-1",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("h4", {
                                                                                                className: "font-semibold text-sm",
                                                                                                children: [
                                                                                                    "Item ",
                                                                                                    result.itemIndex + 1,
                                                                                                    ": ",
                                                                                                    result.question ? result.question.substring(0, 100) + (result.question.length > 100 ? '...' : '') : 'N/A'
                                                                                                ]
                                                                                            }),
                                                                                            result.grade && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                                                className: "inline-flex items-center justify-center h-6 w-6 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-bold rounded-full text-xs shadow-sm",
                                                                                                children: result.grade
                                                                                            })
                                                                                        ]
                                                                                    }),
                                                                                    result.error ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(Alert, {
                                                                                        variant: "destructive",
                                                                                        className: "py-2 px-3",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(triangle_alert/* default */.A, {
                                                                                                className: "h-4 w-4"
                                                                                            }),
                                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(AlertTitle, {
                                                                                                className: "text-xs",
                                                                                                children: "Error"
                                                                                            }),
                                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(AlertDescription, {
                                                                                                className: "text-xs",
                                                                                                children: result.error
                                                                                            })
                                                                                        ]
                                                                                    }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                        className: "text-xs",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                                                className: "mt-1",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                                                                                        children: "Feedback Summary:"
                                                                                                    }),
                                                                                                    " ",
                                                                                                    result.feedback ? result.feedback.substring(0, 150) + (result.feedback.length > 150 ? '...' : '') : 'N/A'
                                                                                                ]
                                                                                            }),
                                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                                                                                                variant: "link",
                                                                                                size: "sm",
                                                                                                className: "p-0 h-auto mt-1 text-xs",
                                                                                                onClick: ()=>handleViewItemDetails(result),
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(external_link/* default */.A, {
                                                                                                        className: "h-3 w-3 mr-1"
                                                                                                    }),
                                                                                                    "View Full Details"
                                                                                                ]
                                                                                            })
                                                                                        ]
                                                                                    })
                                                                                ]
                                                                            }, index))
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(scroll_area/* ScrollBar */.$, {
                                                                        orientation: "vertical"
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    bulkResults.length > 0 && /*#__PURE__*/ (0,jsx_runtime.jsxs)(card/* CardFooter */.wL, {
                                                        className: "flex justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                                                                variant: "outline",
                                                                size: "sm",
                                                                onClick: ()=>setBulkResults([]),
                                                                disabled: bulkProcessing,
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(x/* default */.A, {
                                                                        className: "h-4 w-4 mr-1"
                                                                    }),
                                                                    " Clear Results"
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_button/* Button */.$, {
                                                                size: "sm",
                                                                onClick: ()=>{
                                                                    // Create CSV content
                                                                    const csvContent = [
                                                                        [
                                                                            "Item",
                                                                            "Question",
                                                                            "Answer",
                                                                            "Grade",
                                                                            "Marks",
                                                                            "Total Marks",
                                                                            "Feedback"
                                                                        ].join(","),
                                                                        ...bulkResults.map((item, index)=>{
                                                                            var _item_question, _item_answer, _item_feedback, _item_error;
                                                                            return [
                                                                                index + 1,
                                                                                '"'.concat(((_item_question = item.question) === null || _item_question === void 0 ? void 0 : _item_question.replace(/"/g, '""')) || '', '"'),
                                                                                '"'.concat(((_item_answer = item.answer) === null || _item_answer === void 0 ? void 0 : _item_answer.replace(/"/g, '""')) || '', '"'),
                                                                                item.grade || 'N/A',
                                                                                item.achievedMarks || '',
                                                                                item.totalMarks || '',
                                                                                '"'.concat(((_item_feedback = item.feedback) === null || _item_feedback === void 0 ? void 0 : _item_feedback.replace(/"/g, '""')) || ((_item_error = item.error) === null || _item_error === void 0 ? void 0 : _item_error.replace(/"/g, '""')) || '', '"')
                                                                            ].join(",");
                                                                        })
                                                                    ].join("\n");
                                                                    // Create download link
                                                                    const blob = new Blob([
                                                                        csvContent
                                                                    ], {
                                                                        type: 'text/csv;charset=utf-8;'
                                                                    });
                                                                    const url = URL.createObjectURL(blob);
                                                                    const link = document.createElement('a');
                                                                    link.setAttribute('href', url);
                                                                    link.setAttribute('download', "bulk-results-".concat(new Date().toISOString().split('T')[0], ".csv"));
                                                                    document.body.appendChild(link);
                                                                    link.click();
                                                                    document.body.removeChild(link);
                                                                    sonner_dist/* toast */.oR.success("Results downloaded as CSV file");
                                                                },
                                                                disabled: bulkProcessing || bulkResults.length === 0,
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(download/* default */.A, {
                                                                        className: "h-4 w-4 mr-1"
                                                                    }),
                                                                    " Download Results"
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        })
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(BulkItemPreviewDialog, {
                open: showPreviewDialog,
                onOpenChange: setShowPreviewDialog,
                item: previewItem,
                onClose: ()=>setShowPreviewDialog(false)
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Dialog, {
                open: showFollowUpDialog,
                onOpenChange: setShowFollowUpDialog,
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(DialogContent, {
                    className: "sm:max-w-[600px] max-h-[80vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(DialogHeader, {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(DialogTitle, {
                                    children: "Ask a Follow-Up Question"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(DialogDescription, {
                                    children: "Need clarification about your feedback? Ask the AI for more help."
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "space-y-4 py-4",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(label/* Label */.J, {
                                            htmlFor: "follow-up-question",
                                            children: "Your Question"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_textarea/* Textarea */.T, {
                                            id: "follow-up-question",
                                            placeholder: "e.g., Can you explain more about why I lost marks on the first point? What would a better answer look like?",
                                            value: followUpQuestion,
                                            onChange: (e)=>setFollowUpQuestion(e.target.value),
                                            className: "min-h-[100px]",
                                            disabled: followUpLoading
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(label/* Label */.J, {
                                            htmlFor: "follow-up-model",
                                            children: "Model to use"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_select/* Select */.l6, {
                                            value: selectedModel,
                                            onValueChange: (value)=>{
                                                // Prevent re-renders if selecting the same model
                                                if (value === selectedModel) return;
                                                // Check for rate limiting when switching models
                                                const now = Date.now();
                                                const modelLimit = MODEL_RATE_LIMITS[value] || 10000;
                                                const lastModelRequest = modelLastRequestTimes[value] || 0;
                                                const timeSince = now - lastModelRequest;
                                                if (timeSince < modelLimit) {
                                                    const waitTime = Math.ceil((modelLimit - timeSince) / 1000);
                                                    sonner_dist/* toast */.oR.warning("Model was used recently. Switching anyway, but response may be delayed.");
                                                }
                                                setSelectedModel(value);
                                                // Update thinking budget when model changes for follow-up
                                                setThinkingBudget(DEFAULT_THINKING_BUDGETS[value] || 1024);
                                            },
                                            disabled: followUpLoading,
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectTrigger */.bq, {
                                                    id: "follow-up-model",
                                                    className: "w-full",
                                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectValue */.yv, {
                                                        placeholder: "Select AI model"
                                                    })
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectContent */.gC, {
                                                    children: AI_MODELS.map((model)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                            value: model.value,
                                                            className: "py-2",
                                                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "flex flex-col",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                        children: model.label
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                        className: "text-xs text-muted-foreground",
                                                                        children: model.description
                                                                    })
                                                                ]
                                                            })
                                                        }, model.value))
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                            className: "text-xs text-muted-foreground",
                                            children: "If one model isn't responding, try another model for this follow-up."
                                        })
                                    ]
                                }),
                                followUpResponse && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "space-y-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(label/* Label */.J, {
                                            children: "AI Response"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                            className: "p-4 rounded-md bg-muted/30 border border-border min-h-[100px]",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(MathMarkdown, {
                                                children: followUpResponse
                                            })
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(DialogFooter, {
                            className: "flex flex-col sm:flex-row gap-2 justify-between sm:justify-end",
                            children: [
                                followUpLoading && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "flex items-center text-muted-foreground text-sm",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(loader_circle/* default */.A, {
                                            className: "animate-spin h-4 w-4 mr-2"
                                        }),
                                        "Processing your question..."
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                            variant: "outline",
                                            onClick: ()=>setShowFollowUpDialog(false),
                                            disabled: followUpLoading,
                                            children: "Close"
                                        }),
                                        !followUpResponse && /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                            onClick: handleSubmitFollowUp,
                                            disabled: followUpLoading || !followUpQuestion.trim(),
                                            children: followUpLoading ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(loader_circle/* default */.A, {
                                                        className: "animate-spin h-4 w-4 mr-2"
                                                    }),
                                                    "Submitting..."
                                                ]
                                            }) : 'Get Answer'
                                        }),
                                        followUpResponse && !followUpLoading && /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_button/* Button */.$, {
                                            onClick: ()=>{
                                                setFollowUpQuestion("");
                                                setFollowUpResponse("");
                                            },
                                            children: "Ask Another Question"
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            })
        ]
    });
};
/* harmony default export */ const aimarker = (AIMarker);


/***/ }),

/***/ 86653:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q: () => (/* binding */ useBackendStatus),
/* harmony export */   h: () => (/* binding */ useSubjectDetection)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12115);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(54052);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_1__);
/* __next_internal_client_entry_do_not_use__ useSubjectDetection,useBackendStatus auto */ 

// Properly defined hooks with clean function context
const useSubjectDetection = (subjectKeywords, loading)=>{
    // Hook to classify subject from text
    const classifySubjectAI = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (answerText)=>{
        if (!answerText || answerText.length < 20) return null;
        try {
            // Use keyword detection for subject classification
            for (const [subject, keywords] of Object.entries(subjectKeywords)){
                for (const keyword of keywords){
                    if (answerText.toLowerCase().includes(keyword.toLowerCase())) {
                        return subject;
                    }
                }
            }
            return null;
        } catch (err) {
            console.error("Subject classification error:", err);
            return null;
        }
    }, [
        subjectKeywords
    ]);
    // Create a ref to store the debounced function
    // This way, the same function instance persists across renders
    const debouncedFnRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    // Initialize the debounced function on mount or when dependencies change
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
        debouncedFnRef.current = lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default()(async (text, subject, hasManuallySetSubject, allSubjects, setSubject, setDetectedSubject, setSuccess)=>{
            if (loading) return; // Don't run while loading
            const detected = await classifySubjectAI(text);
            if (detected && detected !== subject && !hasManuallySetSubject.current) {
                var _allSubjects_find, _allSubjects_find1;
                // Store the previous subject to show a nice transition
                const prevSubject = ((_allSubjects_find = allSubjects.find((s)=>s.value === subject)) === null || _allSubjects_find === void 0 ? void 0 : _allSubjects_find.label) || '';
                const newSubject = ((_allSubjects_find1 = allSubjects.find((s)=>s.value === detected)) === null || _allSubjects_find1 === void 0 ? void 0 : _allSubjects_find1.label) || '';
                setSubject(detected);
                setDetectedSubject(detected);
                // Show a success message with nice animation
                setSuccess({
                    message: "Subject automatically detected as ".concat(newSubject),
                    detail: prevSubject ? "Changed from ".concat(prevSubject) : null,
                    icon: 'detection'
                });
                setTimeout(()=>setSuccess(null), 3000);
            }
        }, 1000);
        // Cleanup debounced function on unmount or before recreation
        return ()=>{
            if (debouncedFnRef.current) {
                debouncedFnRef.current.cancel();
            }
        };
    }, [
        classifySubjectAI,
        loading,
        subjectKeywords
    ]);
    // Wrapper function that calls the current debounced function
    const debouncedClassifySubject = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        if (debouncedFnRef.current) {
            return debouncedFnRef.current(...args);
        }
    }, []);
    return {
        classifySubjectAI,
        debouncedClassifySubject
    };
};
// Backend status checker hook
const useBackendStatus = (API_BASE_URL)=>{
    const checkBackendStatus = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (model)=>{
        try {
            // Special case for GitHub Pages to always show the UI
            if ( true && (window.location.hostname.includes('github.io') || window.location.hostname === 'beenycool.github.io')) {
                console.log('Running on GitHub Pages - simulating online status for UI rendering');
                // Enable local API fallbacks when on GitHub Pages
                if (true) {
                    try {
                        // Set environment variable to use local API handlers
                        window.localStorage.setItem('USE_LOCAL_API', 'true');
                    // Don't try to create middleware endpoints on GitHub Pages
                    // GitHub Pages can't handle POST requests (static hosting only)
                    } catch (e) {
                        console.warn('Failed to set up local API fallbacks:', e);
                    }
                    window.BACKEND_STATUS = {
                        status: 'online',
                        lastChecked: new Date().toLocaleTimeString(),
                        isGitHubPages: true,
                        usingLocalFallbacks: true
                    };
                }
                return {
                    ok: true,
                    data: {
                        status: 'ok',
                        openaiClient: true,
                        apiKeyConfigured: true,
                        isGitHubPages: true,
                        usingLocalFallbacks: true
                    },
                    status: 'online'
                };
            }
            let retryCount = 0;
            const maxRetries = 3; // Try up to 4 times total (initial + 3 retries)
            while(retryCount <= maxRetries){
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(()=>controller.abort(), 12000); // Increased timeout to 12 seconds
                    // Use the constructApiUrl function if available
                    const isGitHubPagesEnv =  true && (window.location.hostname.includes('github.io') || window.location.hostname === 'beenycool.github.io');
                    // Direct URL for GitHub Pages, otherwise use constructApiUrl
                    const healthEndpoint = isGitHubPagesEnv ? "".concat(API_BASE_URL, "/health") :  true && window.constructApiUrl ? window.constructApiUrl('health') : "".concat(API_BASE_URL, "/api/health");
                    console.log("Checking backend health at ".concat(healthEndpoint));
                    const response = await fetch("".concat(healthEndpoint, "?timestamp=").concat(Date.now()), {
                        method: 'GET',
                        signal: controller.signal,
                        mode: 'cors',
                        headers: {
                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                            'Pragma': 'no-cache',
                            'Expires': '0'
                        }
                    });
                    clearTimeout(timeoutId);
                    if (!response.ok) {
                        // WORKAROUND: If health check returns 404, simulate success to allow UI to render
                        if (response.status === 404) {
                            console.warn('Backend health check returned 404. Simulating success for UI rendering.');
                            return {
                                ok: true,
                                data: {
                                    status: 'ok',
                                    openaiClient: true,
                                    apiKeyConfigured: true,
                                    simulated404: true
                                },
                                status: 'online'
                            };
                        }
                        throw new Error("Backend health check failed: ".concat(response.status));
                    }
                    const data = await response.json();
                    console.log('Backend health check data:', data);
                    // Check if any model is available
                    if (data.openaiClient !== true || data.apiKeyConfigured !== true) {
                        return {
                            ok: false,
                            error: 'The backend API service is not properly configured. Please try again later.',
                            status: 'error',
                            data
                        };
                    }
                    // Check if the selected model is available (if provided)
                    if (model) {
                        // Check for rate limiting or model availability
                        if (model === "gemini-2.5-flash-preview-05-20" && data.rateLimited === true) {
                            return {
                                ok: false,
                                error: 'Gemini 2.5 Flash Preview is rate limited. Please try again in a minute or choose another model.',
                                status: 'rate_limited',
                                data
                            };
                        }
                    }
                    return {
                        ok: true,
                        data,
                        status: 'online'
                    };
                } catch (error) {
                    if (retryCount === maxRetries) {
                        // Don't retry if we've hit max retries, just throw the error
                        throw error;
                    }
                    const waitTime = 2000 * (retryCount + 1); // Progressive backoff
                    console.log("Retry attempt ".concat(retryCount + 1, " for backend health check in ").concat(waitTime, "ms"));
                    // Wait before retrying
                    await new Promise((resolve)=>setTimeout(resolve, waitTime));
                    retryCount++;
                }
            }
        } catch (error) {
            console.error("Backend health check failed:", error);
            let errorMessage = error.message;
            let status = 'error';
            if (error.name === 'AbortError' || error.name === 'TimeoutError') {
                errorMessage = 'Backend did not respond in time. The server may take up to 50 seconds to wake up.';
            } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                errorMessage = 'Network connection to backend failed. Please check your internet connection and try again in a moment.';
                status = 'network';
            }
            return {
                ok: false,
                error: errorMessage,
                status
            };
        }
    }, [
        API_BASE_URL
    ]);
    return {
        checkBackendStatus
    };
};


/***/ })

}]);