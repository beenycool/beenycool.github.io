(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[246],{

/***/ 19433:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $G: () => (/* binding */ getSubjectGuidance),
/* harmony export */   T7: () => (/* binding */ addRecentGame),
/* harmony export */   cn: () => (/* binding */ cn),
/* harmony export */   hB: () => (/* binding */ updateURLWithRoomId),
/* harmony export */   z8: () => (/* binding */ addNotification)
/* harmony export */ });
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(52596);
/* harmony import */ var tailwind_merge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(39688);


/**
 * Combines multiple class names using clsx and tailwind-merge
 * @param {...string} inputs - Class names to merge
 * @returns {string} - The merged class names
 */ function cn() {
    for(var _len = arguments.length, inputs = new Array(_len), _key = 0; _key < _len; _key++){
        inputs[_key] = arguments[_key];
    }
    return (0,tailwind_merge__WEBPACK_IMPORTED_MODULE_0__/* .twMerge */ .QP)((0,clsx__WEBPACK_IMPORTED_MODULE_1__/* .clsx */ .$)(inputs));
}
/**
 * Returns subject-specific guidance for GCSE marking
 * 
 * @param {string} subject - The subject being marked
 * @param {string} examBoard - The exam board (e.g., aqa, edexcel)
 * @returns {string} - Subject-specific guidance text
 */ function getSubjectGuidance(subject, examBoard) {
    const guidance = {
        english: {
            aqa: "- Focus on the use of language, structure and form\n- Evaluate the writer's methods and intentions\n- Consider the social, historical and literary context\n- Reference the text with specific quotations\n- Assessment Objectives: AO1 (ideas & language), AO2 (analysis), AO3 (context), AO4 (evaluation)",
            edexcel: "- Analyze how writers use language and structure to achieve effects\n- Comment on the influence of contextual factors\n- Use subject terminology accurately\n- Support points with precise references to the text",
            ocr: "- Evaluate writers' choices of language, form and structure\n- Consider the impact on readers\n- Demonstrate understanding of context\n- Use a range of appropriate terminology",
            wjec: "- Analyze how meanings are shaped through language, form and structure\n- Show understanding of the relationship between texts and contexts\n- Use relevant terminology\n- Support interpretations with specific references"
        },
        maths: {
            general: "- Check for correct application of mathematical procedures\n- Evaluate the clarity of working out\n- Consider alternative methods/solutions\n- Award method marks for correct approaches even with calculation errors\n- Check final answers for accuracy and appropriate rounding"
        },
        science: {
            general: "- Look for scientific accuracy in explanations\n- Check for proper use of technical terminology\n- Consider experimental design quality\n- Evaluate analytical reasoning and critical thinking\n- Assess understanding of scientific principles"
        },
        history: {
            general: "- Evaluate the use of historical evidence\n- Consider different historical interpretations\n- Assess understanding of key historical concepts\n- Look for chronological understanding\n- Check for balanced argumentation"
        },
        geography: {
            general: "- Check for understanding of physical and human processes\n- Evaluate use of geographical data and case studies\n- Consider sustainability and interconnection concepts\n- Assess the quality of geographical analysis\n- Look for appropriate use of maps and diagrams"
        },
        computerScience: {
            general: "- Evaluate understanding of computing principles\n- Check for logical problem-solving approaches\n- Assess code quality and algorithm efficiency\n- Consider practical application of theoretical concepts\n- Look for critical understanding of computing systems"
        },
        businessStudies: {
            general: "- Check understanding of business concepts and theories\n- Evaluate analytical and critical thinking\n- Assess application to real business contexts\n- Consider different stakeholder perspectives\n- Look for balanced evaluation of business decisions"
        }
    };
    // Use subject-specific guidance if available, otherwise use general guidance
    if (guidance[subject] && guidance[subject][examBoard]) {
        return guidance[subject][examBoard];
    } else if (guidance[subject] && guidance[subject].general) {
        return guidance[subject].general;
    }
    // Fallback guidance if nothing specific is available
    return "- Focus on accurate subject knowledge\n- Consider structure and clarity of response\n- Look for relevant examples and evidence\n- Assess depth of analysis and evaluation\n- Check for appropriate subject-specific terminology";
}
function updateURLWithRoomId(roomId) {
// TODO: Implement function
}
function addNotification(message) {
// TODO: Implement function
}
function addRecentGame(game) {
// TODO: Implement function
}


/***/ }),

/***/ 30177:
/***/ (() => {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 30446:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(95155);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12115);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(35695);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6874);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(23464);
/* __next_internal_client_entry_do_not_use__ default auto */ 




const ChessUserPanel = (param)=>{
    let { onJoinGuild, currentGuild } = param;
    var _user_stats_chess, _user_stats, _user_stats_chess1, _user_stats1, _user_stats_chess2, _user_stats2;
    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [guilds, setGuilds] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [showGuildList, setShowGuildList] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [chessRating, setChessRating] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1200);
    const [recentGames, setRecentGames] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    const API_URL = "https://beenycool-github-io.onrender.com" || 0;
    // Fetch user data on component mount
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const fetchUserData = async ()=>{
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setLoading(false);
                    return;
                }
                const response = await axios__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.get("".concat(API_URL, "/auth/user"), {
                    headers: {
                        Authorization: "Bearer ".concat(token)
                    }
                });
                if (response.data.success) {
                    setUser(response.data.user);
                    setChessRating(response.data.user.chessRating || 1200);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };
        fetchUserData();
    }, [
        API_URL
    ]);
    // Fetch recent games and guild data when user is available
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (!user) return;
        const fetchUserGames = async ()=>{
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.get("".concat(API_URL, "/chess/my-games"), {
                    headers: {
                        Authorization: "Bearer ".concat(token)
                    }
                });
                if (response.data.success) {
                    setRecentGames(response.data.games);
                }
            } catch (error) {
                console.error('Error fetching recent games:', error);
            }
        };
        const fetchGuilds = async ()=>{
            try {
                const response = await axios__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.get("".concat(API_URL, "/guilds"));
                if (response.data.success) {
                    setGuilds(response.data.guilds);
                }
            } catch (error) {
                console.error('Error fetching guilds:', error);
            }
        };
        fetchUserGames();
        fetchGuilds();
    }, [
        user,
        API_URL
    ]);
    const handleJoinGuild = async (guildId)=>{
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                router.push('/login?redirect=/work');
                return;
            }
            const response = await axios__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.post("".concat(API_URL, "/guilds/").concat(guildId, "/join"), {}, {
                headers: {
                    Authorization: "Bearer ".concat(token)
                }
            });
            if (response.data.success) {
                // Update user data with new guild
                setUser({
                    ...user,
                    guild: response.data.guild._id
                });
                // Call parent component's handler if provided
                if (onJoinGuild) {
                    onJoinGuild(response.data.guild);
                }
                setShowGuildList(false);
            }
        } catch (error) {
            console.error('Error joining guild:', error);
            alert('Failed to join guild. You may already be in a guild.');
        }
    };
    const handleLeaveGuild = async ()=>{
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                router.push('/login?redirect=/work');
                return;
            }
            const response = await axios__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.post("".concat(API_URL, "/guilds/leave"), {}, {
                headers: {
                    Authorization: "Bearer ".concat(token)
                }
            });
            if (response.data.success) {
                // Update user data to remove guild
                setUser({
                    ...user,
                    guild: null
                });
                // Call parent component's handler if provided
                if (onJoinGuild) {
                    onJoinGuild(null);
                }
            }
        } catch (error) {
            console.error('Error leaving guild:', error);
            alert('Failed to leave guild.');
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "p-4 bg-white rounded-lg shadow mb-4 animate-pulse",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                    className: "h-6 bg-gray-200 rounded w-3/4 mb-2"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                    className: "h-4 bg-gray-200 rounded w-1/2"
                })
            ]
        });
    }
    if (!user) {
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "p-4 bg-white rounded-lg shadow mb-4",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
                    className: "text-lg font-semibold mb-2",
                    children: "Chess Player"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                    className: "text-sm text-gray-600 mb-3",
                    children: "Sign in to track your stats and join guilds"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: "flex space-x-2",
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
                            href: "/login?redirect=/work",
                            className: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm",
                            children: "Sign In"
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
                            href: "/login?redirect=/work",
                            className: "px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm",
                            children: "Create Account"
                        })
                    ]
                })
            ]
        });
    }
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "p-4 bg-white rounded-lg shadow mb-4",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "flex justify-between items-start",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
                                className: "text-lg font-semibold",
                                children: user.username
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                className: "text-sm text-gray-600",
                                children: [
                                    "Rating: ",
                                    chessRating
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: "mt-2 grid grid-cols-3 gap-2 text-center",
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: "bg-green-50 p-2 rounded",
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                                className: "text-sm font-semibold text-green-600",
                                                children: ((_user_stats = user.stats) === null || _user_stats === void 0 ? void 0 : (_user_stats_chess = _user_stats.chess) === null || _user_stats_chess === void 0 ? void 0 : _user_stats_chess.wins) || 0
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                                className: "text-xs text-gray-500",
                                                children: "Wins"
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: "bg-red-50 p-2 rounded",
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                                className: "text-sm font-semibold text-red-600",
                                                children: ((_user_stats1 = user.stats) === null || _user_stats1 === void 0 ? void 0 : (_user_stats_chess1 = _user_stats1.chess) === null || _user_stats_chess1 === void 0 ? void 0 : _user_stats_chess1.losses) || 0
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                                className: "text-xs text-gray-500",
                                                children: "Losses"
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: "bg-gray-50 p-2 rounded",
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                                className: "text-sm font-semibold text-gray-600",
                                                children: ((_user_stats2 = user.stats) === null || _user_stats2 === void 0 ? void 0 : (_user_stats_chess2 = _user_stats2.chess) === null || _user_stats_chess2 === void 0 ? void 0 : _user_stats_chess2.draws) || 0
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                                className: "text-xs text-gray-500",
                                                children: "Draws"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    currentGuild ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "text-right",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: "inline-block bg-indigo-50 border border-indigo-100 rounded-md p-2",
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                        className: "text-xs text-gray-500",
                                        children: "Guild"
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                        className: "font-semibold text-indigo-700",
                                        children: currentGuild.name
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                onClick: handleLeaveGuild,
                                className: "mt-2 text-xs text-red-600 hover:text-red-800",
                                children: "Leave Guild"
                            })
                        ]
                    }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                onClick: ()=>setShowGuildList(!showGuildList),
                                className: "px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600",
                                children: "Join Guild"
                            }),
                            showGuildList && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: "absolute mt-2 right-4 bg-white border rounded-md shadow-lg z-50 w-64",
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                        className: "p-2 border-b",
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", {
                                            className: "font-semibold",
                                            children: "Available Guilds"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                        className: "max-h-40 overflow-y-auto",
                                        children: guilds.length === 0 ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                            className: "p-3 text-sm text-gray-500",
                                            children: "No guilds available"
                                        }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("ul", {
                                            children: guilds.map((guild)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                    className: "p-2 hover:bg-gray-50 border-b last:border-0 cursor-pointer",
                                                    onClick: ()=>handleJoinGuild(guild._id),
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                                            className: "font-medium",
                                                            children: guild.name
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                            className: "text-xs text-gray-500",
                                                            children: [
                                                                guild.members.length,
                                                                " members • Avg: ",
                                                                guild.stats.averageRating
                                                            ]
                                                        })
                                                    ]
                                                }, guild._id))
                                        })
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            recentGames.length > 0 && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "mt-4",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", {
                        className: "text-sm font-semibold mb-2",
                        children: "Recent Games"
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                        className: "space-y-1 text-sm",
                        children: recentGames.slice(0, 3).map((game, index)=>{
                            const isWhite = game.players.white.user === user.id;
                            const opponent = isWhite ? game.players.black.username : game.players.white.username;
                            const result = isWhite && game.result === '1-0' || !isWhite && game.result === '0-1' ? 'Win' : game.result === '1/2-1/2' ? 'Draw' : 'Loss';
                            const ratingChange = isWhite ? game.players.white.ratingChange : game.players.black.ratingChange;
                            return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: "flex justify-between p-1 rounded ".concat(result === 'Win' ? 'bg-green-50' : result === 'Loss' ? 'bg-red-50' : 'bg-gray-50'),
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                                className: "inline-block w-2 h-2 rounded-full mr-2 ".concat(isWhite ? 'bg-gray-100 border border-gray-300' : 'bg-gray-800')
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                                children: opponent
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                                className: "mr-2",
                                                children: result
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                className: "".concat(ratingChange > 0 ? 'text-green-600' : ratingChange < 0 ? 'text-red-600' : 'text-gray-600'),
                                                children: [
                                                    ratingChange > 0 ? '+' : '',
                                                    ratingChange
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }, index);
                        })
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChessUserPanel);


/***/ }),

/***/ 57563:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ChessClientWrapper)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(95155);
/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(55028);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(12115);
/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(51362);
/* __next_internal_client_entry_do_not_use__ default auto */ 



// Dynamic import for the Chess component
const ChessComponent = (0,next_dynamic__WEBPACK_IMPORTED_MODULE_1__["default"])(()=>Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 87094)).then((mod)=>{
        if (mod.default) return mod.default;
        return mod;
    }), {
    loadableGenerated: {
        webpack: ()=>[
                /*require.resolve*/(87094)
            ]
    },
    ssr: false
});
function ChessClientWrapper() {
    const { theme } = (0,next_themes__WEBPACK_IMPORTED_MODULE_3__/* .useTheme */ .D)();
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: "container mx-auto px-4 py-6",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ChessComponent, {
            systemTheme: theme
        })
    });
}


/***/ }),

/***/ 70490:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 87094));
;
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 57563));
;
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 30446));
;
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 30177, 23));


/***/ }),

/***/ 87094:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ ChessComponent)
});

// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(95155);
// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/index.js
var react = __webpack_require__(12115);
// EXTERNAL MODULE: ./node_modules/react-chessboard/dist/index.esm.js
var index_esm = __webpack_require__(24724);
// EXTERNAL MODULE: ./node_modules/chess.js/dist/esm/chess.js
var chess = __webpack_require__(73912);
// EXTERNAL MODULE: ./node_modules/socket.io-client/build/esm/index.js + 28 modules
var esm = __webpack_require__(14298);
// EXTERNAL MODULE: ./node_modules/uuid/dist/esm-browser/v4.js + 3 modules
var v4 = __webpack_require__(51368);
// EXTERNAL MODULE: ./node_modules/canvas-confetti/dist/confetti.module.mjs
var confetti_module = __webpack_require__(5585);
// EXTERNAL MODULE: ./node_modules/next-themes/dist/index.mjs
var dist = __webpack_require__(51362);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/volume-2.js
var volume_2 = __webpack_require__(15273);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/volume-x.js
var volume_x = __webpack_require__(9771);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/sun.js
var sun = __webpack_require__(62098);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/moon.js
var moon = __webpack_require__(93509);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/users.js
var users = __webpack_require__(17580);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/user-plus.js
var user_plus = __webpack_require__(12318);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/history.js
var icons_history = __webpack_require__(29676);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/copy.js
var copy = __webpack_require__(24357);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/circle-arrow-left.js
var circle_arrow_left = __webpack_require__(35050);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/refresh-ccw.js
var refresh_ccw = __webpack_require__(84109);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/rotate-ccw.js
var rotate_ccw = __webpack_require__(40133);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/circle-arrow-right.js
var circle_arrow_right = __webpack_require__(14555);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/message-square.js
var message_square = __webpack_require__(81497);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/send.js
var send = __webpack_require__(12486);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/info.js
var info = __webpack_require__(81284);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/chevron-up.js
var chevron_up = __webpack_require__(47863);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/chevron-down.js
var chevron_down = __webpack_require__(66474);
// EXTERNAL MODULE: ./node_modules/axios/lib/axios.js + 48 modules
var axios = __webpack_require__(23464);
// EXTERNAL MODULE: ./components/ui/select.tsx
var ui_select = __webpack_require__(95784);
// EXTERNAL MODULE: ./components/ui/button.tsx
var ui_button = __webpack_require__(97168);
;// ./components/ui/chess-notification.jsx
/* __next_internal_client_entry_do_not_use__ ChessNotification auto */ 




const variants = {
    initial: {
        opacity: 0,
        y: -20,
        scale: 0.95
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: [
                0.4,
                0,
                0.2,
                1
            ]
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.2,
            ease: [
                0.4,
                0,
                1,
                1
            ]
        }
    }
};
function ChessNotification(param) {
    let { title, message, variant = "default", open, onClose, duration = 5000 } = param;
    useEffect(()=>{
        if (open && duration) {
            const timer = setTimeout(()=>{
                onClose === null || onClose === void 0 ? void 0 : onClose();
            }, duration);
            return ()=>clearTimeout(timer);
        }
    }, [
        open,
        duration,
        onClose
    ]);
    // Get the appropriate styles based on the variant
    const getVariantStyles = ()=>{
        switch(variant){
            case "success":
                return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
            case "error":
                return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
            case "warning":
                return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800";
            case "info":
                return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800";
            case "special":
                return "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800";
            case "epic":
                return "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/40 border-amber-200 dark:border-amber-800";
            case "danger":
                return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
            default:
                return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700";
        }
    };
    // Special icon based on variant
    const getIcon = ()=>{
        if (variant === "special" || variant === "epic") {
            return /*#__PURE__*/ _jsx(Sparkles, {
                className: "h-5 w-5 text-yellow-500"
            });
        }
        return null;
    };
    return /*#__PURE__*/ _jsx(AnimatePresence, {
        children: open && /*#__PURE__*/ _jsx(motion.div, {
            className: "fixed top-4 right-4 z-50 max-w-md rounded-lg border p-4 shadow-md ".concat(getVariantStyles()),
            role: "alert",
            variants: variants,
            initial: "initial",
            animate: "animate",
            exit: "exit",
            children: /*#__PURE__*/ _jsxs("div", {
                className: "flex items-start gap-3",
                children: [
                    getIcon(),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ _jsx("h3", {
                                className: "font-medium text-gray-900 dark:text-gray-50",
                                children: title
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "mt-1 text-sm text-gray-700 dark:text-gray-300",
                                children: message
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("button", {
                        type: "button",
                        className: "inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none",
                        onClick: ()=>onClose === null || onClose === void 0 ? void 0 : onClose(),
                        children: [
                            /*#__PURE__*/ _jsx("span", {
                                className: "sr-only",
                                children: "Close"
                            }),
                            /*#__PURE__*/ _jsx(X, {
                                className: "h-4 w-4"
                            })
                        ]
                    })
                ]
            })
        })
    });
}

;// ./app/work/chess-easter-eggs.js


// Konami code sequence
const KONAMI_CODE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a'
];
// Special piece positions that trigger easter eggs
const SPECIAL_POSITIONS = {
    // Four knights in the center
    fourKnights: [
        {
            piece: 'n',
            color: 'w',
            square: 'd4'
        },
        {
            piece: 'n',
            color: 'w',
            square: 'e4'
        },
        {
            piece: 'n',
            color: 'b',
            square: 'd5'
        },
        {
            piece: 'n',
            color: 'b',
            square: 'e5'
        }
    ],
    // All pawns on their original squares
    originalPawns: [
        ...[
            ...Array(8)
        ].map((_, i)=>({
                piece: 'p',
                color: 'w',
                square: String.fromCharCode(97 + i) + '2'
            })),
        ...[
            ...Array(8)
        ].map((_, i)=>({
                piece: 'p',
                color: 'b',
                square: String.fromCharCode(97 + i) + '7'
            }))
    ],
    // Chess960 starting position
    chess960: [
        {
            piece: 'r',
            color: 'w',
            square: 'a1'
        },
        {
            piece: 'n',
            color: 'w',
            square: 'b1'
        },
        {
            piece: 'b',
            color: 'w',
            square: 'c1'
        },
        {
            piece: 'q',
            color: 'w',
            square: 'd1'
        },
        {
            piece: 'k',
            color: 'w',
            square: 'e1'
        },
        {
            piece: 'b',
            color: 'w',
            square: 'f1'
        },
        {
            piece: 'n',
            color: 'w',
            square: 'g1'
        },
        {
            piece: 'r',
            color: 'w',
            square: 'h1'
        },
        {
            piece: 'r',
            color: 'b',
            square: 'a8'
        },
        {
            piece: 'n',
            color: 'b',
            square: 'b8'
        },
        {
            piece: 'b',
            color: 'b',
            square: 'c8'
        },
        {
            piece: 'q',
            color: 'b',
            square: 'd8'
        },
        {
            piece: 'k',
            color: 'b',
            square: 'e8'
        },
        {
            piece: 'b',
            color: 'b',
            square: 'f8'
        },
        {
            piece: 'n',
            color: 'b',
            square: 'g8'
        },
        {
            piece: 'r',
            color: 'b',
            square: 'h8'
        }
    ],
    // Two White Rooks on the 7th rank (simplified)
    twoRooksOnSeventhWhite: [
        {
            piece: 'r',
            color: 'w',
            square: 'a7'
        },
        {
            piece: 'r',
            color: 'w',
            square: 'b7'
        }
    ]
};
// Special move sequences
const SPECIAL_MOVE_SEQUENCES = {
    scholar: [
        'e4',
        'e5',
        'Qh5',
        'Nc6',
        'Bc4',
        'Nf6',
        'Qxf7#'
    ],
    fool: [
        'f3',
        'e5',
        'g4',
        'Qh4#'
    ],
    immortal: [
        'e4',
        'e5',
        'f4',
        'exf4',
        'Bc4',
        'Qh4+',
        'Kf1',
        'b5',
        'Bxb5',
        'Nf6',
        'Nf3',
        'Qh6',
        'd3',
        'Nh5',
        'Nh4',
        'Qg5',
        'Nf5',
        'c6',
        'g4',
        'Nf6',
        'Rg1',
        'cxb5',
        'h4',
        'Qg6',
        'h5',
        'Qg5',
        'Qf3',
        'Ng8',
        'Bxf4',
        'Qf6',
        'Nc3',
        'Bc5',
        'Nd5',
        'Qxb2',
        'Bd6',
        'Bxg1',
        'e5',
        'Qxa1+',
        'Ke2',
        'Na6',
        'Nxg7+',
        'Kd8',
        'Qf6+'
    ],
    queensGambitAccepted: [
        'd4',
        'd5',
        'c4',
        'dxc4'
    ] // Queen's Gambit Accepted
};
// Easter egg effects
const easterEggEffects = {
    // Konami code effect - rains chess pieces
    konamiCodeEffect: ()=>{
        // Create confetti with chess piece shapes
        (0,confetti_module/* default */.A)({
            particleCount: 100,
            spread: 70,
            origin: {
                y: 0.6
            }
        });
        // Return notification message
        return {
            title: "Konami Code Activated!",
            message: "You found a secret! Enjoy the confetti!",
            variant: "success"
        };
    },
    // Special position effects
    positionEffects: {
        fourKnights: ()=>{
            return {
                title: "The Four Knights!",
                message: "A powerful cavalry has assembled in the center!",
                variant: "special",
                animation: "knights-dance",
                sound: "/sounds/horse-neigh.mp3"
            };
        },
        originalPawns: ()=>{
            return {
                title: "Pawn Harmony",
                message: "All pawns in their original positions. So orderly!",
                variant: "info",
                animation: "pawn-wave"
            };
        },
        chess960: ()=>{
            return {
                title: "Fischer Random!",
                message: "You've recreated a Chess960 position!",
                variant: "special",
                animation: "board-rotate"
            };
        },
        twoRooksOnSeventhWhite: ()=>{
            return {
                title: "Pigs on the Seventh!",
                message: "White's rooks dominate the seventh rank!",
                variant: "special",
                sound: "/sounds/notify.mp3"
            };
        }
    },
    // Special move sequence effects
    moveSequenceEffects: {
        scholar: ()=>{
            return {
                title: "Scholar's Mate!",
                message: "You executed the classic Scholar's Mate!",
                variant: "special",
                animation: "checkmate-flash",
                sound: "/sounds/checkmate.mp3"
            };
        },
        fool: ()=>{
            return {
                title: "Fool's Mate!",
                message: "The quickest checkmate possible!",
                variant: "warning",
                animation: "fool-spotlight",
                sound: "/sounds/short-laugh.mp3"
            };
        },
        immortal: ()=>{
            return {
                title: "The Immortal Game!",
                message: "You're recreating Anderssen's famous Immortal Game!",
                variant: "epic",
                animation: "immortal-glow",
                sound: "/sounds/epic-reveal.mp3"
            };
        },
        queensGambitAccepted: ()=>{
            return {
                title: "Queen's Gambit Accepted!",
                message: "A classic opening unfolds. Bold move!",
                variant: "info"
            };
        }
    },
    // Secret chess variations
    chessVariations: {
        // Fog of War - pieces only visible near your pieces
        fogOfWar: {
            name: "Fog of War",
            description: "You can only see squares near your pieces.",
            activate: (game)=>{
                // Implementation would hide opponent pieces not in "sight" of your pieces
                return {
                    title: "Fog of War Activated",
                    message: "The battlefield is shrouded in mystery...",
                    variant: "special"
                };
            }
        },
        // Atomic Chess - captures cause explosions
        atomicChess: {
            name: "Atomic Chess",
            description: "Captures cause explosions affecting adjacent pieces.",
            activate: (game)=>{
                // Implementation would remove pieces in a capture radius
                return {
                    title: "Atomic Chess Activated",
                    message: "Beware of explosions when capturing!",
                    variant: "danger",
                    sound: "/sounds/explosion.mp3"
                };
            }
        }
    }
};
// Custom animations for the easter eggs
const easterEggAnimations = {
    "knights-dance": {
        parent: {
            initial: {
                scale: 1
            },
            animate: {
                scale: [
                    1,
                    1.05,
                    1
                ],
                transition: {
                    duration: 0.5,
                    repeat: 3
                }
            }
        },
        children: {
            initial: {
                y: 0
            },
            animate: {
                y: [
                    0,
                    -10,
                    0
                ],
                transition: {
                    duration: 0.3,
                    repeat: 5
                }
            }
        }
    },
    "pawn-wave": {
        parent: {
            initial: {
                opacity: 1
            },
            animate: {
                opacity: 1
            }
        },
        children: (i)=>({
                initial: {
                    y: 0
                },
                animate: {
                    y: [
                        0,
                        -5,
                        0
                    ],
                    transition: {
                        delay: i * 0.1,
                        duration: 0.3,
                        repeat: 1
                    }
                }
            })
    },
    "board-rotate": {
        parent: {
            initial: {
                rotate: 0
            },
            animate: {
                rotate: 360,
                transition: {
                    duration: 1.5
                }
            }
        }
    },
    "checkmate-flash": {
        parent: {
            initial: {
                backgroundColor: "rgba(255, 255, 255, 0)"
            },
            animate: {
                backgroundColor: [
                    "rgba(255, 255, 255, 0)",
                    "rgba(255, 215, 0, 0.3)",
                    "rgba(255, 255, 255, 0)"
                ],
                transition: {
                    duration: 1.2
                }
            }
        }
    },
    "fool-spotlight": {
        parent: {
            initial: {
                boxShadow: "0 0 0 rgba(0, 0, 0, 0)"
            },
            animate: {
                boxShadow: [
                    "0 0 0 rgba(0, 0, 0, 0)",
                    "0 0 30px rgba(255, 0, 0, 0.8)",
                    "0 0 0 rgba(0, 0, 0, 0)"
                ],
                transition: {
                    duration: 1.5
                }
            }
        }
    },
    "immortal-glow": {
        parent: {
            initial: {
                boxShadow: "0 0 0 rgba(0, 0, 0, 0)"
            },
            animate: {
                boxShadow: [
                    "0 0 0 rgba(0, 0, 0, 0)",
                    "0 0 40px rgba(255, 215, 0, 0.6)",
                    "0 0 0 rgba(0, 0, 0, 0)"
                ],
                transition: {
                    duration: 2,
                    repeat: 1
                }
            }
        }
    }
};


;// ./lib/useKonamiCode.js
/* __next_internal_client_entry_do_not_use__ useKonamiCode auto */ 

function useKonamiCode() {
    const [keys, setKeys] = (0,react.useState)([]);
    const [success, setSuccess] = (0,react.useState)(false);
    const keydownHandler = (0,react.useCallback)((param)=>{
        let { key } = param;
        // Map arrow keys to their full name
        const mappedKey = key === 'ArrowUp' ? 'ArrowUp' : key === 'ArrowDown' ? 'ArrowDown' : key === 'ArrowLeft' ? 'ArrowLeft' : key === 'ArrowRight' ? 'ArrowRight' : key.toLowerCase();
        setKeys((previousKeys)=>{
            const updatedKeys = [
                ...previousKeys,
                mappedKey
            ];
            // Keep only up to the length of the Konami code 
            const trimmedKeys = updatedKeys.slice(-KONAMI_CODE.length);
            // Check if the keys match the Konami code
            const success = KONAMI_CODE.length === trimmedKeys.length && KONAMI_CODE.every((k, i)=>k === trimmedKeys[i]);
            if (success) {
                setSuccess(true);
                // Reset after a short delay
                setTimeout(()=>{
                    setSuccess(false);
                    setKeys([]);
                }, 2000);
            }
            return trimmedKeys;
        });
    }, []);
    (0,react.useEffect)(()=>{
        document.addEventListener('keydown', keydownHandler);
        return ()=>{
            document.removeEventListener('keydown', keydownHandler);
        };
    }, [
        keydownHandler
    ]);
    return {
        success,
        progress: keys.length / KONAMI_CODE.length
    };
}

// EXTERNAL MODULE: ./lib/utils.js
var utils = __webpack_require__(19433);
// EXTERNAL MODULE: ./app/work/theme.css
var theme = __webpack_require__(30177);
;// ./app/work/chess-component.jsx
/* provided dependency */ var process = __webpack_require__(49509);
/* __next_internal_client_entry_do_not_use__ default auto */ 










// Import UI components





 // Assuming these are in utils
// Import custom CSS

// Board themes definition
const boardThemes = [
    {
        name: 'Default',
        lightMode: {
            light: '#f0d9b5',
            dark: '#b58863'
        },
        darkMode: {
            light: '#6e8b8a',
            dark: '#40686a'
        }
    },
    {
        name: 'Ocean',
        lightMode: {
            light: '#cdd1e0',
            dark: '#99aacc'
        },
        darkMode: {
            light: '#6b7b99',
            dark: '#414f66'
        }
    },
    {
        name: 'Forest',
        lightMode: {
            light: '#ebecd0',
            dark: '#779952'
        },
        darkMode: {
            light: '#607243',
            dark: '#4c5b35'
        }
    },
    {
        name: 'Graphite',
        lightMode: {
            light: '#bdbdbd',
            dark: '#616161'
        },
        darkMode: {
            light: '#525252',
            dark: '#313131'
        }
    }
];
// Use the existing backend API URL if available, or fallback to local Socket.io
const useExistingBackend = true;
const SOCKET_SERVER_URL = useExistingBackend ?  true && process.env.NEXT_PUBLIC_SOCKET_URL ? process.env.NEXT_PUBLIC_SOCKET_URL // Use environment variable if available
 : window.location.hostname === 'beenycool.github.io' ? 'https://beenycool-github-io.onrender.com' // External backend for GitHub Pages
 : '/api/chess-socket' // Local API route for development
 : 'http://localhost:3001';
// Password protection constants
const PASSWORD_KEY_PREFIX = 'chess_game_password_';
const SESSION_KEY_PREFIX = 'chess_session_';
// Player scoring algorithm
const calculatePlayerScore = (game, timeRemaining, moveHistory)=>{
    // Initialize base score
    let score = 0;
    // Get final board position
    const position = game.board();
    // Material score (standard piece values)
    const pieceValues = {
        'p': 1,
        'n': 3,
        'b': 3,
        'r': 5,
        'q': 9,
        'k': 0 // king (no material value)
    };
    // Count material for both sides
    let whiteMaterial = 0;
    let blackMaterial = 0;
    position.forEach((row)=>{
        row.forEach((piece)=>{
            if (piece) {
                const pieceValue = pieceValues[piece.type.toLowerCase()];
                if (piece.color === 'w') {
                    whiteMaterial += pieceValue;
                } else {
                    blackMaterial += pieceValue;
                }
            }
        });
    });
    // Material difference score component
    const materialScore = game.turn() === 'w' ? whiteMaterial - blackMaterial : blackMaterial - whiteMaterial;
    score += materialScore * 10;
    // Time management score component
    // More time remaining = better time management
    const timeScore = Math.min(timeRemaining / 10, 50); // Cap at 50 points
    score += timeScore;
    // Position evaluation score component
    // Count center control (d4, d5, e4, e5)
    const centerSquares = [
        'd4',
        'd5',
        'e4',
        'e5'
    ];
    let centerControl = 0;
    centerSquares.forEach((square)=>{
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
            centerControl++;
        }
    });
    score += centerControl * 5;
    // Check for checkmate (bonus points)
    if (game.isCheckmate()) {
        score += 100;
    }
    // Penalty for stalemate
    if (game.isStalemate()) {
        score -= 20;
    }
    // Tactical play score - reward checks, captures, and threats
    const moveQualityScore = analyzeMoveQuality(moveHistory, game);
    score += moveQualityScore;
    return Math.max(0, Math.round(score)); // Ensure score is non-negative and rounded
};
// Analyze move quality for scoring
const analyzeMoveQuality = (moveHistory, game)=>{
    let score = 0;
    let captureCount = 0;
    let checkCount = 0;
    // Create a temporary game to analyze moves
    const tempGame = new chess/* Chess */.d$();
    // Replay the game and analyze each move
    for(let i = 1; i < moveHistory.length; i++){
        tempGame.load(moveHistory[i]);
        // Check if the last move was a capture
        const lastMove = tempGame.history({
            verbose: true
        }).pop();
        if (lastMove && lastMove.captured) {
            captureCount++;
            // Bonus for capturing with lower value piece
            const capturingPieceValue = getPieceValue(lastMove.piece);
            const capturedPieceValue = getPieceValue(lastMove.captured);
            if (capturingPieceValue < capturedPieceValue) {
                score += (capturedPieceValue - capturingPieceValue) * 2;
            }
        }
        // Check if the move resulted in a check
        if (tempGame.inCheck()) {
            checkCount++;
        }
    }
    // Reward for tactical play
    score += captureCount * 3;
    score += checkCount * 5;
    return score;
};
// Helper to get piece value
const getPieceValue = (piece)=>{
    const values = {
        'p': 1,
        'n': 3,
        'b': 3,
        'r': 5,
        'q': 9,
        'k': 0
    };
    return values[piece] || 0;
};
const findKingSquare = (chessInstance, kingColor)=>{
    const board = chessInstance.board();
    for(let r = 0; r < 8; r++){
        for(let f = 0; f < 8; f++){
            const piece = board[r][f];
            if (piece && piece.type === 'k' && piece.color === kingColor) {
                return "".concat(String.fromCharCode('a'.charCodeAt(0) + f)).concat(8 - r);
            }
        }
    }
    return null; // Should not happen in a valid game with a king
};
// New function to update check and game over status
const updateGameStatus = (currentGame)=>{
    if (!currentGame) return;
    setIsCheck(currentGame.isCheck());
    if (currentGame.isGameOver()) {
        setIsGameOverState(true);
        if (currentGame.isCheckmate()) {
            const winner = currentGame.turn() === 'w' ? 'Black' : 'White';
            setGameOverMessage("Checkmate! ".concat(winner, " wins."));
        } else if (currentGame.isStalemate()) {
            setGameOverMessage("Stalemate!");
        } else if (currentGame.isDraw()) {
            let reason = "Draw";
            if (currentGame.isThreefoldRepetition()) reason = "Draw by threefold repetition.";
            else if (currentGame.isInsufficientMaterial()) reason = "Draw by insufficient material.";
            else if (currentGame.isFiftyMoveRule()) reason = "Draw by 50-move rule.";
            setGameOverMessage(reason);
        } else {
            // Should be covered by specific conditions, but as a fallback
            setGameOverMessage("Game Over");
        }
    } else {
        setIsGameOverState(false);
        setGameOverMessage("");
    }
};
function ChessComponent(param) {
    let { systemTheme } = param;
    var _game_get, _game_get1;
    const [game, setGame] = (0,react.useState)(new chess/* Chess */.d$());
    const [boardWidth, setBoardWidth] = (0,react.useState)(480);
    const [moveHistory, setMoveHistory] = (0,react.useState)([]);
    const [currentPosition, setCurrentPosition] = (0,react.useState)(0);
    const [fen, setFen] = (0,react.useState)("");
    const [showInfo, setShowInfo] = (0,react.useState)(false);
    // Multiplayer state
    const [roomId, setRoomId] = (0,react.useState)("");
    const [playerColor, setPlayerColor] = (0,react.useState)("white");
    const [opponentConnected, setOpponentConnected] = (0,react.useState)(false);
    const [waitingForOpponent, setWaitingForOpponent] = (0,react.useState)(false);
    const [gameMode, setGameMode] = (0,react.useState)("local"); // "local", "computer", "online"
    const [linkCopied, setLinkCopied] = (0,react.useState)(false);
    const [playerName, setPlayerName] = (0,react.useState)("");
    const [opponentName, setOpponentName] = (0,react.useState)("");
    const [spectatorCount, setSpectatorCount] = (0,react.useState)(0);
    // UI state
    const [timeControl, setTimeControl] = (0,react.useState)({
        white: 600,
        black: 600,
        increment: 5
    }); // Default: 10 mins + 5s increment
    const [chatMessages, setChatMessages] = (0,react.useState)([]);
    const [newMessage, setNewMessage] = (0,react.useState)("");
    const [showChat, setShowChat] = (0,react.useState)(false);
    const [showMatchmaking, setShowMatchmaking] = (0,react.useState)(false);
    const [isInMatchmaking, setIsInMatchmaking] = (0,react.useState)(false);
    const [gameResult, setGameResult] = (0,react.useState)(null); // { result: 'win'/'loss'/'draw', winner?: 'white'/'black' }
    const [playerStats, setPlayerStats] = (0,react.useState)(null);
    const { theme, setTheme } = (0,dist/* useTheme */.D)();
    const [darkMode, setDarkMode] = (0,react.useState)(systemTheme === 'dark');
    const [soundEnabled, setSoundEnabled] = (0,react.useState)(true);
    const [showMoveList, setShowMoveList] = (0,react.useState)(false);
    const [highlightedSquares, setHighlightedSquares] = (0,react.useState)({});
    // Easter egg state
    const [easterEggNotification, setEasterEggNotification] = (0,react.useState)(null);
    const [activeAnimation, setActiveAnimation] = (0,react.useState)(null);
    const [secretVariation, setSecretVariation] = (0,react.useState)(null);
    const { success: konamiSuccess } = useKonamiCode();
    const [lastMove, setLastMove] = (0,react.useState)(null);
    const [isInCheck, setIsInCheck] = (0,react.useState)(false);
    const [customPieceStyle, setCustomPieceStyle] = (0,react.useState)('default'); // 'default', 'neo', '8bit'
    const [boardOrientation, setBoardOrientation] = (0,react.useState)('white'); // 'white' or 'black'
    // Password protection state
    const [gamePassword, setGamePassword] = (0,react.useState)("");
    const [showPasswordModal, setShowPasswordModal] = (0,react.useState)(false);
    const [passwordProtected, setPasswordProtected] = (0,react.useState)(false);
    const [passwordInput, setPasswordInput] = (0,react.useState)("");
    const [passwordError, setPasswordError] = (0,react.useState)("");
    const [isResuming, setIsResuming] = (0,react.useState)(false);
    const [showSavedGamesModal, setShowSavedGamesModal] = (0,react.useState)(false);
    const [savedSessions, setSavedSessions] = (0,react.useState)([]);
    // Add player score state
    const [playerScore, setPlayerScore] = (0,react.useState)(0);
    const [opponentScore, setOpponentScore] = (0,react.useState)(0);
    const [showScores, setShowScores] = (0,react.useState)(false);
    // Pre-move state
    const [preMove, setPreMove] = (0,react.useState)(null); // { from, to, promotion }
    const [isYourTurn, setIsYourTurn] = (0,react.useState)(true); // Tracks whose turn it is
    // Customization state
    const [currentBoardThemeName, setCurrentBoardThemeName] = (0,react.useState)(boardThemes[0].name);
    // User Account State (basic stubs)
    const [currentUser, setCurrentUser] = (0,react.useState)(null); // e.g., { username: 'Player1' } or null
    const [showLoginModal, setShowLoginModal] = (0,react.useState)(false);
    const [showRegisterModal, setShowRegisterModal] = (0,react.useState)(false);
    const [authForm, setAuthForm] = (0,react.useState)({
        username: '',
        password: ''
    });
    const [authError, setAuthError] = (0,react.useState)(null);
    // Added missing useState hooks
    const [gameHistory, setGameHistory] = (0,react.useState)([]);
    const [chatHistory, setChatHistory] = (0,react.useState)([]);
    const [matchmakingStatus, setMatchmakingStatus] = (0,react.useState)('idle'); // e.g., idle, searching, found
    const [isReady, setIsReady] = (0,react.useState)(false);
    const [gameStarted, setGameStarted] = (0,react.useState)(false);
    const socketRef = (0,react.useRef)(null);
    const messageContainerRef = (0,react.useRef)(null);
    const audioRef = (0,react.useRef)({
        move: typeof Audio !== 'undefined' ? new Audio('/sounds/move.mp3') : null,
        capture: typeof Audio !== 'undefined' ? new Audio('/sounds/capture.mp3') : null,
        check: typeof Audio !== 'undefined' ? new Audio('/sounds/check.mp3') : null,
        castle: typeof Audio !== 'undefined' ? new Audio('/sounds/castle.mp3') : null,
        gameEnd: typeof Audio !== 'undefined' ? new Audio('/sounds/game-end.mp3') : null,
        notify: typeof Audio !== 'undefined' ? new Audio('/sounds/notify.mp3') : null
    });
    // New state for check and game over status
    const [isCheck, setIsCheck1] = (0,react.useState)(false);
    const [gameOverMessage, setGameOverMessage1] = (0,react.useState)("");
    const [isGameOverState, setIsGameOverState1] = (0,react.useState)(false); // Renamed to avoid conflict with game.isGameOver()
    // Define king squares for highlighting
    const whiteKingSq = findKingSquare(game, 'w');
    const blackKingSq = findKingSquare(game, 'b');
    // Scroll chat to bottom when new messages arrive
    (0,react.useEffect)(()=>{
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [
        chatMessages
    ]);
    // Check for existing auth token on component mount
    (0,react.useEffect)(()=>{
        const fetchUserDataInternal = async (token)=>{
            try {
                const response = await axios/* default */.A.get("".concat(API_URL, "/api/auth/user"), {
                    headers: {
                        Authorization: "Bearer ".concat(token)
                    }
                });
                if (response.data.success) {
                    setCurrentUser({
                        id: response.data.user.id,
                        username: response.data.user.username,
                        role: response.data.user.role
                    });
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                localStorage.removeItem('authToken');
            }
        };
        const token = localStorage.getItem('authToken');
        if (token) {
            fetchUserDataInternal(token);
        }
    }, [
        API_URL
    ]); // API_URL is a constant, but good practice to list if it were dynamic. setCurrentUser is stable.
    // Connect to socket when component mounts
    (0,react.useEffect)(()=>{
        if (gameMode === "online") {
            // Connect to the socket server with reconnection options
            socketRef.current = (0,esm.io)(SOCKET_SERVER_URL, {
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                timeout: 10000,
                transports: [
                    'websocket',
                    'polling'
                ]
            });
            let connectionRetries = 0;
            const maxRetries = 3;
            // Connection error handling
            socketRef.current.on('connect_error', (error)=>{
                console.error('Socket connection error:', error);
                connectionRetries++;
                setChatMessages((prev)=>[
                        ...prev,
                        {
                            sender: 'System',
                            message: "Connection error: ".concat(error.message, ". Trying to reconnect... (").concat(connectionRetries, "/").concat(maxRetries, ")"),
                            timestamp: new Date().toISOString(),
                            system: true
                        }
                    ]);
                // If we've tried too many times, switch to local mode
                if (connectionRetries >= maxRetries) {
                    var _audioRef_current;
                    setChatMessages((prev)=>[
                            ...prev,
                            {
                                sender: 'System',
                                message: "Unable to connect to online server. Switching to local mode.",
                                timestamp: new Date().toISOString(),
                                system: true
                            }
                        ]);
                    // Disconnect and switch to local mode
                    socketRef.current.disconnect();
                    setGameMode("local");
                    setShowChat(false);
                    // Show a notification to the user
                    if ((_audioRef_current = audioRef.current) === null || _audioRef_current === void 0 ? void 0 : _audioRef_current.notify) {
                        audioRef.current.notify.play();
                    }
                }
            });
            socketRef.current.on('connect', ()=>{
                console.log('Socket connected successfully');
                setChatMessages((prev)=>[
                        ...prev,
                        {
                            sender: 'System',
                            message: 'Connected to game server',
                            timestamp: new Date().toISOString(),
                            system: true
                        }
                    ]);
                // Join room if we have a roomId
                if (roomId) {
                    socketRef.current.emit('joinRoom', {
                        roomId,
                        username: playerName || 'Player'
                    });
                }
            });
            // Set up event listeners
            socketRef.current.on('joinedAsColor', (param)=>{
                let { color, timeControl } = param;
                setPlayerColor(color);
                setIsYourTurn(color === 'white');
                if (timeControl) {
                    setTimeControl({
                        white: timeControl.whiteTime,
                        black: timeControl.blackTime
                    });
                }
            });
            socketRef.current.on('opponentJoined', (param)=>{
                let { opponentName } = param;
                setOpponentConnected(true);
                setWaitingForOpponent(false);
                setOpponentName(opponentName || 'Anonymous');
            });
            socketRef.current.on('passwordRequired', ()=>{
                setShowPasswordModal(true);
            });
            socketRef.current.on('passwordRejected', ()=>{
                setPasswordError("Incorrect password. Please try again.");
            });
            socketRef.current.on('gameResumed', (param)=>{
                let { gameState, moveHistory, chatHistory, playerColor, opponentName, timeControl } = param;
                // Restore game state
                const newGame = new chess/* Chess */.d$(gameState);
                setGame(newGame);
                setFen(newGame.fen());
                // Restore move history
                if (moveHistory && moveHistory.length > 0) {
                    setMoveHistory(moveHistory);
                    setCurrentPosition(moveHistory.length - 1);
                }
                // Restore chat history
                if (chatHistory && chatHistory.length > 0) {
                    setChatMessages(chatHistory);
                }
                // Restore player info
                if (playerColor) {
                    setPlayerColor(playerColor);
                    setIsYourTurn(newGame.turn() === (playerColor === 'white' ? 'w' : 'b'));
                }
                if (opponentName) {
                    setOpponentName(opponentName);
                    setOpponentConnected(true);
                    setWaitingForOpponent(false);
                }
                // Restore time control
                if (timeControl) {
                    setTimeControl(timeControl);
                }
                // Add system message
                setChatMessages((prev)=>[
                        ...prev,
                        {
                            sender: 'System',
                            message: 'Game resumed successfully',
                            timestamp: new Date().toISOString(),
                            system: true
                        }
                    ]);
            });
            socketRef.current.on('opponentMove', (param)=>{
                let { move, gameState, remainingTime } = param;
                const newGame = new chess/* Chess */.d$(gameState);
                setGame(newGame);
                setFen(newGame.fen());
                // Update move history
                const newHistory = [
                    ...moveHistory,
                    gameState
                ];
                setMoveHistory(newHistory);
                setCurrentPosition(newHistory.length - 1);
                // Update clock if provided
                if (remainingTime) {
                    setTimeControl(remainingTime);
                }
                updateGameStatus(newGame);
                setIsYourTurn(true); // It's now our turn
                // Attempt to play pre-move if one exists
                if (preMove) {
                    const { from, to, promotion } = preMove;
                    const tempGame = new chess/* Chess */.d$(newGame.fen()); // Use a copy to try the move
                    const legalMove = tempGame.move({
                        from,
                        to,
                        promotion
                    });
                    if (legalMove) {
                        setGame(new chess/* Chess */.d$(tempGame.fen())); // Apply the move
                        updateGameStatus(tempGame);
                        setLastMove({
                            from,
                            to
                        }); // Highlight the executed pre-move
                        if (gameMode === "online" && socketRef.current) {
                            socketRef.current.emit('move', {
                                roomId,
                                move: {
                                    from,
                                    to,
                                    promotion,
                                    color: playerColor === 'white' ? 'w' : 'b'
                                },
                                gameState: tempGame.fen()
                            });
                        }
                        setIsYourTurn(false); // Turn ends after successful pre-move
                        setChatMessages((prev)=>[
                                ...prev,
                                {
                                    sender: 'System',
                                    message: 'Pre-move executed.',
                                    timestamp: new Date().toISOString(),
                                    system: true
                                }
                            ]);
                    } else {
                        setChatMessages((prev)=>[
                                ...prev,
                                {
                                    sender: 'System',
                                    message: 'Pre-move was invalid and has been cleared.',
                                    timestamp: new Date().toISOString(),
                                    system: true
                                }
                            ]);
                    }
                    setPreMove(null); // Clear pre-move whether it succeeded or failed
                }
            });
            socketRef.current.on('clockUpdate', (param)=>{
                let { white, black } = param;
                setTimeControl({
                    white,
                    black
                });
            });
            socketRef.current.on('opponentDisconnected', (param)=>{
                let { color } = param;
                // Handle opponent disconnection
                setChatMessages((prev)=>[
                        ...prev,
                        {
                            sender: 'System',
                            message: "".concat(color === 'white' ? 'White' : 'Black', " player disconnected"),
                            timestamp: new Date().toISOString(),
                            system: true
                        }
                    ]);
            });
            socketRef.current.on('newMessage', (message)=>{
                setChatMessages((prev)=>[
                        ...prev,
                        message
                    ]);
            });
            socketRef.current.on('gameOver', (param)=>{
                let { result, winner } = param;
                setGameResult({
                    result,
                    winner
                });
                setIsYourTurn(false);
            });
            socketRef.current.on('spectatorJoined', (param)=>{
                let { spectatorName, spectatorCount } = param;
                setSpectatorCount(spectatorCount);
                setChatMessages((prev)=>[
                        ...prev,
                        {
                            sender: 'System',
                            message: "".concat(spectatorName, " joined as spectator"),
                            timestamp: new Date().toISOString(),
                            system: true
                        }
                    ]);
            });
            socketRef.current.on('spectatorLeft', (param)=>{
                let { spectatorCount } = param;
                setSpectatorCount(spectatorCount);
            });
            socketRef.current.on('gameHistory', (param)=>{
                let { moves, chat } = param;
                setGameHistory(moves);
                setChatHistory(chat || []);
            });
            socketRef.current.on('waitingForMatch', ()=>{
                setMatchmakingStatus('searching');
            });
            socketRef.current.on('matchmakingCancelled', ()=>{
                setMatchmakingStatus('none');
            });
            socketRef.current.on('matchFound', (param)=>{
                let { roomId, color, opponent, timeControl } = param;
                setMatchmakingStatus('found');
                setRoomId(roomId);
                setPlayerColor(color);
                setOpponentName(opponent || 'Anonymous');
                setTimeControl(timeControl);
                setGameMode('online');
                setIsReady(true);
                setGameStarted(true);
                (0,utils/* updateURLWithRoomId */.hB)(roomId);
                (0,utils/* addNotification */.z8)({
                    type: 'success',
                    message: "Match found! You're playing as ".concat(color === 'white' ? 'White' : 'Black', " against ").concat(opponent || 'Anonymous', "."),
                    duration: 5000
                });
                // Add to recent games list
                (0,utils/* addRecentGame */.T7)(roomId, opponent || 'Anonymous');
            });
            // Add handler for cancelPreMove event
            socketRef.current.on('cancelPreMove', (param)=>{
                let { reason, premove } = param;
                setPreMove(null);
                // Display notification about canceled pre-move
                setEasterEggNotification({
                    type: 'warning',
                    message: reason === 'invalid' ? 'Pre-move canceled: no longer valid after opponent\'s move.' : 'Pre-move canceled due to an error.',
                    duration: 3000
                });
            });
            socketRef.current.on('executePreMove', (premoveData)=>{
                // Handle the pre-move execution
                if (premoveData && premoveData.from && premoveData.to) {
                // The existing logic will handle this in the effect watching for isYourTurn
                }
            });
            // Request game history if joining an existing game
            if (roomId) {
                socketRef.current.emit('getGameHistory', {
                    roomId
                });
            }
            // Clean up on unmount
            return ()=>{
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }
            };
        }
    }, [
        gameMode,
        roomId,
        playerName,
        playerColor,
        moveHistory,
        preMove
    ]);
    // Parse roomId from URL on component mount
    (0,react.useEffect)(()=>{
        if (true) {
            const urlParams = new URLSearchParams(window.location.search);
            const roomIdParam = urlParams.get('room');
            if (roomIdParam) {
                setRoomId(roomIdParam);
                setGameMode("online");
                // Check if this room has a saved password
                const savedPassword = getGamePassword(roomIdParam);
                if (savedPassword) {
                    // We have a saved password, check if we're the original player
                    const sessions = getSavedSessions();
                    const matchingSession = sessions.find((session)=>session.roomId === roomIdParam);
                    if (matchingSession) {
                        // We're resuming a previous session
                        setIsResuming(true);
                        setPlayerName(matchingSession.playerName || 'Player');
                        setPlayerColor(matchingSession.playerColor || 'white');
                        setPasswordProtected(true);
                        setGamePassword(savedPassword);
                        // Join the room with the saved password
                        if (socketRef.current) {
                            socketRef.current.emit('joinRoom', {
                                roomId: roomIdParam,
                                username: matchingSession.playerName || 'Player',
                                isResuming: true,
                                password: savedPassword
                            });
                        }
                    } else {
                        // We need to enter the password
                        setShowPasswordModal(true);
                    }
                } else {
                    // No password, join normally
                    if (socketRef.current) {
                        socketRef.current.emit('joinRoom', {
                            roomId: roomIdParam,
                            username: playerName || 'Player'
                        });
                    }
                }
            }
        }
    }, [
        playerName,
        roomId,
        socketRef,
        getGamePassword,
        getSavedSessions
    ]);
    // Theme synchronization
    (0,react.useEffect)(()=>{
        setDarkMode(theme === 'dark');
    }, [
        theme
    ]);
    // Konami code effect
    (0,react.useEffect)(()=>{
        if (konamiSuccess) {
            const effect = easterEggEffects.konamiCodeEffect();
            setEasterEggNotification({
                title: effect.title,
                message: effect.message,
                variant: effect.variant,
                open: true
            });
        }
    }, [
        konamiSuccess
    ]);
    // Check for Easter Eggs after each move
    (0,react.useEffect)(()=>{
        if (moveHistory.length === 0) return;
        // Only check for easter eggs in local mode
        if (gameMode !== 'local') return;
        // Check for special move sequences
        const currentMoves = game.history();
        Object.entries(SPECIAL_MOVE_SEQUENCES).forEach((param)=>{
            let [key, sequence] = param;
            // Check if the move sequence matches the beginning of one of our special sequences
            if (currentMoves.length >= sequence.length) {
                const lastMoves = currentMoves.slice(-sequence.length);
                if (JSON.stringify(lastMoves) === JSON.stringify(sequence)) {
                    const effect = easterEggEffects.moveSequenceEffects[key]();
                    setEasterEggNotification({
                        title: effect.title,
                        message: effect.message,
                        variant: effect.variant,
                        open: true
                    });
                    if (effect.animation) {
                        setActiveAnimation(effect.animation);
                        setTimeout(()=>setActiveAnimation(null), 3000);
                    }
                    if (effect.sound && soundEnabled) {
                        const audio = new Audio(effect.sound);
                        audio.play();
                    }
                }
            }
        });
        // Check for special positions
        const position = game.board();
        // Flatten the position and check against special positions
        const flatPosition = position.flat().filter((p)=>p !== null);
        Object.entries(SPECIAL_POSITIONS).forEach((param)=>{
            let [key, specialPos] = param;
            // Check if all pieces in the special position are on the board
            const match = specialPos.every((specPiece)=>flatPosition.some((p)=>p.type === specPiece.piece && p.color === specPiece.color && game.get(specPiece.square) !== null));
            if (match) {
                const effect = easterEggEffects.positionEffects[key]();
                setEasterEggNotification({
                    title: effect.title,
                    message: effect.message,
                    variant: effect.variant,
                    open: true
                });
                if (effect.animation) {
                    setActiveAnimation(effect.animation);
                    setTimeout(()=>setActiveAnimation(null), 3000);
                }
                if (effect.sound && soundEnabled) {
                    const audio = new Audio(effect.sound);
                    audio.play();
                }
            }
        });
    }, [
        moveHistory,
        game,
        gameMode,
        soundEnabled
    ]);
    // Responsive board sizing
    (0,react.useEffect)(()=>{
        const handleResize = ()=>{
            const width = Math.min(480, window.innerWidth - 40);
            setBoardWidth(width);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return ()=>window.removeEventListener('resize', handleResize);
    }, []);
    // Set up initial position
    (0,react.useEffect)(()=>{
        resetGame();
    }, [
        resetGame
    ]);
    // Update FEN when game changes
    (0,react.useEffect)(()=>{
        if (game) {
            setFen(game.fen());
            // Check for game over conditions
            if (game.isGameOver()) {
                let result = 'draw';
                let winner = null;
                if (game.isCheckmate()) {
                    winner = game.turn() === 'w' ? 'black' : 'white';
                    result = "checkmate - ".concat(winner, " wins");
                } else if (game.isDraw()) {
                    if (game.isStalemate()) {
                        result = 'draw - stalemate';
                    } else if (game.isThreefoldRepetition()) {
                        result = 'draw - threefold repetition';
                    } else if (game.isInsufficientMaterial()) {
                        result = 'draw - insufficient material';
                    } else {
                        result = 'draw - fifty move rule';
                    }
                }
                setGameResult({
                    result,
                    winner
                });
                // Send game over event in online mode
                if (gameMode === 'online' && socketRef.current) {
                    socketRef.current.emit('gameOver', {
                        roomId,
                        result,
                        winner
                    });
                }
            }
        }
    }, [
        game,
        gameMode,
        roomId
    ]);
    // Modify the existing code where the game ends (checkmate, draw, etc.)
    (0,react.useEffect)(()=>{
        if (gameResult) {
            // Calculate scores
            const playerTimeRemaining = timeControl[playerColor];
            const opponentTimeRemaining = timeControl[playerColor === 'white' ? 'black' : 'white'];
            // Calculate scores based on final position and game history
            const pScore = calculatePlayerScore(game, playerTimeRemaining, moveHistory);
            const oScore = calculatePlayerScore(game, opponentTimeRemaining, moveHistory);
            setPlayerScore(pScore);
            setOpponentScore(oScore);
            setShowScores(true);
        }
    }, [
        gameResult,
        game,
        moveHistory,
        playerColor,
        timeControl
    ]);
    // Handle a piece drop
    const onDrop = (sourceSquare, targetSquare)=>{
        const piece = game.get(sourceSquare);
        // Pre-move logic for online games when it's not your turn
        if (gameMode === "online" && !isYourTurn && piece && piece.color === playerColor[0]) {
            setPreMove({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q'
            });
            // Visual feedback for pre-move will be handled by customSquareStyles
            setChatMessages((prev)=>[
                    ...prev,
                    {
                        sender: 'System',
                        message: "Pre-move set: ".concat(sourceSquare, "-").concat(targetSquare),
                        timestamp: new Date().toISOString(),
                        system: true
                    }
                ]);
            return false; // Don't make the move yet
        }
        // If it is your turn, clear any existing pre-move
        if (isYourTurn && preMove) {
            setPreMove(null);
        }
        try {
            const currentPromotion = (piece === null || piece === void 0 ? void 0 : piece.type) === 'p' && (targetSquare.endsWith('8') || targetSquare.endsWith('1')) ? 'q' : undefined;
            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: currentPromotion
            });
            if (move === null) return false; // illegal move
            setLastMove({
                from: sourceSquare,
                to: targetSquare
            });
            // Update game and history when a valid move is made
            const newGameInstance = new chess/* Chess */.d$(game.fen());
            setGame(newGameInstance);
            updateGameStatus(newGameInstance);
            if (gameMode === "local") {
                const newHistory = [
                    ...moveHistory.slice(0, currentPosition + 1),
                    game.fen()
                ];
                setMoveHistory(newHistory);
                setCurrentPosition(newHistory.length - 1); // Ensure currentPosition points to the latest move
            }
            // In online mode, send move to opponent and switch turns
            if (gameMode === "online" && socketRef.current) {
                socketRef.current.emit('move', {
                    roomId,
                    move: {
                        from: sourceSquare,
                        to: targetSquare,
                        promotion: currentPromotion,
                        color: playerColor === 'white' ? 'w' : 'b'
                    },
                    gameState: game.fen()
                });
                setIsYourTurn(false);
            }
            return true;
        } catch (error) {
            console.error("Error making move:", error);
            return false;
        }
    };
    // Reset the game
    const resetGame = (0,react.useCallback)(()=>{
        const newGame = new chess/* Chess */.d$();
        setGame(newGame);
        setMoveHistory([
            newGame.fen()
        ]);
        setCurrentPosition(0);
        setGameResult(null);
        setIsGameOverState1(false);
        setGameOverMessage1("");
        setIsCheck1(false);
        setPreMove(null); // Clear pre-move on reset
        setLastMove(null); // Clear last move highlight
        if (gameMode === "online") {
            setIsYourTurn(playerColor === "white");
        }
    }, [
        gameMode,
        playerColor
    ]);
    // Undo last move
    const undoLastMove = (0,react.useCallback)(()=>{
        // Only allow in local mode
        if (gameMode === "online") return;
        if (currentPosition > 0) {
            const newPosition = currentPosition - 1;
            const newGame = new chess/* Chess */.d$();
            newGame.load(moveHistory[newPosition]);
            setGame(newGame);
            setCurrentPosition(newPosition);
        }
    }, [
        currentPosition,
        moveHistory,
        gameMode
    ]);
    // Redo move
    const redoMove = (0,react.useCallback)(()=>{
        // Only allow in local mode
        if (gameMode === "online") return;
        if (currentPosition < moveHistory.length - 1) {
            const newPosition = currentPosition + 1;
            const newGame = new chess/* Chess */.d$();
            newGame.load(moveHistory[newPosition]);
            setGame(newGame);
            setCurrentPosition(newPosition);
        }
    }, [
        currentPosition,
        moveHistory,
        gameMode
    ]);
    // Flip board orientation
    const flipBoard = (0,react.useCallback)(()=>{
        if (gameMode === "online" && playerColor) {
            // In online mode, flip to show player's pieces at the bottom
            setBoardOrientation(playerColor);
        } else if (gameMode === "local") {
            // In local mode, toggle orientation
            setBoardOrientation((prev)=>prev === 'white' ? 'black' : 'white');
        }
    // No need to do setGame(new Chess(game.fen())) as board orientation is a UI concern here
    }, [
        gameMode,
        playerColor
    ]);
    // Create a new game room
    const createGameRoom = ()=>{
        const newRoomId = (0,v4/* default */.A)().substring(0, 8);
        setRoomId(newRoomId);
        setGameMode("online");
        setPlayerColor("white");
        setWaitingForOpponent(true);
        setIsYourTurn(true); // Creator goes first
        // Generate a password if password protection is enabled
        if (passwordProtected) {
            const newPassword = generateGamePassword();
            setGamePassword(newPassword);
            saveGamePassword(newRoomId, newPassword);
        }
        // Update URL with room ID
        if (true) {
            const url = new URL(window.location.href);
            url.searchParams.set('room', newRoomId);
            window.history.pushState({}, '', url);
        }
        // Connect and join room
        if (socketRef.current) {
            socketRef.current.emit('joinRoom', {
                roomId: newRoomId,
                username: playerName || 'Player',
                hasPassword: passwordProtected
            });
        }
        resetGame();
    };
    // Start matchmaking
    const startMatchmaking = (e)=>{
        e.preventDefault();
        if (!playerName) {
            alert('Please enter your name first');
            return;
        }
        setGameMode("online");
        // Send matchmaking request
        if (socketRef.current) {
            socketRef.current.emit('findMatch', {
                username: playerName,
                timeControl: {
                    initial: 600,
                    increment: 5 // 5 seconds increment
                }
            });
        }
    };
    // Cancel matchmaking
    const cancelMatchmaking = ()=>{
        if (socketRef.current) {
            socketRef.current.emit('cancelMatchmaking');
        }
        setIsInMatchmaking(false);
    };
    // Copy game link to clipboard
    const copyGameLink = ()=>{
        if (true) {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            setLinkCopied(true);
            // Reset copied status after 3 seconds
            setTimeout(()=>{
                setLinkCopied(false);
            }, 3000);
        }
    };
    // Send chat message
    const sendChatMessage = (e)=>{
        e.preventDefault();
        if (!newMessage.trim() || !socketRef.current) return;
        socketRef.current.emit('sendMessage', {
            roomId,
            message: newMessage.trim(),
            sender: playerName || 'Player',
            role: playerColor
        });
        // Add message locally to ensure it appears immediately
        setChatMessages((prev)=>[
                ...prev,
                {
                    sender: playerName || 'Player',
                    message: newMessage.trim(),
                    timestamp: new Date().toISOString(),
                    role: playerColor
                }
            ]);
        setNewMessage('');
    };
    // Format time display
    const formatTime = (seconds)=>{
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return "".concat(mins, ":").concat(secs < 10 ? '0' : '').concat(secs);
    };
    // Return to local mode
    const exitOnlineGame = ()=>{
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        setGameMode("local");
        setWaitingForOpponent(false);
        setOpponentConnected(false);
        setRoomId("");
        setPlayerColor("white");
        setIsYourTurn(true);
        setChatMessages([]);
        setGameResult(null);
        // Remove room from URL
        if (true) {
            const url = new URL(window.location.href);
            url.searchParams.delete('room');
            window.history.pushState({}, '', url);
        }
        resetGame();
    };
    // Password protection functions
    const generateGamePassword = ()=>{
        // Generate a random 6-character alphanumeric password
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for(let i = 0; i < 6; i++){
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };
    const saveGamePassword = (roomId, password)=>{
        if ( true && window.localStorage) {
            // Save password in localStorage
            window.localStorage.setItem("".concat(PASSWORD_KEY_PREFIX).concat(roomId), password);
            // Save session info
            const sessionInfo = {
                roomId,
                playerName,
                playerColor,
                timestamp: new Date().toISOString()
            };
            // Get existing sessions or initialize empty array
            const existingSessions = JSON.parse(window.localStorage.getItem(SESSION_KEY_PREFIX) || '[]');
            // Add new session, removing any duplicate for same roomId
            const updatedSessions = [
                ...existingSessions.filter((session)=>session.roomId !== roomId),
                sessionInfo
            ];
            // Save updated sessions
            window.localStorage.setItem(SESSION_KEY_PREFIX, JSON.stringify(updatedSessions));
        }
    };
    const getGamePassword = (0,react.useCallback)((roomId)=>{
        if ( true && window.localStorage) {
            return window.localStorage.getItem("".concat(PASSWORD_KEY_PREFIX).concat(roomId));
        }
        return null;
    }, []);
    const getSavedSessions = (0,react.useCallback)(()=>{
        if ( true && window.localStorage) {
            const sessions = JSON.parse(window.localStorage.getItem(SESSION_KEY_PREFIX) || '[]');
            // Sort by most recent first
            return sessions.sort((a, b)=>new Date(b.timestamp) - new Date(a.timestamp));
        }
        return [];
    }, []);
    const handlePasswordProtection = (e)=>{
        e.preventDefault();
        if (!passwordProtected) {
            // Generate a password if enabling protection
            const newPassword = generateGamePassword();
            setGamePassword(newPassword);
            setPasswordProtected(true);
            // Save password
            if (roomId) {
                saveGamePassword(roomId, newPassword);
                // Notify server about password protection
                if (socketRef.current) {
                    socketRef.current.emit('setRoomPassword', {
                        roomId,
                        hasPassword: true,
                        password: newPassword // Send the new password to the server
                    });
                }
            }
        } else {
            // Disabling password protection
            setGamePassword("");
            setPasswordProtected(false);
            // Remove password from storage
            if ( true && window.localStorage && roomId) {
                window.localStorage.removeItem("".concat(PASSWORD_KEY_PREFIX).concat(roomId));
                // Notify server about password removal
                if (socketRef.current) {
                    socketRef.current.emit('setRoomPassword', {
                        roomId,
                        hasPassword: false,
                        password: null // Explicitly send null when removing password
                    });
                }
            }
        }
    };
    const verifyPassword = (e)=>{
        e.preventDefault();
        // Get stored password for this room
        const storedPassword = getGamePassword(roomId);
        if (passwordInput === storedPassword) {
            // Password matches
            setPasswordError("");
            setShowPasswordModal(false);
            // Join the room
            if (socketRef.current) {
                socketRef.current.emit('joinRoom', {
                    roomId,
                    username: playerName || 'Player',
                    isResuming: true
                });
            }
            // Reset password input
            setPasswordInput("");
        } else {
            // Password doesn't match
            setPasswordError("Incorrect password. Please try again.");
        }
    };
    // Resume a saved game
    const resumeGame = (session)=>{
        if (!session || !session.roomId) return;
        // Get the password for this room
        const savedPassword = getGamePassword(session.roomId);
        if (!savedPassword) {
            alert('Password not found for this game session');
            return;
        }
        // Set up session info
        setRoomId(session.roomId);
        setGameMode("online");
        setPlayerName(session.playerName || 'Player');
        setPlayerColor(session.playerColor || 'white');
        setIsResuming(true);
        setPasswordProtected(true);
        setGamePassword(savedPassword);
        // Update URL with room ID
        if (true) {
            const url = new URL(window.location.href);
            url.searchParams.set('room', session.roomId);
            window.history.pushState({}, '', url);
        }
        // Connect and join room
        if (socketRef.current) {
            socketRef.current.emit('joinRoom', {
                roomId: session.roomId,
                username: session.playerName || 'Player',
                isResuming: true,
                password: savedPassword
            });
        }
        // Close the modal
        setShowSavedGamesModal(false);
    };
    // Load saved sessions on component mount
    (0,react.useEffect)(()=>{
        if (true) {
            const sessions = getSavedSessions();
            setSavedSessions(sessions);
        }
    }, [
        getSavedSessions
    ]);
    const onSquareClick = (square)=>{
        if (preMove) {
            // If a pre-move is set and the clicked square is part of it, cancel it
            if (preMove.from === square || preMove.to === square) {
                setPreMove(null);
                setChatMessages((prev)=>[
                        ...prev,
                        {
                            sender: 'System',
                            message: 'Pre-move cancelled.',
                            timestamp: new Date().toISOString(),
                            system: true
                        }
                    ]);
            }
        }
    // Add other square click logic if needed in the future (e.g., highlighting legal moves)
    };
    const handleThemeChange = (themeName)=>{
        setCurrentBoardThemeName(themeName);
        if ( true && window.localStorage) {
            window.localStorage.setItem('chessBoardTheme', themeName);
        }
    };
    const selectedBoardTheme = boardThemes.find((t)=>t.name === currentBoardThemeName) || boardThemes[0];
    const currentStyles = darkMode ? selectedBoardTheme.darkMode : selectedBoardTheme.lightMode;
    // API URL for backend
    const API_URL = "https://beenycool-github-io.onrender.com" || 0;
    // fetchUserData has been moved inside the useEffect at line 322
    const handleAuthInputChange = (e)=>{
        const { name, value } = e.target;
        setAuthForm((prev)=>({
                ...prev,
                [name]: value
            }));
        // Clear any error when user starts typing
        if (authError) setAuthError(null);
    };
    const handleRegister = async (e)=>{
        e.preventDefault();
        try {
            const response = await axios/* default */.A.post("".concat(API_URL, "/api/auth/register"), {
                username: authForm.username,
                password: authForm.password
            });
            if (response.data.success) {
                // Store token
                localStorage.setItem('authToken', response.data.token);
                // Set current user
                setCurrentUser({
                    id: response.data.user.id,
                    username: response.data.user.username,
                    role: response.data.user.role
                });
                // Close modal and reset form
                setShowRegisterModal(false);
                setAuthForm({
                    username: '',
                    password: ''
                });
            }
        } catch (error) {
            var _error_response_data, _error_response;
            console.error('Registration error:', error);
            setAuthError(((_error_response = error.response) === null || _error_response === void 0 ? void 0 : (_error_response_data = _error_response.data) === null || _error_response_data === void 0 ? void 0 : _error_response_data.message) || 'Registration failed. Please try again.');
        }
    };
    const handleLogin = async (e)=>{
        e.preventDefault();
        try {
            const response = await axios/* default */.A.post("".concat(API_URL, "/api/auth/login"), {
                username: authForm.username,
                password: authForm.password
            });
            if (response.data.success) {
                // Store token
                localStorage.setItem('authToken', response.data.token);
                // Set current user
                setCurrentUser({
                    id: response.data.user.id,
                    username: response.data.user.username,
                    role: response.data.user.role
                });
                // Close modal and reset form
                setShowLoginModal(false);
                setAuthForm({
                    username: '',
                    password: ''
                });
            }
        } catch (error) {
            var _error_response_data, _error_response;
            console.error('Login error:', error);
            setAuthError(((_error_response = error.response) === null || _error_response === void 0 ? void 0 : (_error_response_data = _error_response.data) === null || _error_response_data === void 0 ? void 0 : _error_response_data.message) || 'Invalid username or password.');
        }
    };
    const handleLogout = async ()=>{
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                // Call logout endpoint if it exists
                try {
                    await axios/* default */.A.post("".concat(API_URL, "/api/auth/logout"), {}, {
                        headers: {
                            Authorization: "Bearer ".concat(token)
                        }
                    });
                } catch (e) {
                    // Ignore if logout endpoint doesn't exist
                    console.log('Logout endpoint not available');
                }
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally{
            // Always clear local storage and reset user state
            localStorage.removeItem('authToken');
            setCurrentUser(null);
        }
    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "flex flex-col items-center min-h-screen p-4 bg-gray-50 text-gray-900 ".concat(darkMode ? 'dark-mode dark:bg-gray-900 dark:text-gray-100' : ''),
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("header", {
                className: "w-full max-w-5xl flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h1", {
                        className: "text-3xl font-bold",
                        children: "Chess"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex gap-2 items-center",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(ui_select/* Select */.l6, {
                                value: currentBoardThemeName,
                                onValueChange: handleThemeChange,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectTrigger */.bq, {
                                        className: "w-[130px] h-8 text-xs",
                                        title: "Change board theme",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectValue */.yv, {
                                            placeholder: "Board Theme"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectContent */.gC, {
                                        children: boardThemes.map((theme)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(ui_select/* SelectItem */.eb, {
                                                value: theme.name,
                                                className: "text-xs",
                                                children: theme.name
                                            }, theme.name))
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                onClick: ()=>setSoundEnabled(!soundEnabled),
                                className: "control-button",
                                title: soundEnabled ? "Mute sounds" : "Enable sounds",
                                children: soundEnabled ? /*#__PURE__*/ (0,jsx_runtime.jsx)(volume_2/* default */.A, {
                                    size: 18
                                }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(volume_x/* default */.A, {
                                    size: 18
                                })
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                onClick: ()=>setDarkMode(!darkMode),
                                className: "control-button",
                                title: darkMode ? "Light mode" : "Dark mode",
                                children: darkMode ? /*#__PURE__*/ (0,jsx_runtime.jsx)(sun/* default */.A, {
                                    size: 18
                                }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(moon/* default */.A, {
                                    size: 18
                                })
                            }),
                            currentUser ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                        className: "text-sm",
                                        children: [
                                            "Hi, ",
                                            currentUser.username,
                                            "!"
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                        onClick: handleLogout,
                                        className: "control-button text-xs h-8 px-2",
                                        title: "Logout",
                                        children: "Logout"
                                    })
                                ]
                            }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                        onClick: ()=>setShowLoginModal(true),
                                        className: "control-button text-xs h-8 px-2",
                                        title: "Login",
                                        children: "Login"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                        onClick: ()=>setShowRegisterModal(true),
                                        className: "control-button text-xs h-8 px-2",
                                        title: "Register",
                                        children: "Register"
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            showLoginModal && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "game-room-container p-6 shadow-lg max-w-md w-full",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                            className: "text-xl font-bold mb-4",
                            children: "Login"
                        }),
                        authError && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm",
                            children: authError
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("form", {
                            onSubmit: handleLogin,
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "mb-4",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "Username"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                            type: "text",
                                            name: "username",
                                            value: authForm.username,
                                            onChange: handleAuthInputChange,
                                            className: "w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700",
                                            required: true
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "mb-6",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "Password"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                            type: "password",
                                            name: "password",
                                            value: authForm.password,
                                            onChange: handleAuthInputChange,
                                            className: "w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700",
                                            required: true
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "flex justify-end gap-2",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                            type: "button",
                                            onClick: ()=>setShowLoginModal(false),
                                            className: "chess-button chess-button-secondary",
                                            children: "Cancel"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                            type: "submit",
                                            className: "chess-button chess-button-primary",
                                            children: "Login"
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            }),
            showRegisterModal && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "game-room-container p-6 shadow-lg max-w-md w-full",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                            className: "text-xl font-bold mb-4",
                            children: "Register"
                        }),
                        authError && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm",
                            children: authError
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("form", {
                            onSubmit: handleRegister,
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "mb-4",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "Username"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                            type: "text",
                                            name: "username",
                                            value: authForm.username,
                                            onChange: handleAuthInputChange,
                                            className: "w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700",
                                            required: true
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "mb-6",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "Password"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                            type: "password",
                                            name: "password",
                                            value: authForm.password,
                                            onChange: handleAuthInputChange,
                                            className: "w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700",
                                            required: true
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "flex justify-end gap-2",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                            type: "button",
                                            onClick: ()=>setShowRegisterModal(false),
                                            className: "chess-button chess-button-secondary",
                                            children: "Cancel"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                            type: "submit",
                                            className: "chess-button chess-button-primary",
                                            children: "Register"
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            }),
            !currentUser && !playerName && gameMode === "online" && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "w-full max-w-md mb-6 game-room-container p-6 shadow-md",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("form", {
                    onSubmit: (e)=>{
                        e.preventDefault();
                        const nameInput = e.target.elements.playerName;
                        if (nameInput.value.trim()) {
                            setPlayerName(nameInput.value.trim());
                        }
                    },
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                            className: "font-bold text-lg mb-3",
                            children: "Enter Your Name"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                            className: "block text-sm font-medium mb-2",
                            children: "To continue to the game:"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                    name: "playerName",
                                    className: "flex-1 rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700",
                                    placeholder: "Your name",
                                    required: true
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                    type: "submit",
                                    className: "chess-button chess-button-primary",
                                    children: "Continue"
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "w-full max-w-5xl mb-6",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "flex justify-between",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                            onClick: ()=>gameMode === "online" ? exitOnlineGame() : null,
                            className: "py-2 px-4 rounded-l-md ".concat(gameMode === "local" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"),
                            children: "Local Game"
                        }),
                        gameMode === "online" ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                            className: "py-2 px-4 rounded-r-md bg-blue-600 text-white flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(users/* default */.A, {
                                    size: 18
                                }),
                                "Online Game"
                            ]
                        }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                    onClick: createGameRoom,
                                    className: "py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(user_plus/* default */.A, {
                                            size: 18
                                        }),
                                        "Create Game"
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                    onClick: ()=>setShowMatchmaking(true),
                                    className: "py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(users/* default */.A, {
                                            size: 18
                                        }),
                                        "Find Match"
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                    onClick: ()=>setShowSavedGamesModal(true),
                                    className: "py-2 px-4 rounded-r-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(icons_history/* default */.A, {
                                            size: 18
                                        }),
                                        "Saved Games"
                                    ]
                                })
                            ]
                        })
                    ]
                })
            }),
            showMatchmaking && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "game-room-container p-6 shadow-lg max-w-md w-full",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                            className: "text-xl font-bold mb-4",
                            children: "Find a Match"
                        }),
                        isInMatchmaking ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "text-center py-8",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: "animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "mb-4 text-lg",
                                    children: "Looking for an opponent..."
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                    onClick: cancelMatchmaking,
                                    className: "chess-button chess-button-primary bg-red-600 hover:bg-red-700",
                                    children: "Cancel"
                                })
                            ]
                        }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)("form", {
                            onSubmit: startMatchmaking,
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "mb-4",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                            className: "block text-sm font-medium mb-2",
                                            children: "Your Name:"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                            className: "w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700",
                                            placeholder: "Enter your name",
                                            value: playerName,
                                            onChange: (e)=>setPlayerName(e.target.value),
                                            required: true
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "mb-4",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                            className: "block text-sm font-medium mb-2",
                                            children: "Time Control:"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("select", {
                                            className: "w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                    value: "blitz",
                                                    children: "Blitz (5 min)"
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                    value: "rapid",
                                                    selected: true,
                                                    children: "Rapid (10 min)"
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                    value: "classical",
                                                    children: "Classical (30 min)"
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "flex justify-end gap-2 mt-6",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                            type: "button",
                                            onClick: ()=>setShowMatchmaking(false),
                                            className: "chess-button chess-button-secondary",
                                            children: "Cancel"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                            type: "submit",
                                            className: "chess-button chess-button-primary",
                                            children: "Find Opponent"
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            }),
            gameMode === "online" && roomId && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "w-full max-w-5xl mb-6 game-room-container p-4 shadow-md",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "flex flex-col gap-3",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex justify-between items-center",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                    className: "font-medium",
                                    children: [
                                        "Game Room: ",
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "font-mono",
                                            children: roomId
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    children: [
                                        waitingForOpponent ? /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "status-message status-warning inline-block animate-pulse",
                                            children: "Waiting for opponent..."
                                        }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "status-message status-success inline-block",
                                            children: "Opponent connected"
                                        }),
                                        spectatorCount > 0 && /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                            className: "ml-2 text-sm",
                                            children: [
                                                "(",
                                                spectatorCount,
                                                " spectator",
                                                spectatorCount !== 1 ? 's' : '',
                                                ")"
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex justify-between items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: "flex-1 text-sm bg-gray-100 dark:bg-gray-700 py-1 px-2 rounded truncate font-mono",
                                    children:  true ? window.location.href : 0
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                    onClick: copyGameLink,
                                    className: "chess-button chess-button-primary py-1 px-3",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(copy/* default */.A, {
                                            size: 16
                                        }),
                                        linkCopied ? "Copied!" : "Copy Link"
                                    ]
                                })
                            ]
                        }),
                        waitingForOpponent && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-2 mt-2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                            type: "checkbox",
                                            id: "password-protection",
                                            checked: passwordProtected,
                                            onChange: handlePasswordProtection,
                                            className: "h-4 w-4"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                            htmlFor: "password-protection",
                                            className: "text-sm",
                                            children: "Password protect this game"
                                        })
                                    ]
                                }),
                                passwordProtected && gamePassword && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "text-sm",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "text-gray-500 mr-1",
                                            children: "Password:"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "font-mono font-medium",
                                            children: gamePassword
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex justify-between items-center",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "player-info",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                            className: "player-avatar",
                                            style: {
                                                backgroundColor: playerColor === 'white' ? '#f0d9b5' : '#b58863',
                                                color: playerColor === 'white' ? '#000' : '#fff'
                                            },
                                            children: playerName.charAt(0).toUpperCase()
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                    className: "player-name",
                                                    children: playerName || 'You'
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                    className: "text-xs",
                                                    children: playerColor
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                            className: "player-time",
                                            children: formatTime(timeControl[playerColor])
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: "mx-3",
                                    children: isYourTurn ? /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                        className: "px-2 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full",
                                        children: "Your turn"
                                    }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                        className: "px-2 py-1 text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded-full",
                                        children: "Waiting"
                                    })
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "player-info",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                            className: "player-avatar",
                                            style: {
                                                backgroundColor: playerColor === 'black' ? '#f0d9b5' : '#b58863',
                                                color: playerColor === 'black' ? '#000' : '#fff'
                                            },
                                            children: opponentName ? opponentName.charAt(0).toUpperCase() : '?'
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                    className: "player-name",
                                                    children: opponentName || 'Opponent'
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                    className: "text-xs",
                                                    children: playerColor === 'white' ? 'black' : 'white'
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                            className: "player-time",
                                            children: formatTime(timeControl[playerColor === 'white' ? 'black' : 'white'])
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "w-full max-w-5xl flex flex-col md:flex-row gap-6 items-start",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "w-full md:w-auto",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "game-room-container p-4 shadow-md ".concat(isInCheck ? 'border-red-500 border-2' : ''),
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: "chess-board ".concat(darkMode ? 'chess-board-dark' : ''),
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* Chessboard */.Ve, {
                                        id: "Chessboard",
                                        position: fen,
                                        onPieceDrop: onDrop,
                                        onSquareClick: onSquareClick,
                                        boardWidth: boardWidth,
                                        customBoardStyle: {
                                            borderRadius: '4px',
                                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
                                        },
                                        customSquareStyles: {
                                            ...highlightedSquares,
                                            ...lastMove && {
                                                [lastMove.from]: {
                                                    backgroundColor: 'rgba(255, 255, 0, 0.4)'
                                                },
                                                [lastMove.to]: {
                                                    backgroundColor: 'rgba(255, 255, 0, 0.4)'
                                                }
                                            },
                                            ...preMove && {
                                                [preMove.from]: {
                                                    backgroundColor: 'rgba(0, 0, 255, 0.3)'
                                                },
                                                [preMove.to]: {
                                                    backgroundColor: 'rgba(0, 0, 255, 0.3)'
                                                } // Blueish for pre-move target
                                            },
                                            ...isCheck && whiteKingSq && game.isAttacked(whiteKingSq, 'b') && ((_game_get = game.get(whiteKingSq)) === null || _game_get === void 0 ? void 0 : _game_get.color) === 'w' && {
                                                [whiteKingSq]: {
                                                    backgroundColor: 'rgba(255, 0, 0, 0.5)'
                                                } // Red for white king in check
                                            },
                                            ...isCheck && blackKingSq && game.isAttacked(blackKingSq, 'w') && ((_game_get1 = game.get(blackKingSq)) === null || _game_get1 === void 0 ? void 0 : _game_get1.color) === 'b' && {
                                                [blackKingSq]: {
                                                    backgroundColor: 'rgba(255, 0, 0, 0.5)'
                                                } // Red for black king in check
                                            }
                                        },
                                        customDarkSquareStyle: {
                                            backgroundColor: currentStyles.dark
                                        },
                                        customLightSquareStyle: {
                                            backgroundColor: currentStyles.light
                                        },
                                        customPieces: customPieceStyle !== 'default' ? pieceComponents[customPieceStyle] : undefined,
                                        boardOrientation: boardOrientation,
                                        arePremovesAllowed: true,
                                        animationDuration: activeAnimation ? 300 : 200
                                    })
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "chess-controls mt-4",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                            onClick: undoLastMove,
                                            disabled: currentPosition <= 0 || gameMode === "online",
                                            className: "control-button",
                                            title: gameMode === "online" ? "Undo unavailable in online games" : "Undo move",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_arrow_left/* default */.A, {
                                                size: 20
                                            })
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                            onClick: resetGame,
                                            disabled: gameMode === "online" && opponentConnected,
                                            className: "control-button",
                                            title: gameMode === "online" && opponentConnected ? "Cannot reset during online game" : "Reset game",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_ccw/* default */.A, {
                                                size: 20
                                            })
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                            onClick: flipBoard,
                                            disabled: gameMode === "online",
                                            className: "control-button",
                                            title: gameMode === "online" ? "Rotate unavailable in online games" : "Rotate board",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(rotate_ccw/* default */.A, {
                                                size: 20
                                            })
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                            onClick: redoMove,
                                            disabled: currentPosition >= moveHistory.length - 1 || gameMode === "online",
                                            className: "control-button",
                                            title: gameMode === "online" ? "Redo unavailable in online games" : "Redo move",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_arrow_right/* default */.A, {
                                                size: 20
                                            })
                                        }),
                                        gameMode === "online" && /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                            onClick: ()=>setShowChat(!showChat),
                                            className: "control-button ".concat(showChat ? 'bg-blue-600 text-white' : ''),
                                            title: "Toggle chat",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(message_square/* default */.A, {
                                                size: 20
                                            })
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                            onClick: ()=>setShowMoveList(!showMoveList),
                                            className: "control-button ".concat(showMoveList ? 'bg-blue-600 text-white' : ''),
                                            title: "Move history",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(icons_history/* default */.A, {
                                                size: 20
                                            })
                                        })
                                    ]
                                }),
                                showMoveList && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: "move-list mt-4",
                                    children: moveHistory.length <= 1 ? /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "text-center text-gray-500 py-2",
                                        children: "No moves yet"
                                    }) : Array.from({
                                        length: Math.ceil((moveHistory.length - 1) / 2)
                                    }).map((_, i)=>{
                                        const moveIndex = i + 1;
                                        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                            className: "move-item ".concat(currentPosition === moveIndex * 2 - 1 || currentPosition === moveIndex * 2 ? 'current-move' : ''),
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    className: "move-number",
                                                    children: [
                                                        moveIndex,
                                                        "."
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    className: "move-text",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                            className: "move-text-white",
                                                            children: moveIndex * 2 - 1 < moveHistory.length ? /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                                                onClick: ()=>setCurrentPosition(moveIndex * 2 - 1),
                                                                className: "hover:text-blue-600",
                                                                children: getMoveNotation(moveIndex * 2 - 1)
                                                            }) : null
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                            className: "move-text-black",
                                                            children: moveIndex * 2 < moveHistory.length ? /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                                                onClick: ()=>setCurrentPosition(moveIndex * 2),
                                                                className: "hover:text-blue-600",
                                                                children: getMoveNotation(moveIndex * 2)
                                                            }) : null
                                                        })
                                                    ]
                                                })
                                            ]
                                        }, moveIndex);
                                    })
                                }),
                                isGameOverState && gameOverMessage && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "game-result bg-blue-100 dark:bg-blue-900 text-center",
                                    children: [
                                        " ",
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                            className: "font-bold text-lg mb-2",
                                            children: [
                                                " ",
                                                gameOverMessage
                                            ]
                                        }),
                                        gameResult && showScores && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                            className: "mt-4 p-3 bg-white dark:bg-gray-800 rounded-md",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                    className: "font-bold text-center mb-2",
                                                    children: "Player Scores"
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    className: "flex justify-between items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                            className: "text-center",
                                                            children: [
                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                    className: "font-medium",
                                                                    children: playerColor === 'white' ? 'White' : 'Black'
                                                                }),
                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                    className: "text-2xl font-bold text-blue-600 dark:text-blue-400",
                                                                    children: playerScore
                                                                }),
                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                    className: "text-xs text-gray-500",
                                                                    children: "points"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                            className: "text-xl font-bold text-gray-400",
                                                            children: "vs"
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                            className: "text-center",
                                                            children: [
                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                    className: "font-medium",
                                                                    children: playerColor === 'white' ? 'Black' : 'White'
                                                                }),
                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                    className: "text-2xl font-bold text-red-600 dark:text-red-400",
                                                                    children: opponentScore
                                                                }),
                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                    className: "text-xs text-gray-500",
                                                                    children: "points"
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                    className: "mt-3 text-sm text-center text-gray-600 dark:text-gray-400",
                                                    children: "Score based on material, position, time management, and tactical play"
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                            className: "mt-3",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                                onClick: resetGame,
                                                disabled: gameMode === "online" && opponentConnected && !gameResult,
                                                className: "chess-button chess-button-primary mx-auto",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_ccw/* default */.A, {
                                                        size: 16,
                                                        className: "mr-1"
                                                    }),
                                                    "Play Again"
                                                ]
                                            })
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "w-full md:w-72 flex flex-col",
                        children: [
                            gameMode === "online" && showChat && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "game-room-container p-4 shadow-md flex flex-col h-96",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("h3", {
                                        className: "font-bold mb-2 flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(message_square/* default */.A, {
                                                size: 16,
                                                className: "mr-1"
                                            }),
                                            "Chat"
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        ref: messageContainerRef,
                                        className: "flex-1 overflow-y-auto mb-3 text-sm space-y-2 chat-container",
                                        children: chatMessages.length === 0 ? /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                            className: "text-gray-500 italic p-4 text-center",
                                            children: "No messages yet."
                                        }) : chatMessages.map((msg, idx)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "chat-message p-2 rounded-lg mb-1 ".concat(msg.system ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-center italic' : msg.role === playerColor ? 'bg-blue-100 dark:bg-blue-900 ml-4 text-blue-800 dark:text-blue-200' : 'bg-gray-200 dark:bg-gray-700 mr-4'),
                                                children: [
                                                    !msg.system && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "font-medium text-xs opacity-75 mb-1",
                                                        children: [
                                                            msg.sender,
                                                            " • ",
                                                            new Date(msg.timestamp).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        children: msg.message
                                                    })
                                                ]
                                            }, idx))
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("form", {
                                        onSubmit: sendChatMessage,
                                        className: "flex gap-1",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                                className: "flex-1 p-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700",
                                                placeholder: "Type a message",
                                                value: newMessage,
                                                onChange: (e)=>setNewMessage(e.target.value)
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                                type: "submit",
                                                disabled: !newMessage.trim(),
                                                className: "p-2 rounded-md ".concat(newMessage.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'),
                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(send/* default */.A, {
                                                    size: 18
                                                })
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "game-room-container p-4 shadow-md mt-6",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                        onClick: ()=>setShowInfo(!showInfo),
                                        className: "flex items-center gap-2 text-blue-600 dark:text-blue-400 w-full justify-between",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "flex items-center",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(info/* default */.A, {
                                                        size: 18,
                                                        className: "mr-1"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        children: "Game Information"
                                                    })
                                                ]
                                            }),
                                            showInfo ? /*#__PURE__*/ (0,jsx_runtime.jsx)(chevron_up/* default */.A, {
                                                size: 18
                                            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(chevron_down/* default */.A, {
                                                size: 18
                                            })
                                        ]
                                    }),
                                    showInfo && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "mt-3 space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                                        className: "text-lg font-semibold mb-2",
                                                        children: "How to Play"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("ul", {
                                                        className: "list-disc list-inside space-y-1 text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                                                                children: "Drag and drop pieces to make a move"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                                                                children: "Use the controls to navigate moves or reset"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("li", {
                                                                className: gameMode === "online" ? "text-gray-400" : "",
                                                                children: [
                                                                    "Undo/redo moves ",
                                                                    gameMode === "online" ? "(local mode only)" : ""
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            gameMode === "online" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                                        className: "text-lg font-semibold mb-2",
                                                        children: "Online Play"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("ul", {
                                                        className: "list-disc list-inside space-y-1 text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                                                                children: "Share the game link with your opponent"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                                                                children: "Use chat to communicate during the game"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                                                                children: "Chess clock tracks each player's time"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                                        className: "text-lg font-semibold mb-2",
                                                        children: "Keyboard Shortcuts"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "grid grid-cols-2 gap-2 text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                children: "Arrow Left:"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                children: "Previous move"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                children: "Arrow Right:"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                children: "Next move"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                children: "R:"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                children: "Reset game"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                children: "F:"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                children: "Flip board"
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
                    })
                ]
            }),
            showPasswordModal && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "game-room-container p-6 shadow-lg max-w-md w-full",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                            className: "text-xl font-bold mb-4",
                            children: "Password Required"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                            className: "mb-4",
                            children: "This game is password protected. Please enter the password to join."
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("form", {
                            onSubmit: verifyPassword,
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "mb-4",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                            className: "block text-sm font-medium mb-2",
                                            children: "Game Password:"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                            className: "w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700",
                                            type: "password",
                                            placeholder: "Enter password",
                                            value: passwordInput,
                                            onChange: (e)=>setPasswordInput(e.target.value),
                                            required: true
                                        }),
                                        passwordError && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                            className: "text-red-500 text-sm mt-1",
                                            children: passwordError
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "flex justify-end gap-2 mt-6",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                setShowPasswordModal(false);
                                                exitOnlineGame();
                                            },
                                            className: "chess-button chess-button-secondary",
                                            children: "Cancel"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                            type: "submit",
                                            className: "chess-button chess-button-primary",
                                            children: "Submit"
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            }),
            showSavedGamesModal && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "game-room-container p-6 shadow-lg max-w-md w-full",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                            className: "text-xl font-bold mb-4",
                            children: "Saved Games"
                        }),
                        savedSessions.length === 0 ? /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                            className: "text-center py-4 text-gray-500",
                            children: "No saved games found"
                        }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "max-h-96 overflow-y-auto",
                            children: savedSessions.map((session, index)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: "border border-gray-200 dark:border-gray-700 rounded-md p-3 mb-2 hover:bg-gray-50 dark:hover:bg-gray-800",
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "flex justify-between items-center",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "font-medium",
                                                        children: session.playerName || 'Anonymous'
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "text-sm text-gray-500",
                                                        children: [
                                                            "Room: ",
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "font-mono",
                                                                children: session.roomId
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "text-xs text-gray-500",
                                                        children: new Date(session.timestamp).toLocaleString()
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "flex flex-col gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "text-sm font-medium",
                                                        children: session.playerColor
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                                        onClick: ()=>resumeGame(session),
                                                        className: "chess-button chess-button-primary !py-1 !px-2 text-sm",
                                                        children: "Resume"
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                }, index))
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "flex justify-end gap-2 mt-6",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                type: "button",
                                onClick: ()=>setShowSavedGamesModal(false),
                                className: "chess-button chess-button-secondary",
                                children: "Close"
                            })
                        })
                    ]
                })
            })
        ]
    });
}


/***/ }),

/***/ 95784:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TR: () => (/* binding */ SelectLabel),
/* harmony export */   bq: () => (/* binding */ SelectTrigger),
/* harmony export */   eb: () => (/* binding */ SelectItem),
/* harmony export */   gC: () => (/* binding */ SelectContent),
/* harmony export */   l6: () => (/* binding */ Select),
/* harmony export */   s3: () => (/* binding */ SelectGroup),
/* harmony export */   yv: () => (/* binding */ SelectValue)
/* harmony export */ });
/* unused harmony exports SelectScrollDownButton, SelectScrollUpButton, SelectSeparator */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(95155);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12115);
/* harmony import */ var _radix_ui_react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(96834);
/* harmony import */ var _barrel_optimize_names_CheckIcon_ChevronDownIcon_ChevronUpIcon_lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(66474);
/* harmony import */ var _barrel_optimize_names_CheckIcon_ChevronDownIcon_ChevronUpIcon_lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5196);
/* harmony import */ var _barrel_optimize_names_CheckIcon_ChevronDownIcon_ChevronUpIcon_lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(47863);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(19433);
/* __next_internal_client_entry_do_not_use__ Select,SelectContent,SelectGroup,SelectItem,SelectLabel,SelectScrollDownButton,SelectScrollUpButton,SelectSeparator,SelectTrigger,SelectValue auto */ 




function Select(param) {
    let { ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_select__WEBPACK_IMPORTED_MODULE_2__/* .Root */ .bL, {
        "data-slot": "select",
        ...props
    });
}
function SelectGroup(param) {
    let { ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_select__WEBPACK_IMPORTED_MODULE_2__/* .Group */ .YJ, {
        "data-slot": "select-group",
        ...props
    });
}
function SelectValue(param) {
    let { ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_select__WEBPACK_IMPORTED_MODULE_2__/* .Value */ .WT, {
        "data-slot": "select-value",
        ...props
    });
}
function SelectTrigger(param) {
    let { className, size = "default", children, ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_select__WEBPACK_IMPORTED_MODULE_2__/* .Trigger */ .l9, {
        "data-slot": "select-trigger",
        "data-size": size,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("border-input bg-background text-foreground data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_select__WEBPACK_IMPORTED_MODULE_2__/* .Icon */ .In, {
                asChild: true,
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_barrel_optimize_names_CheckIcon_ChevronDownIcon_ChevronUpIcon_lucide_react__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A, {
                    className: "size-4 opacity-50"
                })
            })
        ]
    });
}
function SelectContent(param) {
    let { className, children, position = "popper", ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_select__WEBPACK_IMPORTED_MODULE_2__/* .Portal */ .ZL, {
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_select__WEBPACK_IMPORTED_MODULE_2__/* .Content */ .UC, {
            "data-slot": "select-content",
            className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("bg-popover text-popover-foreground dark:bg-popover dark:text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-[var(--radix-select-content-available-height)] min-w-[8rem] origin-[var(--radix-select-content-transform-origin)] overflow-x-hidden overflow-y-auto rounded-md border shadow-md", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
            position: position,
            ...props,
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SelectScrollUpButton, {}),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_select__WEBPACK_IMPORTED_MODULE_2__/* .Viewport */ .LM, {
                    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("p-1 bg-popover", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"),
                    children: children
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SelectScrollDownButton, {})
            ]
        })
    });
}
function SelectLabel(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_select__WEBPACK_IMPORTED_MODULE_2__/* .Label */ .JU, {
        "data-slot": "select-label",
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("text-muted-foreground px-2 py-1.5 text-xs", className),
        ...props
    });
}
function SelectItem(param) {
    let { className, children, ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_select__WEBPACK_IMPORTED_MODULE_2__/* .Item */ .q7, {
        "data-slot": "select-item",
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className),
        ...props,
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                className: "absolute right-2 flex size-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_select__WEBPACK_IMPORTED_MODULE_2__/* .ItemIndicator */ .VF, {
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_barrel_optimize_names_CheckIcon_ChevronDownIcon_ChevronUpIcon_lucide_react__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A, {
                        className: "size-4"
                    })
                })
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_select__WEBPACK_IMPORTED_MODULE_2__/* .ItemText */ .p4, {
                children: children
            })
        ]
    });
}
function SelectSeparator(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ _jsx(SelectPrimitive.Separator, {
        "data-slot": "select-separator",
        className: cn("bg-border pointer-events-none -mx-1 my-1 h-px", className),
        ...props
    });
}
function SelectScrollUpButton(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_select__WEBPACK_IMPORTED_MODULE_2__/* .ScrollUpButton */ .PP, {
        "data-slot": "select-scroll-up-button",
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_barrel_optimize_names_CheckIcon_ChevronDownIcon_ChevronUpIcon_lucide_react__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A, {
            className: "size-4"
        })
    });
}
function SelectScrollDownButton(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_radix_ui_react_select__WEBPACK_IMPORTED_MODULE_2__/* .ScrollDownButton */ .wn, {
        "data-slot": "select-scroll-down-button",
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_barrel_optimize_names_CheckIcon_ChevronDownIcon_ChevronUpIcon_lucide_react__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A, {
            className: "size-4"
        })
    });
}



/***/ }),

/***/ 97168:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ Button)
/* harmony export */ });
/* unused harmony export buttonVariants */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(95155);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12115);
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(99708);
/* harmony import */ var class_variance_authority__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(74466);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(19433);





const buttonVariants = (0,class_variance_authority__WEBPACK_IMPORTED_MODULE_2__/* .cva */ .F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
            destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button(param) {
    let { className, variant, size, asChild = false, ...props } = param;
    const Comp = asChild ? _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__/* .Slot */ .DX : "button";
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Comp, {
        "data-slot": "button",
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_4__.cn)(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    });
}



/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, [672,874,74,138,794,954,315,358], () => (__webpack_exec__(70490)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);