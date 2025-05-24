(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[698],{

/***/ 35124:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 78101));


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


/***/ }),

/***/ 78101:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ page)
});

// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(95155);
// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/index.js
var react = __webpack_require__(12115);
// EXTERNAL MODULE: ./node_modules/next/dist/api/navigation.js
var navigation = __webpack_require__(35695);
// EXTERNAL MODULE: ./node_modules/axios/lib/axios.js + 48 modules
var axios = __webpack_require__(23464);
// EXTERNAL MODULE: ./app/hooks/useAnalytics.js
var useAnalytics = __webpack_require__(66524);
// EXTERNAL MODULE: ./node_modules/react-chartjs-2/dist/index.js
var dist = __webpack_require__(64065);
// EXTERNAL MODULE: ./node_modules/chart.js/dist/chart.js + 2 modules
var chart = __webpack_require__(66881);
;// ./app/admin/components/DashboardStats.jsx
/* __next_internal_client_entry_do_not_use__ default auto */ 



// Register ChartJS components
chart/* Chart */.t1.register(chart/* CategoryScale */.PP, chart/* LinearScale */.kc, chart/* BarElement */.E8, chart/* LineElement */.No, chart/* PointElement */.FN, chart/* ArcElement */.Bs, chart/* Title */.hE, chart/* Tooltip */.m_, chart/* Legend */.s$);
const DashboardStats = (param)=>{
    let { data } = param;
    var _data_chessGamesByDay_find, _data_newUsersByDay_find;
    const [chartView, setChartView] = (0,react.useState)('activity'); // 'activity', 'users', 'chess', 'todo'
    if (!data) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            children: "No data available"
        });
    }
    // Process data for charts
    const processChartData = ()=>{
        // Activity by day chart
        const activityLabels = data.loginsByDay.map((item)=>item._id);
        const activityData = {
            labels: activityLabels,
            datasets: [
                {
                    label: 'Logins',
                    data: data.loginsByDay.map((item)=>item.count),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Chess Games',
                    data: data.chessGamesByDay.map((item)=>{
                        const matchingDay = activityLabels.findIndex((day)=>day === item._id);
                        return matchingDay >= 0 ? item.count : 0;
                    }),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        };
        // New users by day
        const newUsersData = {
            labels: data.newUsersByDay.map((item)=>item._id),
            datasets: [
                {
                    label: 'New Users',
                    data: data.newUsersByDay.map((item)=>item.count),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        };
        // Todo activity
        const todoTypes = [
            'todo_create',
            'todo_complete',
            'todo_delete'
        ];
        const todoLabels = [
            ...new Set(data.todoActivityByDay.map((item)=>item._id.date))
        ];
        const todoData = {
            labels: todoLabels,
            datasets: todoTypes.map((type, index)=>{
                const colors = [
                    {
                        bg: 'rgba(153, 102, 255, 0.5)',
                        border: 'rgba(153, 102, 255, 1)'
                    },
                    {
                        bg: 'rgba(54, 162, 235, 0.5)',
                        border: 'rgba(54, 162, 235, 1)'
                    },
                    {
                        bg: 'rgba(255, 159, 64, 0.5)',
                        border: 'rgba(255, 159, 64, 1)'
                    }
                ];
                return {
                    label: capitalize(type.replace('todo_', '')),
                    data: todoLabels.map((date)=>{
                        const matchingItem = data.todoActivityByDay.find((item)=>item._id.date === date && item._id.action === type);
                        return matchingItem ? matchingItem.count : 0;
                    }),
                    backgroundColor: colors[index].bg,
                    borderColor: colors[index].border,
                    borderWidth: 1
                };
            })
        };
        // Most active users
        const activeUsersData = {
            labels: data.mostActiveUsers.map((user)=>user.username),
            datasets: [
                {
                    label: 'Activity Count',
                    data: data.mostActiveUsers.map((user)=>user.count),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        };
        return {
            activityData,
            newUsersData,
            todoData,
            activeUsersData
        };
    };
    const chartData = processChartData();
    // Chart options
    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Activity by Day'
            }
        }
    };
    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'New Users by Day'
            }
        }
    };
    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Most Active Users'
            }
        }
    };
    const todoOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Todo Activity by Day'
            }
        }
    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "bg-white rounded-lg shadow p-6",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "text-lg font-semibold text-gray-500",
                                children: "Active Sessions"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-3xl font-bold mt-2",
                                children: data.activeSessions
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "bg-white rounded-lg shadow p-6",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "text-lg font-semibold text-gray-500",
                                children: "Chess Games Today"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-3xl font-bold mt-2",
                                children: ((_data_chessGamesByDay_find = data.chessGamesByDay.find((day)=>day._id === new Date().toISOString().split('T')[0])) === null || _data_chessGamesByDay_find === void 0 ? void 0 : _data_chessGamesByDay_find.count) || 0
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "bg-white rounded-lg shadow p-6",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "text-lg font-semibold text-gray-500",
                                children: "New Users Today"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-3xl font-bold mt-2",
                                children: ((_data_newUsersByDay_find = data.newUsersByDay.find((day)=>day._id === new Date().toISOString().split('T')[0])) === null || _data_newUsersByDay_find === void 0 ? void 0 : _data_newUsersByDay_find.count) || 0
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "bg-white rounded-lg shadow p-6",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "text-lg font-semibold text-gray-500",
                                children: "Todo Items Created"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-3xl font-bold mt-2",
                                children: data.todoActivityByDay.filter((item)=>item._id.action === 'todo_create').reduce((sum, item)=>sum + item.count, 0)
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "bg-white rounded-lg shadow",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "border-b px-4 flex",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                className: "py-3 px-4 ".concat(chartView === 'activity' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'),
                                onClick: ()=>setChartView('activity'),
                                children: "Activity"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                className: "py-3 px-4 ".concat(chartView === 'users' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'),
                                onClick: ()=>setChartView('users'),
                                children: "Users"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                className: "py-3 px-4 ".concat(chartView === 'chess' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'),
                                onClick: ()=>setChartView('chess'),
                                children: "Chess Games"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                className: "py-3 px-4 ".concat(chartView === 'todo' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'),
                                onClick: ()=>setChartView('todo'),
                                children: "Todo Activity"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "p-6 h-96",
                        children: [
                            chartView === 'activity' && /*#__PURE__*/ (0,jsx_runtime.jsx)(dist/* Bar */.yP, {
                                data: chartData.activityData,
                                options: barOptions
                            }),
                            chartView === 'users' && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-6 h-full",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(dist/* Line */.N1, {
                                            data: chartData.newUsersData,
                                            options: lineOptions
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(dist/* Pie */.Fq, {
                                            data: chartData.activeUsersData,
                                            options: pieOptions
                                        })
                                    })
                                ]
                            }),
                            chartView === 'chess' && /*#__PURE__*/ (0,jsx_runtime.jsx)(dist/* Bar */.yP, {
                                data: {
                                    labels: chartData.activityData.labels,
                                    datasets: [
                                        chartData.activityData.datasets[1]
                                    ]
                                },
                                options: {
                                    ...barOptions,
                                    plugins: {
                                        ...barOptions.plugins,
                                        title: {
                                            display: true,
                                            text: 'Chess Games by Day'
                                        }
                                    }
                                }
                            }),
                            chartView === 'todo' && /*#__PURE__*/ (0,jsx_runtime.jsx)(dist/* Bar */.yP, {
                                data: chartData.todoData,
                                options: todoOptions
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "bg-white rounded-lg shadow p-6",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                        className: "text-xl font-bold mb-4",
                        children: "Most Active Users"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "overflow-x-auto",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("table", {
                            className: "min-w-full divide-y divide-gray-200",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("thead", {
                                    className: "bg-gray-50",
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                children: "Username"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                children: "Activity Count"
                                            })
                                        ]
                                    })
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("tbody", {
                                    className: "bg-white divide-y divide-gray-200",
                                    children: data.mostActiveUsers.map((user, index)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                                    className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",
                                                    children: user.username
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                                    className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                                    children: user.count
                                                })
                                            ]
                                        }, index))
                                })
                            ]
                        })
                    })
                ]
            })
        ]
    });
};
// Helper to capitalize first letter
const capitalize = (str)=>{
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};
/* harmony default export */ const components_DashboardStats = (DashboardStats);

;// ./app/admin/components/ActiveSessions.jsx
/* __next_internal_client_entry_do_not_use__ default auto */ 

const ActiveSessions = (param)=>{
    let { sessions, onViewDetails, onEndSession } = param;
    const [sortBy, setSortBy] = (0,react.useState)('lastActivity');
    const [sortOrder, setSortOrder] = (0,react.useState)('desc');
    // Sort sessions
    const sortedSessions = [
        ...sessions
    ].sort((a, b)=>{
        if (sortBy === 'lastActivity') {
            const dateA = new Date(a.lastActivity);
            const dateB = new Date(b.lastActivity);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortBy === 'username') {
            var _a_user, _b_user;
            const nameA = ((_a_user = a.user) === null || _a_user === void 0 ? void 0 : _a_user.username) || '';
            const nameB = ((_b_user = b.user) === null || _b_user === void 0 ? void 0 : _b_user.username) || '';
            return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        } else if (sortBy === 'ipAddress') {
            const ipA = a.ipAddress || '';
            const ipB = b.ipAddress || '';
            return sortOrder === 'asc' ? ipA.localeCompare(ipB) : ipB.localeCompare(ipA);
        }
        return 0;
    });
    // Toggle sort
    const handleSort = (field)=>{
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };
    // Format date
    const formatDate = (dateStr)=>{
        const date = new Date(dateStr);
        return date.toLocaleString();
    };
    // Calculate time elapsed
    const timeElapsed = (dateStr)=>{
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);
        if (diffSecs < 60) return "".concat(diffSecs, "s ago");
        const diffMins = Math.floor(diffSecs / 60);
        if (diffMins < 60) return "".concat(diffMins, "m ago");
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return "".concat(diffHours, "h ago");
        const diffDays = Math.floor(diffHours / 24);
        return "".concat(diffDays, "d ago");
    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "bg-white shadow rounded-lg overflow-hidden",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "p-4 border-b",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("h2", {
                        className: "text-lg font-semibold",
                        children: [
                            "Active Sessions (",
                            sessions.length,
                            ")"
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "text-sm text-gray-500",
                        children: "Manage user sessions"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("table", {
                    className: "w-full",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("thead", {
                            className: "bg-gray-50",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer",
                                        onClick: ()=>handleSort('username'),
                                        children: [
                                            "User",
                                            sortBy === 'username' && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: "ml-1",
                                                children: sortOrder === 'asc' ? '↑' : '↓'
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer",
                                        onClick: ()=>handleSort('ipAddress'),
                                        children: [
                                            "IP Address",
                                            sortBy === 'ipAddress' && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: "ml-1",
                                                children: sortOrder === 'asc' ? '↑' : '↓'
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        children: "Device"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer",
                                        onClick: ()=>handleSort('lastActivity'),
                                        children: [
                                            "Last Activity",
                                            sortBy === 'lastActivity' && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: "ml-1",
                                                children: sortOrder === 'asc' ? '↑' : '↓'
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        children: "Actions"
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("tbody", {
                            className: "bg-white divide-y divide-gray-200",
                            children: sortedSessions.length === 0 ? /*#__PURE__*/ (0,jsx_runtime.jsx)("tr", {
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    colSpan: "5",
                                    className: "px-6 py-4 text-center text-sm text-gray-500",
                                    children: "No active sessions found"
                                })
                            }) : sortedSessions.map((session)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                                    className: "hover:bg-gray-50",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: "px-6 py-4 whitespace-nowrap",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: "flex items-center",
                                                children: session.user ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                            className: "text-sm font-medium text-gray-900",
                                                            children: session.user.username
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                            className: "text-sm text-gray-500",
                                                            children: session.user.email
                                                        })
                                                    ]
                                                }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                    className: "text-sm text-gray-500",
                                                    children: "Anonymous"
                                                })
                                            })
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                            children: session.ipAddress || 'Unknown'
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                            children: session.userAgent ? /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: "truncate max-w-xs",
                                                title: session.userAgent,
                                                children: session.userAgent
                                            }) : 'Unknown'
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                    children: formatDate(session.lastActivity)
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                    className: "text-xs text-gray-400",
                                                    children: timeElapsed(session.lastActivity)
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm font-medium",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                                    onClick: ()=>onViewDetails(session.sessionId),
                                                    className: "text-blue-600 hover:text-blue-800 mr-3",
                                                    children: "View"
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                                    onClick: ()=>onEndSession(session.sessionId),
                                                    className: "text-red-600 hover:text-red-800",
                                                    children: "End Session"
                                                })
                                            ]
                                        })
                                    ]
                                }, session.id))
                        })
                    ]
                })
            })
        ]
    });
};
/* harmony default export */ const components_ActiveSessions = (ActiveSessions);

;// ./app/admin/components/UserTable.jsx
/* __next_internal_client_entry_do_not_use__ default auto */ 

const UserTable = (param)=>{
    let { users, onUpdateRole } = param;
    const [sortBy, setSortBy] = (0,react.useState)('username');
    const [sortOrder, setSortOrder] = (0,react.useState)('asc');
    const [searchQuery, setSearchQuery] = (0,react.useState)('');
    const [editingUser, setEditingUser] = (0,react.useState)(null);
    const [selectedRole, setSelectedRole] = (0,react.useState)('');
    // Filter users by search query
    const filteredUsers = users.filter((user)=>{
        const query = searchQuery.toLowerCase();
        return user.username.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
    });
    // Sort users
    const sortedUsers = [
        ...filteredUsers
    ].sort((a, b)=>{
        let compareA, compareB;
        if (sortBy === 'username') {
            compareA = a.username.toLowerCase();
            compareB = b.username.toLowerCase();
        } else if (sortBy === 'email') {
            compareA = a.email.toLowerCase();
            compareB = b.email.toLowerCase();
        } else if (sortBy === 'role') {
            compareA = a.role.toLowerCase();
            compareB = b.role.toLowerCase();
        } else if (sortBy === 'lastLogin') {
            compareA = a.lastLogin ? new Date(a.lastLogin) : new Date(0);
            compareB = b.lastLogin ? new Date(b.lastLogin) : new Date(0);
            return sortOrder === 'asc' ? compareA - compareB : compareB - compareA;
        }
        return sortOrder === 'asc' ? compareA.localeCompare(compareB) : compareB.localeCompare(compareA);
    });
    // Handle sort
    const handleSort = (field)=>{
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };
    // Format date
    const formatDate = (dateStr)=>{
        if (!dateStr) return 'Never';
        const date = new Date(dateStr);
        return date.toLocaleString();
    };
    // Start editing user role
    const startEditing = (user)=>{
        setEditingUser(user);
        setSelectedRole(user.role);
    };
    // Save user role
    const saveUserRole = ()=>{
        if (editingUser && selectedRole && selectedRole !== editingUser.role) {
            onUpdateRole(editingUser.id, selectedRole);
        }
        setEditingUser(null);
    };
    // Cancel editing
    const cancelEditing = ()=>{
        setEditingUser(null);
    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "bg-white shadow rounded-lg overflow-hidden",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "p-4 border-b",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "flex flex-col md:flex-row md:items-center md:justify-between",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("h2", {
                                    className: "text-lg font-semibold",
                                    children: [
                                        "Users (",
                                        filteredUsers.length,
                                        ")"
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "text-sm text-gray-500",
                                    children: "Manage user accounts"
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "mt-2 md:mt-0",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                type: "text",
                                placeholder: "Search users...",
                                className: "border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                                value: searchQuery,
                                onChange: (e)=>setSearchQuery(e.target.value)
                            })
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("table", {
                    className: "w-full",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("thead", {
                            className: "bg-gray-50",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer",
                                        onClick: ()=>handleSort('username'),
                                        children: [
                                            "Username",
                                            sortBy === 'username' && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: "ml-1",
                                                children: sortOrder === 'asc' ? '↑' : '↓'
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer",
                                        onClick: ()=>handleSort('email'),
                                        children: [
                                            "Email",
                                            sortBy === 'email' && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: "ml-1",
                                                children: sortOrder === 'asc' ? '↑' : '↓'
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer",
                                        onClick: ()=>handleSort('role'),
                                        children: [
                                            "Role",
                                            sortBy === 'role' && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: "ml-1",
                                                children: sortOrder === 'asc' ? '↑' : '↓'
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer",
                                        onClick: ()=>handleSort('lastLogin'),
                                        children: [
                                            "Last Login",
                                            sortBy === 'lastLogin' && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: "ml-1",
                                                children: sortOrder === 'asc' ? '↑' : '↓'
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                        children: "Actions"
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("tbody", {
                            className: "bg-white divide-y divide-gray-200",
                            children: sortedUsers.length === 0 ? /*#__PURE__*/ (0,jsx_runtime.jsx)("tr", {
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    colSpan: "5",
                                    className: "px-6 py-4 text-center text-sm text-gray-500",
                                    children: searchQuery ? 'No users match your search' : 'No users found'
                                })
                            }) : sortedUsers.map((user)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                                    className: "hover:bg-gray-50",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: "px-6 py-4 whitespace-nowrap",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: "text-sm font-medium text-gray-900",
                                                children: user.username
                                            })
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                            children: user.email
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: "px-6 py-4 whitespace-nowrap",
                                            children: editingUser && editingUser.id === user.id ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("select", {
                                                value: selectedRole,
                                                onChange: (e)=>setSelectedRole(e.target.value),
                                                className: "border rounded px-2 py-1 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                        value: "user",
                                                        children: "User"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                        value: "admin",
                                                        children: "Admin"
                                                    })
                                                ]
                                            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: "px-2 py-1 text-xs font-semibold rounded-full ".concat(user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'),
                                                children: user.role
                                            })
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                            children: formatDate(user.lastLogin)
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm font-medium",
                                            children: editingUser && editingUser.id === user.id ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                                        onClick: saveUserRole,
                                                        className: "text-green-600 hover:text-green-800 mr-3",
                                                        children: "Save"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                                        onClick: cancelEditing,
                                                        className: "text-red-600 hover:text-red-800",
                                                        children: "Cancel"
                                                    })
                                                ]
                                            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                                onClick: ()=>startEditing(user),
                                                className: "text-blue-600 hover:text-blue-800",
                                                children: "Change Role"
                                            })
                                        })
                                    ]
                                }, user.id))
                        })
                    ]
                })
            })
        ]
    });
};
/* harmony default export */ const components_UserTable = (UserTable);

;// ./app/admin/components/SessionViewer.jsx
/* __next_internal_client_entry_do_not_use__ default auto */ 

const SessionViewer = (param)=>{
    let { session, onEndSession, onBack } = param;
    if (!session) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            className: "bg-white shadow rounded-lg p-6",
            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                className: "text-gray-500",
                children: "Select a session to view details"
            })
        });
    }
    // Format date
    const formatDate = (dateStr)=>{
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleString();
    };
    // Calculate time left until expiration
    const calculateTimeLeft = (expiresAt)=>{
        if (!expiresAt) return 'N/A';
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diffMs = expiry - now;
        if (diffMs <= 0) return 'Expired';
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours > 0) {
            return "".concat(diffHours, "h ").concat(diffMins % 60, "m");
        } else if (diffMins > 0) {
            return "".concat(diffMins, "m ").concat(diffSecs % 60, "s");
        } else {
            return "".concat(diffSecs, "s");
        }
    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "bg-white shadow rounded-lg overflow-hidden",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "p-4 border-b flex justify-between items-center",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                className: "text-lg font-semibold",
                                children: "Session Details"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-sm text-gray-500",
                                children: "Information about the selected session"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                        onClick: onBack,
                        className: "px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200",
                        children: "Back to List"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "p-6",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                        className: "text-md font-semibold mb-4 pb-2 border-b",
                                        children: "Session Information"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "block text-sm font-medium text-gray-500",
                                                        children: "Session ID"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-sm",
                                                        children: session.sessionId
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "block text-sm font-medium text-gray-500",
                                                        children: "Status"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ".concat(session.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'),
                                                        children: session.isActive ? 'Active' : 'Inactive'
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "block text-sm font-medium text-gray-500",
                                                        children: "Created At"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-sm",
                                                        children: formatDate(session.createdAt)
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "block text-sm font-medium text-gray-500",
                                                        children: "Last Activity"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-sm",
                                                        children: formatDate(session.lastActivity)
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "block text-sm font-medium text-gray-500",
                                                        children: "Expires"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                        className: "text-sm",
                                                        children: [
                                                            formatDate(session.expiresAt),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                className: "ml-2 text-xs text-gray-500",
                                                                children: [
                                                                    "(",
                                                                    calculateTimeLeft(session.expiresAt),
                                                                    " remaining)"
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "block text-sm font-medium text-gray-500",
                                                        children: "IP Address"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-sm",
                                                        children: session.ipAddress || 'Unknown'
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                        className: "text-md font-semibold mb-4 pb-2 border-b",
                                        children: "User Information"
                                    }),
                                    session.user ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "block text-sm font-medium text-gray-500",
                                                        children: "Username"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-sm",
                                                        children: session.user.username
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "block text-sm font-medium text-gray-500",
                                                        children: "Email"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-sm",
                                                        children: session.user.email
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "block text-sm font-medium text-gray-500",
                                                        children: "User ID"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-sm",
                                                        children: session.user.id
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "block text-sm font-medium text-gray-500",
                                                        children: "Role"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ".concat(session.user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'),
                                                        children: session.user.role
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "block text-sm font-medium text-gray-500",
                                                        children: "Account Created"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-sm",
                                                        children: formatDate(session.user.createdAt)
                                                    })
                                                ]
                                            })
                                        ]
                                    }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-sm text-gray-500",
                                        children: "No user associated with this session"
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mt-6",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "text-md font-semibold mb-4 pb-2 border-b",
                                children: "Device Information"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                        className: "block text-sm font-medium text-gray-500",
                                        children: "User Agent"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "mt-1 p-3 bg-gray-50 rounded text-sm break-words",
                                        children: session.userAgent || 'Unknown'
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "mt-6 pt-4 border-t",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                            onClick: ()=>onEndSession(session.sessionId),
                            className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                            children: "End Session"
                        })
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const components_SessionViewer = (SessionViewer);

// EXTERNAL MODULE: ./node_modules/next/dist/api/image.js
var api_image = __webpack_require__(66766);
;// ./app/admin/components/Leaderboards.jsx
/* __next_internal_client_entry_do_not_use__ default auto */ 


const Leaderboards = (param)=>{
    let { leaderboardData } = param;
    const [activeTab, setActiveTab] = (0,react.useState)('chess');
    if (!leaderboardData) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            className: "bg-white shadow rounded-lg p-6",
            children: "Loading leaderboards..."
        });
    }
    const { chess, guilds, activity } = leaderboardData;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "bg-white shadow rounded-lg overflow-hidden",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "p-4 border-b",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                        className: "text-lg font-semibold",
                        children: "Leaderboards"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "text-sm text-gray-500",
                        children: "Top performing users and guilds"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "border-b",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "flex",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                            className: "px-4 py-3 ".concat(activeTab === 'chess' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'),
                            onClick: ()=>setActiveTab('chess'),
                            children: "Chess Ratings"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                            className: "px-4 py-3 ".concat(activeTab === 'guilds' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'),
                            onClick: ()=>setActiveTab('guilds'),
                            children: "Guilds"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                            className: "px-4 py-3 ".concat(activeTab === 'activity' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'),
                            onClick: ()=>setActiveTab('activity'),
                            children: "Most Active"
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "p-4",
                children: [
                    activeTab === 'chess' && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "text-md font-semibold mb-3",
                                children: "Top Chess Players"
                            }),
                            chess && chess.length > 0 ? /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "overflow-x-auto",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("table", {
                                    className: "min-w-full",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("thead", {
                                            className: "bg-gray-50",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Rank"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Player"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Rating"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Games"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "W/L/D"
                                                    })
                                                ]
                                            })
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("tbody", {
                                            className: "bg-white divide-y divide-gray-200",
                                            children: chess.map((player, index)=>{
                                                var _player_stats_chess, _player_stats, _player_stats_chess1, _player_stats1, _player_stats_chess2, _player_stats2, _player_stats_chess3, _player_stats3;
                                                return /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                                                    className: index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",
                                                            children: index + 1
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "flex items-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(api_image["default"], {
                                                                        src: player.avatar || '/default-avatar.png',
                                                                        alt: player.username || 'Player',
                                                                        width: 40,
                                                                        height: 40,
                                                                        className: "h-10 w-10 rounded-full"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                        className: "ml-3",
                                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                            className: "text-sm font-medium text-gray-900",
                                                                            children: player.username
                                                                        })
                                                                    })
                                                                ]
                                                            })
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "px-2 py-1 rounded bg-blue-100 text-blue-800 font-medium",
                                                                children: player.chessRating
                                                            })
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                                            children: ((_player_stats = player.stats) === null || _player_stats === void 0 ? void 0 : (_player_stats_chess = _player_stats.chess) === null || _player_stats_chess === void 0 ? void 0 : _player_stats_chess.gamesPlayed) || 0
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                                            children: [
                                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                    className: "text-green-600",
                                                                    children: [
                                                                        ((_player_stats1 = player.stats) === null || _player_stats1 === void 0 ? void 0 : (_player_stats_chess1 = _player_stats1.chess) === null || _player_stats_chess1 === void 0 ? void 0 : _player_stats_chess1.wins) || 0,
                                                                        "W"
                                                                    ]
                                                                }),
                                                                " /",
                                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                    className: "text-red-600 mx-1",
                                                                    children: [
                                                                        ((_player_stats2 = player.stats) === null || _player_stats2 === void 0 ? void 0 : (_player_stats_chess2 = _player_stats2.chess) === null || _player_stats_chess2 === void 0 ? void 0 : _player_stats_chess2.losses) || 0,
                                                                        "L"
                                                                    ]
                                                                }),
                                                                " /",
                                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                    className: "text-gray-600",
                                                                    children: [
                                                                        ((_player_stats3 = player.stats) === null || _player_stats3 === void 0 ? void 0 : (_player_stats_chess3 = _player_stats3.chess) === null || _player_stats_chess3 === void 0 ? void 0 : _player_stats_chess3.draws) || 0,
                                                                        "D"
                                                                    ]
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                }, player.id);
                                            })
                                        })
                                    ]
                                })
                            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-gray-500",
                                children: "No chess data available"
                            })
                        ]
                    }),
                    activeTab === 'guilds' && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "text-md font-semibold mb-3",
                                children: "Top Guilds"
                            }),
                            guilds && guilds.length > 0 ? /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "overflow-x-auto",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("table", {
                                    className: "min-w-full",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("thead", {
                                            className: "bg-gray-50",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Rank"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Guild"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Members"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Avg Rating"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Win Rate"
                                                    })
                                                ]
                                            })
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("tbody", {
                                            className: "bg-white divide-y divide-gray-200",
                                            children: guilds.map((guild, index)=>{
                                                var _guild_stats, _guild_stats1, _guild_stats2;
                                                return /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                                                    className: index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",
                                                            children: index + 1
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "flex items-center",
                                                                children: [
                                                                    guild.logo ? /*#__PURE__*/ (0,jsx_runtime.jsx)(api_image["default"], {
                                                                        src: guild.logo,
                                                                        alt: guild.name,
                                                                        width: 40,
                                                                        height: 40,
                                                                        className: "h-10 w-10 rounded-full"
                                                                    }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                        className: "h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center text-sm font-medium text-purple-700",
                                                                        children: guild.name.charAt(0).toUpperCase()
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "ml-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                                className: "text-sm font-medium text-gray-900",
                                                                                children: guild.name
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                className: "text-xs text-gray-500",
                                                                                children: [
                                                                                    "Created by ",
                                                                                    guild.ownerName
                                                                                ]
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            })
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                                            children: ((_guild_stats = guild.stats) === null || _guild_stats === void 0 ? void 0 : _guild_stats.memberCount) || 0
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "px-2 py-1 rounded bg-purple-100 text-purple-800 font-medium",
                                                                children: ((_guild_stats1 = guild.stats) === null || _guild_stats1 === void 0 ? void 0 : _guild_stats1.averageRating) || 1200
                                                            })
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                                            children: ((_guild_stats2 = guild.stats) === null || _guild_stats2 === void 0 ? void 0 : _guild_stats2.totalGames) ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                className: "font-medium",
                                                                children: [
                                                                    Math.round(guild.stats.totalWins / guild.stats.totalGames * 100),
                                                                    "%"
                                                                ]
                                                            }) : 'N/A'
                                                        })
                                                    ]
                                                }, guild.id);
                                            })
                                        })
                                    ]
                                })
                            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-gray-500",
                                children: "No guild data available"
                            })
                        ]
                    }),
                    activeTab === 'activity' && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "text-md font-semibold mb-3",
                                children: "Most Active Users"
                            }),
                            activity && activity.length > 0 ? /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "overflow-x-auto",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("table", {
                                    className: "min-w-full",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("thead", {
                                            className: "bg-gray-50",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Rank"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "User"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Sessions"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Actions"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Last Active"
                                                    })
                                                ]
                                            })
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("tbody", {
                                            className: "bg-white divide-y divide-gray-200",
                                            children: activity.map((user, index)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                                                    className: index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",
                                                            children: index + 1
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "flex items-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(api_image["default"], {
                                                                        src: user.avatar || '/default-avatar.png',
                                                                        alt: user.username || 'User',
                                                                        width: 40,
                                                                        height: 40,
                                                                        className: "h-10 w-10 rounded-full"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "ml-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                                className: "text-sm font-medium text-gray-900",
                                                                                children: user.username
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                                className: "text-xs text-gray-500",
                                                                                children: user.email
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            })
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                                            children: user.sessionCount || 0
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                                            children: user.actionCount || 0
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                                            children: user.lastActive ? new Date(user.lastActive).toLocaleString() : 'Never'
                                                        })
                                                    ]
                                                }, user.id))
                                        })
                                    ]
                                })
                            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-gray-500",
                                children: "No activity data available"
                            })
                        ]
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const components_Leaderboards = (Leaderboards);

;// ./app/admin/components/GuildManager.jsx
/* __next_internal_client_entry_do_not_use__ default auto */ 


const GuildManager = (param)=>{
    let { guilds, onCreateGuild, onUpdateGuild, onDeleteGuild } = param;
    const [selectedGuild, setSelectedGuild] = (0,react.useState)(null);
    const [isCreating, setIsCreating] = (0,react.useState)(false);
    const [formData, setFormData] = (0,react.useState)({
        name: '',
        description: '',
        logo: ''
    });
    // Reset form data
    const resetForm = ()=>{
        setFormData({
            name: '',
            description: '',
            logo: ''
        });
    };
    // Switch to create mode
    const handleStartCreate = ()=>{
        setSelectedGuild(null);
        setIsCreating(true);
        resetForm();
    };
    // Switch to edit mode
    const handleEditGuild = (guild)=>{
        setSelectedGuild(guild);
        setIsCreating(false);
        setFormData({
            name: guild.name,
            description: guild.description || '',
            logo: guild.logo || ''
        });
    };
    // Handle form input changes
    const handleInputChange = (e)=>{
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    // Submit form for create/update
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (isCreating) {
            onCreateGuild(formData);
        } else if (selectedGuild) {
            onUpdateGuild(selectedGuild.id, formData);
        }
        // Reset form and state
        resetForm();
        setSelectedGuild(null);
        setIsCreating(false);
    };
    // Cancel form
    const handleCancel = ()=>{
        resetForm();
        setSelectedGuild(null);
        setIsCreating(false);
    };
    // Confirm delete guild
    const handleConfirmDelete = (guildId)=>{
        if ( true && window.confirm('Are you sure you want to delete this guild? This action cannot be undone.')) {
            onDeleteGuild(guildId);
            handleCancel();
        }
    };
    // Format date
    const formatDate = (dateStr)=>{
        const date = new Date(dateStr);
        return date.toLocaleDateString();
    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-6",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "md:col-span-1 bg-white shadow rounded-lg overflow-hidden",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "p-4 border-b flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("h2", {
                                        className: "text-lg font-semibold",
                                        children: [
                                            "Guilds (",
                                            guilds.length,
                                            ")"
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-sm text-gray-500",
                                        children: "Manage guild communities"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                onClick: handleStartCreate,
                                className: "px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600",
                                children: "Create New"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "p-4 overflow-y-auto max-h-[calc(100vh-250px)]",
                        children: guilds.length === 0 ? /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                            className: "text-gray-500 text-center py-4",
                            children: "No guilds found"
                        }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("ul", {
                            className: "space-y-2",
                            children: guilds.map((guild)=>{
                                var _guild_stats;
                                return /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                                    className: "p-3 rounded-lg cursor-pointer hover:bg-gray-50 ".concat(selectedGuild && selectedGuild.id === guild.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''),
                                    onClick: ()=>handleEditGuild(guild),
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(api_image["default"], {
                                                src: guild.logo || '/placeholder-guild.png',
                                                alt: guild.name || 'Guild',
                                                width: 48,
                                                height: 48,
                                                className: "rounded-full"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "ml-3",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "text-sm font-medium text-gray-900",
                                                        children: guild.name
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "text-xs text-gray-500",
                                                        children: [
                                                            ((_guild_stats = guild.stats) === null || _guild_stats === void 0 ? void 0 : _guild_stats.memberCount) || 0,
                                                            " members \xb7 Created ",
                                                            formatDate(guild.createdAt)
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                }, guild.id);
                            })
                        })
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "md:col-span-2 bg-white shadow rounded-lg overflow-hidden",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "p-4 border-b",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                className: "text-lg font-semibold",
                                children: isCreating ? 'Create New Guild' : selectedGuild ? 'Edit Guild' : 'Guild Details'
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-sm text-gray-500",
                                children: isCreating ? 'Create a new guild community' : selectedGuild ? 'Update guild information' : 'Select a guild to view or edit'
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "p-6",
                        children: isCreating || selectedGuild ? /*#__PURE__*/ (0,jsx_runtime.jsx)("form", {
                            onSubmit: handleSubmit,
                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                                htmlFor: "name",
                                                className: "block text-sm font-medium text-gray-700",
                                                children: "Guild Name"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                                type: "text",
                                                id: "name",
                                                name: "name",
                                                required: true,
                                                className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500",
                                                value: formData.name,
                                                onChange: handleInputChange
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                                htmlFor: "description",
                                                className: "block text-sm font-medium text-gray-700",
                                                children: "Description"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("textarea", {
                                                id: "description",
                                                name: "description",
                                                rows: 4,
                                                className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500",
                                                value: formData.description,
                                                onChange: handleInputChange
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                                htmlFor: "logo",
                                                className: "block text-sm font-medium text-gray-700",
                                                children: "Logo URL"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: "mt-1 flex rounded-md shadow-sm",
                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                                    type: "text",
                                                    id: "logo",
                                                    name: "logo",
                                                    className: "block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500",
                                                    value: formData.logo,
                                                    onChange: handleInputChange
                                                })
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                className: "mt-1 text-xs text-gray-500",
                                                children: "Enter a valid image URL for the guild logo"
                                            })
                                        ]
                                    }),
                                    selectedGuild && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "bg-gray-50 rounded-lg p-4",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                className: "text-sm font-medium text-gray-900 mb-2",
                                                children: "Advanced Settings"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                                type: "button",
                                                onClick: ()=>handleConfirmDelete(selectedGuild.id),
                                                className: "px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm",
                                                children: "Delete Guild"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                className: "mt-1 text-xs text-gray-500",
                                                children: "This action cannot be undone. All guild data will be permanently deleted."
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "flex space-x-3",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                                type: "submit",
                                                className: "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                                                children: isCreating ? 'Create Guild' : 'Update Guild'
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                                type: "button",
                                                onClick: handleCancel,
                                                className: "inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                                                children: "Cancel"
                                            })
                                        ]
                                    })
                                ]
                            })
                        }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "text-center py-8",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("svg", {
                                    className: "mx-auto h-12 w-12 text-gray-400",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    "aria-hidden": "true",
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: "2",
                                        d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                    })
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                    className: "mt-2 text-sm font-medium text-gray-900",
                                    children: "No guild selected"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "mt-1 text-sm text-gray-500",
                                    children: "Select a guild from the list to view or edit its details, or create a new guild."
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: "mt-6",
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                        type: "button",
                                        onClick: handleStartCreate,
                                        className: "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                                        children: "Create New Guild"
                                    })
                                })
                            ]
                        })
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const components_GuildManager = (GuildManager);

;// ./app/admin/page.jsx
/* __next_internal_client_entry_do_not_use__ default auto */ 




// Components






const AdminDashboard = ()=>{
    const [user, setUser] = (0,react.useState)(null);
    const [loading, setLoading] = (0,react.useState)(true);
    const [error, setError] = (0,react.useState)(null);
    const [activeTab, setActiveTab] = (0,react.useState)('dashboard');
    const [dashboardData, setDashboardData] = (0,react.useState)(null);
    const [activeSessions, setActiveSessions] = (0,react.useState)([]);
    const [users, setUsers] = (0,react.useState)([]);
    const [selectedSession, setSelectedSession] = (0,react.useState)(null);
    const [leaderboardData, setLeaderboardData] = (0,react.useState)(null); // Added for leaderboards
    const [guildsList, setGuildsList] = (0,react.useState)([]); // Added for guilds
    const [timeRange, setTimeRange] = (0,react.useState)(7); // 7 days default
    const router = (0,navigation.useRouter)();
    const analytics = (0,useAnalytics/* useAnalytics */.s)();
    // API base URL - updated to handle GitHub Pages deployment
    const getApiUrl = ()=>{
        // Check if we're in a browser environment
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
    };
    const API_URL = getApiUrl();
    // Track page view
    (0,react.useEffect)(()=>{
        analytics.trackPageView('admin_dashboard', {
            tab: activeTab,
            timeRange: timeRange
        });
    }, [
        analytics,
        activeTab,
        timeRange
    ]);
    // Authentication check
    (0,react.useEffect)(()=>{
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.push('/login?redirect=/admin');
            return;
        }
        const checkAuth = async ()=>{
            try {
                setLoading(true);
                setError(null); // Clear any previous errors
                console.log('Checking auth with API URL:', API_URL); // Debug log
                const response = await axios/* default */.A.get("".concat(API_URL, "/auth/user"), {
                    headers: {
                        Authorization: "Bearer ".concat(token)
                    }
                });
                // Add robust checks for user data and role
                if (!response.data || !response.data.user) {
                    setError('Invalid user data received from server.');
                    analytics.trackEvent('admin_auth_error', {
                        error: 'Invalid user data'
                    });
                    localStorage.removeItem('authToken');
                    router.push('/login?redirect=/admin');
                    return;
                }
                const userData = response.data.user;
                if (userData.role !== 'admin') {
                    setError('Access denied. Admin permissions required.');
                    analytics.trackEvent('admin_access_denied', {
                        username: userData.username,
                        role: userData.role
                    });
                    router.push('/');
                    return;
                }
                setUser(userData);
                // Identify the admin user in PostHog
                analytics.identifyUser(userData.id, {
                    username: userData.username,
                    role: userData.role,
                    isAdmin: true
                });
                analytics.trackEvent('admin_login_success', {
                    username: userData.username
                });
                setLoading(false);
            } catch (err) {
                console.error('Auth error:', err);
                // More detailed error handling
                let errorMessage = 'Authentication failed. Please log in again.';
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
                analytics.trackEvent('admin_auth_error', {
                    error: errorMessage
                });
                setError(errorMessage);
                localStorage.removeItem('authToken');
                router.push('/login?redirect=/admin');
            }
        };
        checkAuth();
    }, [
        router,
        analytics,
        API_URL
    ]);
    // Load dashboard data
    const fetchDashboardData = (0,react.useCallback)(async ()=>{
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios/* default */.A.get("".concat(API_URL, "/admin/dashboard?days=").concat(timeRange), {
                headers: {
                    Authorization: "Bearer ".concat(token)
                }
            });
            setDashboardData(response.data.data);
            analytics.trackEvent('admin_dashboard_loaded', {
                timeRange: timeRange
            });
            setLoading(false);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
            analytics.trackEvent('admin_dashboard_error', {
                error: err.message || 'Failed to load dashboard data'
            });
            setLoading(false);
        }
    }, [
        API_URL,
        timeRange,
        analytics
    ]);
    // Load active sessions
    const fetchActiveSessions = (0,react.useCallback)(async ()=>{
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios/* default */.A.get("".concat(API_URL, "/admin/sessions"), {
                headers: {
                    Authorization: "Bearer ".concat(token)
                }
            });
            setActiveSessions(response.data.sessions);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching active sessions:', err);
            setError('Failed to load active sessions');
            setLoading(false);
        }
    }, [
        API_URL
    ]);
    // Load users
    const fetchUsers = (0,react.useCallback)(async ()=>{
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios/* default */.A.get("".concat(API_URL, "/admin/users"), {
                headers: {
                    Authorization: "Bearer ".concat(token)
                }
            });
            setUsers(response.data.users);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users');
            setLoading(false);
        }
    }, [
        API_URL
    ]);
    // Load leaderboard data
    const fetchLeaderboardData = (0,react.useCallback)(async ()=>{
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios/* default */.A.get("".concat(API_URL, "/admin/leaderboards"), {
                headers: {
                    Authorization: "Bearer ".concat(token)
                }
            });
            setLeaderboardData(response.data.data);
            analytics.trackEvent('admin_leaderboards_loaded');
            setLoading(false);
        } catch (err) {
            console.error('Error fetching leaderboard data:', err);
            setError('Failed to load leaderboard data');
            analytics.trackEvent('admin_leaderboards_error', {
                error: err.message
            });
            setLoading(false);
        }
    }, [
        API_URL,
        analytics
    ]);
    // Load guilds list
    const fetchGuildsList = (0,react.useCallback)(async ()=>{
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios/* default */.A.get("".concat(API_URL, "/admin/guilds"), {
                headers: {
                    Authorization: "Bearer ".concat(token)
                }
            });
            setGuildsList(response.data.guilds);
            analytics.trackEvent('admin_guilds_loaded');
            setLoading(false);
        } catch (err) {
            console.error('Error fetching guilds list:', err);
            setError('Failed to load guilds list');
            analytics.trackEvent('admin_guilds_error', {
                error: err.message
            });
            setLoading(false);
        }
    }, [
        API_URL,
        analytics
    ]);
    // Guild CRUD operations
    const handleCreateGuild = (0,react.useCallback)(async (guildData)=>{
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            await axios/* default */.A.post("".concat(API_URL, "/admin/guilds"), guildData, {
                headers: {
                    Authorization: "Bearer ".concat(token)
                }
            });
            await fetchGuildsList(); // Refresh list
            analytics.trackEvent('admin_guild_created', {
                name: guildData.name
            });
        } catch (err) {
            var _err_response_data, _err_response;
            console.error('Error creating guild:', err);
            setError(((_err_response = err.response) === null || _err_response === void 0 ? void 0 : (_err_response_data = _err_response.data) === null || _err_response_data === void 0 ? void 0 : _err_response_data.message) || 'Failed to create guild');
            analytics.trackEvent('admin_guild_create_error', {
                error: err.message
            });
        } finally{
            setLoading(false);
        }
    }, [
        API_URL,
        fetchGuildsList,
        analytics
    ]);
    const handleUpdateGuild = (0,react.useCallback)(async (guildId, guildData)=>{
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            await axios/* default */.A.put("".concat(API_URL, "/admin/guilds/").concat(guildId), guildData, {
                headers: {
                    Authorization: "Bearer ".concat(token)
                }
            });
            await fetchGuildsList(); // Refresh list
            analytics.trackEvent('admin_guild_updated', {
                guildId,
                name: guildData.name
            });
        } catch (err) {
            var _err_response_data, _err_response;
            console.error('Error updating guild:', err);
            setError(((_err_response = err.response) === null || _err_response === void 0 ? void 0 : (_err_response_data = _err_response.data) === null || _err_response_data === void 0 ? void 0 : _err_response_data.message) || 'Failed to update guild');
            analytics.trackEvent('admin_guild_update_error', {
                guildId,
                error: err.message
            });
        } finally{
            setLoading(false);
        }
    }, [
        API_URL,
        fetchGuildsList,
        analytics
    ]);
    const handleDeleteGuild = (0,react.useCallback)(async (guildId)=>{
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            await axios/* default */.A.delete("".concat(API_URL, "/admin/guilds/").concat(guildId), {
                headers: {
                    Authorization: "Bearer ".concat(token)
                }
            });
            await fetchGuildsList(); // Refresh list
            analytics.trackEvent('admin_guild_deleted', {
                guildId
            });
        } catch (err) {
            var _err_response_data, _err_response;
            console.error('Error deleting guild:', err);
            setError(((_err_response = err.response) === null || _err_response === void 0 ? void 0 : (_err_response_data = _err_response.data) === null || _err_response_data === void 0 ? void 0 : _err_response_data.message) || 'Failed to delete guild');
            analytics.trackEvent('admin_guild_delete_error', {
                guildId,
                error: err.message
            });
        } finally{
            setLoading(false);
        }
    }, [
        API_URL,
        fetchGuildsList,
        analytics
    ]);
    // When tab changes, load the required data
    (0,react.useEffect)(()=>{
        if (!user) return; // Don't fetch if user is not authenticated
        // setLoading(true); // Consider setting loading true at the start of data fetching for a tab
        const loadTabData = async ()=>{
            try {
                switch(activeTab){
                    case 'dashboard':
                        await fetchDashboardData();
                        break;
                    case 'sessions':
                        await fetchActiveSessions();
                        break;
                    case 'users':
                        await fetchUsers();
                        break;
                    case 'leaderboards':
                        await fetchLeaderboardData();
                        break;
                    case 'guilds':
                        await fetchGuildsList();
                        break;
                    default:
                        break;
                }
            } catch (tabError) {
                // Individual fetch functions handle their own errors and set specific error messages.
                // This catch block is a general fallback.
                console.error("Error loading data for tab ".concat(activeTab, ":"), tabError);
                // Avoid overwriting specific error messages set by fetch functions unless it's a new error.
                if (!error) {
                    setError("Failed to load data for ".concat(activeTab));
                }
            } finally{
            // setLoading(false); // Individual fetch functions handle their own loading state.
            }
        };
        loadTabData();
    }, [
        activeTab,
        user,
        timeRange,
        fetchDashboardData,
        fetchActiveSessions,
        fetchUsers,
        fetchLeaderboardData,
        fetchGuildsList,
        error
    ]);
    // View session details
    const viewSessionDetails = async (sessionId)=>{
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios/* default */.A.get("".concat(API_URL, "/admin/sessions/").concat(sessionId), {
                headers: {
                    Authorization: "Bearer ".concat(token)
                }
            });
            setSelectedSession(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching session details:', err);
            setError('Failed to load session details');
            setLoading(false);
        }
    };
    // End user session
    const endUserSession = async (sessionId)=>{
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            await axios/* default */.A.post("".concat(API_URL, "/admin/sessions/end"), {
                sessionId
            }, {
                headers: {
                    Authorization: "Bearer ".concat(token)
                }
            });
            // Refresh sessions list
            fetchActiveSessions();
            setSelectedSession(null);
        } catch (err) {
            console.error('Error ending session:', err);
            setError('Failed to end session');
            setLoading(false);
        }
    };
    // Update user role
    const updateUserRole = async (userId, role)=>{
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            await axios/* default */.A.post("".concat(API_URL, "/admin/users/role"), {
                userId,
                role
            }, {
                headers: {
                    Authorization: "Bearer ".concat(token)
                }
            });
            // Refresh users list
            fetchUsers();
        } catch (err) {
            console.error('Error updating user role:', err);
            setError('Failed to update user role');
            setLoading(false);
        }
    };
    if (loading && !user) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            className: "flex items-center justify-center min-h-screen bg-gray-100",
            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "p-8 bg-white rounded-lg shadow-md",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h1", {
                        className: "text-2xl font-bold mb-4",
                        children: "Loading..."
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        children: "Please wait while we verify your credentials."
                    })
                ]
            })
        });
    }
    if (error && !user) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            className: "flex items-center justify-center min-h-screen bg-gray-100",
            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "p-8 bg-white rounded-lg shadow-md",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h1", {
                        className: "text-2xl font-bold mb-4 text-red-600",
                        children: "Error"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        children: error
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                        onClick: ()=>router.push('/login'),
                        className: "mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
                        children: "Go to Login"
                    })
                ]
            })
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "min-h-screen bg-gray-100",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("nav", {
                className: "bg-gray-800 text-white p-4",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "container mx-auto flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("h1", {
                            className: "text-2xl font-bold",
                            children: "Admin Dashboard"
                        }),
                        user && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex items-center space-x-4",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                    children: [
                                        "Welcome, ",
                                        user.username
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                    onClick: ()=>{
                                        localStorage.removeItem('authToken');
                                        router.push('/login');
                                    },
                                    className: "px-4 py-2 bg-red-500 rounded hover:bg-red-600",
                                    children: "Logout"
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "container mx-auto py-8",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex mb-6 border-b",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                className: "px-4 py-2 ".concat(activeTab === 'dashboard' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'),
                                onClick: ()=>setActiveTab('dashboard'),
                                children: "Dashboard"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                className: "px-4 py-2 ".concat(activeTab === 'sessions' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'),
                                onClick: ()=>setActiveTab('sessions'),
                                children: "Active Sessions"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                className: "px-4 py-2 ".concat(activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'),
                                onClick: ()=>setActiveTab('users'),
                                children: "Users"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                className: "px-4 py-2 ".concat(activeTab === 'leaderboards' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'),
                                onClick: ()=>setActiveTab('leaderboards'),
                                children: "Leaderboards"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                className: "px-4 py-2 ".concat(activeTab === 'guilds' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'),
                                onClick: ()=>setActiveTab('guilds'),
                                children: "Guilds"
                            })
                        ]
                    }),
                    activeTab === 'dashboard' && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                className: "block text-sm font-medium text-gray-700 mb-2",
                                children: "Time Range:"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("select", {
                                className: "block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
                                value: timeRange,
                                onChange: (e)=>setTimeRange(Number(e.target.value)),
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                        value: 1,
                                        children: "Last 24 Hours"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                        value: 7,
                                        children: "Last 7 Days"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                        value: 30,
                                        children: "Last 30 Days"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                        value: 90,
                                        children: "Last 3 Months"
                                    })
                                ]
                            })
                        ]
                    }),
                    error && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mb-6 p-4 rounded-md bg-red-50 text-red-600",
                        children: [
                            error,
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                className: "ml-2 text-red-800 underline",
                                onClick: ()=>setError(null),
                                children: "Dismiss"
                            })
                        ]
                    }),
                    loading && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "flex justify-center my-12",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
                        })
                    }),
                    !loading && /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                        children: [
                            activeTab === 'dashboard' && dashboardData && /*#__PURE__*/ (0,jsx_runtime.jsx)(components_DashboardStats, {
                                data: dashboardData
                            }),
                            activeTab === 'sessions' && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "md:col-span-1 bg-white rounded-lg shadow p-6",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("h2", {
                                                className: "text-xl font-bold mb-4",
                                                children: [
                                                    "Active Sessions (",
                                                    activeSessions.length,
                                                    ")"
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(components_ActiveSessions, {
                                                sessions: activeSessions,
                                                onViewSession: viewSessionDetails,
                                                onEndSession: endUserSession
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "md:col-span-2 bg-white rounded-lg shadow p-6",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                                className: "text-xl font-bold mb-4",
                                                children: "Session Viewer"
                                            }),
                                            selectedSession ? /*#__PURE__*/ (0,jsx_runtime.jsx)(components_SessionViewer, {
                                                session: selectedSession
                                            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                className: "text-gray-500",
                                                children: "Select a session to view details"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            activeTab === 'users' && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "bg-white rounded-lg shadow p-6",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                        className: "text-xl font-bold mb-4",
                                        children: "User Management"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(components_UserTable, {
                                        users: users,
                                        onUpdateRole: updateUserRole
                                    })
                                ]
                            }),
                            activeTab === 'leaderboards' && leaderboardData && /*#__PURE__*/ (0,jsx_runtime.jsx)(components_Leaderboards, {
                                leaderboardData: leaderboardData
                            }),
                            activeTab === 'guilds' && /*#__PURE__*/ (0,jsx_runtime.jsx)(components_GuildManager, {
                                guilds: guildsList,
                                onCreateGuild: handleCreateGuild,
                                onUpdateGuild: handleUpdateGuild,
                                onDeleteGuild: handleDeleteGuild
                            })
                        ]
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const page = (AdminDashboard);


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, [794,12,315,358], () => (__webpack_exec__(35124)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);