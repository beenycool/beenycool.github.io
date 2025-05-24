(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[302],{

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

/***/ 28905:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ Presence)
/* harmony export */ });
/* unused harmony export Root */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12115);
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6101);
/* harmony import */ var _radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(52712);
/* __next_internal_client_entry_do_not_use__ Presence,Root auto */ // src/presence.tsx



// src/use-state-machine.tsx

function useStateMachine(initialState, machine) {
    return react__WEBPACK_IMPORTED_MODULE_0__.useReducer((state, event)=>{
        const nextState = machine[state][event];
        return nextState !== null && nextState !== void 0 ? nextState : state;
    }, initialState);
}
// src/presence.tsx
var Presence = (props)=>{
    const { present, children } = props;
    const presence = usePresence(present);
    const child = typeof children === "function" ? children({
        present: presence.isPresent
    }) : react__WEBPACK_IMPORTED_MODULE_0__.Children.only(children);
    const ref = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_1__/* .useComposedRefs */ .s)(presence.ref, getElementRef(child));
    const forceMount = typeof children === "function";
    return forceMount || presence.isPresent ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(child, {
        ref
    }) : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
    const [node, setNode] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
    const stylesRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
    const prevPresentRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(present);
    const prevAnimationNameRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef("none");
    const initialState = present ? "mounted" : "unmounted";
    const [state, send] = useStateMachine(initialState, {
        mounted: {
            UNMOUNT: "unmounted",
            ANIMATION_OUT: "unmountSuspended"
        },
        unmountSuspended: {
            MOUNT: "mounted",
            ANIMATION_END: "unmounted"
        },
        unmounted: {
            MOUNT: "mounted"
        }
    });
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>{
        const currentAnimationName = getAnimationName(stylesRef.current);
        prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
    }, [
        state
    ]);
    (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_2__/* .useLayoutEffect */ .N)(()=>{
        const styles = stylesRef.current;
        const wasPresent = prevPresentRef.current;
        const hasPresentChanged = wasPresent !== present;
        if (hasPresentChanged) {
            const prevAnimationName = prevAnimationNameRef.current;
            const currentAnimationName = getAnimationName(styles);
            if (present) {
                send("MOUNT");
            } else if (currentAnimationName === "none" || (styles === null || styles === void 0 ? void 0 : styles.display) === "none") {
                send("UNMOUNT");
            } else {
                const isAnimating = prevAnimationName !== currentAnimationName;
                if (wasPresent && isAnimating) {
                    send("ANIMATION_OUT");
                } else {
                    send("UNMOUNT");
                }
            }
            prevPresentRef.current = present;
        }
    }, [
        present,
        send
    ]);
    (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_2__/* .useLayoutEffect */ .N)(()=>{
        if (node) {
            let timeoutId;
            var _node_ownerDocument_defaultView;
            const ownerWindow = (_node_ownerDocument_defaultView = node.ownerDocument.defaultView) !== null && _node_ownerDocument_defaultView !== void 0 ? _node_ownerDocument_defaultView : window;
            const handleAnimationEnd = (event)=>{
                const currentAnimationName = getAnimationName(stylesRef.current);
                const isCurrentAnimation = currentAnimationName.includes(event.animationName);
                if (event.target === node && isCurrentAnimation) {
                    send("ANIMATION_END");
                    if (!prevPresentRef.current) {
                        const currentFillMode = node.style.animationFillMode;
                        node.style.animationFillMode = "forwards";
                        timeoutId = ownerWindow.setTimeout(()=>{
                            if (node.style.animationFillMode === "forwards") {
                                node.style.animationFillMode = currentFillMode;
                            }
                        });
                    }
                }
            };
            const handleAnimationStart = (event)=>{
                if (event.target === node) {
                    prevAnimationNameRef.current = getAnimationName(stylesRef.current);
                }
            };
            node.addEventListener("animationstart", handleAnimationStart);
            node.addEventListener("animationcancel", handleAnimationEnd);
            node.addEventListener("animationend", handleAnimationEnd);
            return ()=>{
                ownerWindow.clearTimeout(timeoutId);
                node.removeEventListener("animationstart", handleAnimationStart);
                node.removeEventListener("animationcancel", handleAnimationEnd);
                node.removeEventListener("animationend", handleAnimationEnd);
            };
        } else {
            send("ANIMATION_END");
        }
    }, [
        node,
        send
    ]);
    return {
        isPresent: [
            "mounted",
            "unmountSuspended"
        ].includes(state),
        ref: react__WEBPACK_IMPORTED_MODULE_0__.useCallback((node2)=>{
            stylesRef.current = node2 ? getComputedStyle(node2) : null;
            setNode(node2);
        }, [])
    };
}
function getAnimationName(styles) {
    return (styles === null || styles === void 0 ? void 0 : styles.animationName) || "none";
}
function getElementRef(element) {
    var _Object_getOwnPropertyDescriptor, _Object_getOwnPropertyDescriptor1;
    let getter = (_Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor(element.props, "ref")) === null || _Object_getOwnPropertyDescriptor === void 0 ? void 0 : _Object_getOwnPropertyDescriptor.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
        return element.ref;
    }
    getter = (_Object_getOwnPropertyDescriptor1 = Object.getOwnPropertyDescriptor(element, "ref")) === null || _Object_getOwnPropertyDescriptor1 === void 0 ? void 0 : _Object_getOwnPropertyDescriptor1.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
        return element.props.ref;
    }
    return element.props.ref || element.ref;
}
var Root = (/* unused pure expression or super */ null && (Presence));
 //# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 34964:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ 43453:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ CircleCheck)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(90163);
/**
 * @license lucide-react v0.357.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ 
const CircleCheck = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("CircleCheck", [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ],
    [
        "path",
        {
            d: "m9 12 2 2 4-4",
            key: "dzmm74"
        }
    ]
]);
 //# sourceMappingURL=circle-check.js.map


/***/ }),

/***/ 57821:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DebugPage)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(95155);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12115);
/* harmony import */ var _components_ui_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(97168);
/* harmony import */ var _components_ui_card__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(88482);
/* harmony import */ var _components_ui_badge__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(88145);
/* harmony import */ var _components_ui_tabs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(34964);
/* harmony import */ var _barrel_optimize_names_AlertTriangle_CheckCircle2_Loader2_RefreshCw_lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(51154);
/* harmony import */ var _barrel_optimize_names_AlertTriangle_CheckCircle2_Loader2_RefreshCw_lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(53904);
/* harmony import */ var _barrel_optimize_names_AlertTriangle_CheckCircle2_Loader2_RefreshCw_lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(43453);
/* harmony import */ var _barrel_optimize_names_AlertTriangle_CheckCircle2_Loader2_RefreshCw_lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(1243);
/* harmony import */ var sonner__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(56671);
/* harmony import */ var _aimarker_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(86653);
/* __next_internal_client_entry_do_not_use__ default auto */ 









// API URL for backend
const API_BASE_URL = "https://beenycool-github-io.onrender.com" || (0); // Production fallback
// Debug Page Component
function DebugPage() {
    const [backendStatus, setBackendStatus] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('checking');
    const [lastChecked, setLastChecked] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [activeTab, setActiveTab] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("api-status");
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { checkBackendStatus } = (0,_aimarker_hooks__WEBPACK_IMPORTED_MODULE_7__/* .useBackendStatus */ .Q)(API_BASE_URL);
    // Check API status function
    const checkAPIStatus = async ()=>{
        console.log("=== API STATUS CHECK STARTED ===");
        console.log("Backend URL:", API_BASE_URL);
        setIsLoading(true);
        try {
            // First check if the API is responsive
            const backendResult = await checkBackendStatus();
            if (backendResult) {
                setBackendStatus(backendResult.ok ? 'online' : backendResult.status || 'error');
            } else {
                setBackendStatus('error');
            }
            setLastChecked(new Date().toLocaleTimeString());
            if (!backendResult || !backendResult.ok) {
                throw new Error("Backend connection error: ".concat((backendResult === null || backendResult === void 0 ? void 0 : backendResult.error) || 'Unknown error'));
            }
            // Check API health
            sonner__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.info("Checking API health...");
            const healthResponse = await fetch("".concat(API_BASE_URL, "/api/health"), {
                method: 'GET',
                mode: 'cors'
            }).catch((error)=>{
                console.error("Health check failed:", error);
                throw new Error("Health check failed: ".concat(error instanceof Error ? error.message : 'Unknown error'));
            });
            console.log("Health response status:", healthResponse.status, healthResponse.statusText);
            if (!healthResponse.ok) {
                throw new Error("API health check failed with status ".concat(healthResponse.status));
            }
            const healthData = await healthResponse.json().catch(()=>({}));
            console.log("Health data:", healthData);
            // Check available models
            sonner__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.info("Checking available models...");
            const modelsResponse = await fetch("".concat(API_BASE_URL, "/api/models"), {
                method: 'GET',
                mode: 'cors'
            }).catch((error)=>{
                console.error("Models check failed:", error);
                throw new Error("Models check failed: ".concat(error instanceof Error ? error.message : 'Unknown error'));
            });
            console.log("Models response status:", modelsResponse.status, modelsResponse.statusText);
            if (!modelsResponse.ok) {
                throw new Error("API models check failed with status ".concat(modelsResponse.status));
            }
            const modelsData = await modelsResponse.json().catch(()=>({}));
            console.log("Available models:", modelsData);
            // Display API status info in a toast
            let statusInfo = "✅ API is online\n\uD83D\uDD0C Connection: ".concat(healthData.status || "Unknown", "\n\uD83D\uDD04 Version: ").concat(healthData.version || "Unknown");
            if (modelsData && modelsData.data) {
                statusInfo += "\n\uD83E\uDD16 Models: ".concat(modelsData.data.length || 0, " available");
            }
            sonner__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.success(statusInfo, {
                duration: 5000
            });
        } catch (error) {
            console.error("API status check error:", error);
            setBackendStatus('error');
            sonner__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.error("API Status Check Failed: ".concat(error instanceof Error ? error.message : 'Unknown error'));
        } finally{
            console.log("=== API STATUS CHECK COMPLETED ===");
            setIsLoading(false);
        }
    };
    // Test mark scheme generation function
    const testMarkSchemeGeneration = async ()=>{
        setIsLoading(true);
        const question = "Explain how the writer uses language features to create an atmosphere of tension in this extract.";
        const subject = "english";
        const examBoard = "aqa";
        console.log("=== TEST MARK SCHEME GENERATION STARTED ===");
        console.log("Question:", question);
        console.log("Subject:", subject);
        console.log("Exam board:", examBoard);
        console.log("Backend URL:", API_BASE_URL);
        sonner__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.info("Testing mark scheme generation...");
        // Create a simplified test prompt
        const testPrompt = "Create a mark scheme for this GCSE ".concat(subject, ' question: "').concat(question, '"');
        console.log("Using simplified test prompt:", testPrompt);
        try {
            // First check if the API is responsive
            const healthCheck = await fetch("".concat(API_BASE_URL, "/api/health"));
            console.log("API health check response:", healthCheck.status, await healthCheck.text());
            if (healthCheck.status !== 200) {
                throw new Error("API health check failed with status ".concat(healthCheck.status));
            }
            console.log("Health check successful, proceeding with mark scheme test");
            // Make a direct request to the backend
            const response = await fetch("".concat(API_BASE_URL, "/api/chat/completions"), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "gemini-2.5-flash-preview-05-20",
                    messages: [
                        {
                            role: "user",
                            content: testPrompt
                        }
                    ],
                    max_tokens: 1500
                })
            });
            // Log the raw response for debugging
            const responseText = await response.clone().text();
            console.log("Test response status:", response.status);
            console.log("Test response raw:", responseText);
            if (!response.ok) {
                let errorMessage = "Unknown error";
                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = JSON.stringify(errorData);
                    console.error("Test response error:", errorMessage);
                } catch (parseError) {
                    if (parseError instanceof Error) {
                        console.error("Parse error:", parseError.message);
                    }
                    errorMessage = responseText || response.statusText;
                    console.error("Test response error (text):", errorMessage);
                }
                throw new Error("API request failed: ".concat(response.status, ". ").concat(errorMessage));
            }
            // Try to parse the response as JSON, with fallback handling
            let testData;
            try {
                testData = JSON.parse(responseText);
                console.log("Test response parsed successfully:", testData);
            } catch (parseError) {
                if (parseError instanceof Error) {
                    console.error("Failed to parse response as JSON:", parseError.message);
                    throw new Error("Failed to parse API response as JSON: ".concat(parseError.message));
                }
                throw new Error("Failed to parse API response as JSON");
            }
            // Extract content from various possible response formats
            let markSchemeContent = "";
            if (testData.content) {
                markSchemeContent = testData.content;
            } else if (testData.choices && testData.choices[0] && testData.choices[0].message) {
                markSchemeContent = testData.choices[0].message.content;
            } else if (testData.text || testData.answer || testData.response) {
                markSchemeContent = testData.text || testData.answer || testData.response;
            } else if (typeof testData === "string") {
                markSchemeContent = testData;
            } else {
                console.log("Unknown response format:", testData);
                markSchemeContent = "Failed to extract proper content. Raw response: " + JSON.stringify(testData);
            }
            sonner__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.success("Mark scheme generated successfully!");
            console.log("Extracted mark scheme content (first 100 chars):", markSchemeContent.substring(0, 100) + "...");
        } catch (error) {
            console.error("Test mark scheme generation error:", error);
            sonner__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.error("Test mark scheme generation failed: ".concat(error instanceof Error ? error.message : 'Unknown error'));
        } finally{
            console.log("=== TEST MARK SCHEME GENERATION COMPLETED ===");
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "container mx-auto px-4 py-8 max-w-4xl",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_ui_card__WEBPACK_IMPORTED_MODULE_3__/* .Card */ .Zp, {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_ui_card__WEBPACK_IMPORTED_MODULE_3__/* .CardHeader */ .aR, {
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_ui_card__WEBPACK_IMPORTED_MODULE_3__/* .CardTitle */ .ZB, {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                    children: "Debug Console"
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_ui_badge__WEBPACK_IMPORTED_MODULE_4__/* .Badge */ .E, {
                                    variant: backendStatus === 'online' ? 'default' : 'destructive',
                                    className: backendStatus === 'online' ? 'bg-green-500' : '',
                                    children: backendStatus
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_ui_card__WEBPACK_IMPORTED_MODULE_3__/* .CardContent */ .Wu, {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                className: "text-sm text-muted-foreground mb-4",
                                children: "This page contains debugging tools for the AI GCSE Marker application. Use these tools to verify backend connectivity and API functionality."
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: "flex justify-between items-center mb-6",
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: "text-sm",
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                                className: "font-medium",
                                                children: "Backend URL:"
                                            }),
                                            " ",
                                            API_BASE_URL,
                                            lastChecked && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                className: "ml-2 text-xs text-muted-foreground",
                                                children: [
                                                    "Last checked: ",
                                                    lastChecked
                                                ]
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_ui_button__WEBPACK_IMPORTED_MODULE_2__/* .Button */ .$, {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: checkAPIStatus,
                                        disabled: isLoading,
                                        children: [
                                            isLoading ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_barrel_optimize_names_AlertTriangle_CheckCircle2_Loader2_RefreshCw_lucide_react__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A, {
                                                className: "mr-2 h-4 w-4 animate-spin"
                                            }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_barrel_optimize_names_AlertTriangle_CheckCircle2_Loader2_RefreshCw_lucide_react__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A, {
                                                className: "mr-2 h-4 w-4"
                                            }),
                                            "Check Status"
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_5__/* .Tabs */ .tU, {
                                value: activeTab,
                                onValueChange: setActiveTab,
                                className: "w-full",
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_5__/* .TabsList */ .j7, {
                                        className: "grid w-full grid-cols-2",
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_5__/* .TabsTrigger */ .Xi, {
                                                value: "api-status",
                                                children: "API Status"
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_5__/* .TabsTrigger */ .Xi, {
                                                value: "mark-scheme-test",
                                                children: "Mark Scheme Test"
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_5__/* .TabsContent */ .av, {
                                        value: "api-status",
                                        className: "p-4 border rounded-md mt-4",
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                    className: "flex items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                                            className: "h-3 w-3 rounded-full mr-2 ".concat(backendStatus === 'online' ? 'bg-green-500' : backendStatus === 'checking' ? 'bg-yellow-500' : 'bg-red-500')
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                            className: "font-medium",
                                                            children: [
                                                                "Backend Status: ",
                                                                backendStatus.charAt(0).toUpperCase() + backendStatus.slice(1)
                                                            ]
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                    className: "p-3 bg-muted rounded-md",
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
                                                            className: "font-medium mb-2",
                                                            children: "Connection Information"
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("pre", {
                                                            className: "text-xs bg-card p-2 rounded overflow-auto",
                                                            children: JSON.stringify({
                                                                url: API_BASE_URL,
                                                                status: backendStatus,
                                                                lastChecked: lastChecked,
                                                                environment:  true ? window.location.hostname : 0
                                                            }, null, 2)
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                                    className: "flex items-center",
                                                    children: backendStatus === 'online' ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: "flex items-center text-green-600 dark:text-green-400",
                                                        children: [
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_barrel_optimize_names_AlertTriangle_CheckCircle2_Loader2_RefreshCw_lucide_react__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .A, {
                                                                className: "mr-2 h-5 w-5"
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                                                children: "Backend is online and ready to use"
                                                            })
                                                        ]
                                                    }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: "flex items-center text-amber-600 dark:text-amber-400",
                                                        children: [
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_barrel_optimize_names_AlertTriangle_CheckCircle2_Loader2_RefreshCw_lucide_react__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A, {
                                                                className: "mr-2 h-5 w-5"
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                                                children: backendStatus === 'checking' ? 'Checking backend status...' : 'Backend is offline or experiencing issues'
                                                            })
                                                        ]
                                                    })
                                                })
                                            ]
                                        })
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_5__/* .TabsContent */ .av, {
                                        value: "mark-scheme-test",
                                        className: "p-4 border rounded-md mt-4",
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                                    className: "text-sm",
                                                    children: "Test the mark scheme generation functionality by clicking the button below. This will send a sample question to the API and verify the response."
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                    className: "p-3 bg-muted rounded-md",
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
                                                            className: "font-medium mb-2",
                                                            children: "Test Parameters"
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("pre", {
                                                            className: "text-xs bg-card p-2 rounded overflow-auto",
                                                            children: JSON.stringify({
                                                                question: "Explain how the writer uses language features to create an atmosphere of tension in this extract.",
                                                                subject: "english",
                                                                examBoard: "aqa",
                                                                model: "gemini-2.5-flash-preview-05-20"
                                                            }, null, 2)
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_ui_button__WEBPACK_IMPORTED_MODULE_2__/* .Button */ .$, {
                                                    onClick: testMarkSchemeGeneration,
                                                    disabled: isLoading || backendStatus !== 'online',
                                                    className: "w-full",
                                                    children: isLoading ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                                                        children: [
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_barrel_optimize_names_AlertTriangle_CheckCircle2_Loader2_RefreshCw_lucide_react__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A, {
                                                                className: "mr-2 h-4 w-4 animate-spin"
                                                            }),
                                                            "Testing..."
                                                        ]
                                                    }) : "Test Mark Scheme Generation"
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                                    className: "text-xs text-muted-foreground",
                                                    children: "Results will be displayed in the browser console and as toast notifications."
                                                })
                                            ]
                                        })
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                className: "text-center text-sm text-muted-foreground",
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                    children: "Debug page for GCSE AI Marker application"
                })
            })
        ]
    });
}


/***/ }),

/***/ 61226:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 57821));


/***/ }),

/***/ 86653:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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


/***/ }),

/***/ 88145:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   E: () => (/* binding */ Badge)
/* harmony export */ });
/* unused harmony export badgeVariants */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(95155);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12115);
/* harmony import */ var class_variance_authority__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(74466);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(19433);




const badgeVariants = (0,class_variance_authority__WEBPACK_IMPORTED_MODULE_2__/* .cva */ .F)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
            secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
            destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
            outline: "text-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge(param) {
    let { className, variant, ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)(badgeVariants({
            variant
        }), className),
        ...props
    });
}



/***/ }),

/***/ 88482:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BT: () => (/* binding */ CardDescription),
/* harmony export */   Wu: () => (/* binding */ CardContent),
/* harmony export */   ZB: () => (/* binding */ CardTitle),
/* harmony export */   Zp: () => (/* binding */ Card),
/* harmony export */   aR: () => (/* binding */ CardHeader),
/* harmony export */   wL: () => (/* binding */ CardFooter)
/* harmony export */ });
/* unused harmony export CardAction */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(95155);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12115);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19433);



function Card(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        "data-slot": "card",
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className),
        ...props
    });
}
function CardHeader(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        "data-slot": "card-header",
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
        ...props
    });
}
function CardTitle(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        "data-slot": "card-title",
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("leading-none font-semibold", className),
        ...props
    });
}
function CardDescription(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        "data-slot": "card-description",
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("text-muted-foreground text-sm", className),
        ...props
    });
}
function CardAction(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ _jsx("div", {
        "data-slot": "card-action",
        className: cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
        ...props
    });
}
function CardContent(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        "data-slot": "card-content",
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("px-6", className),
        ...props
    });
}
function CardFooter(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        "data-slot": "card-footer",
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("flex items-center px-6 [.border-t]:pt-6", className),
        ...props
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
/******/ __webpack_require__.O(0, [74,393,315,358], () => (__webpack_exec__(61226)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);