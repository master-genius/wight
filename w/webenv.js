'use strict';

let gbl = {};

let wproxy = new Proxy(gbl, {
  get: (obj, p) => {
    return obj[p] || {}
  },
  
  set: (obj, k, v) => {
    gbl[k] = v;
  },

  deleteProperty: (obj, k) => {
    delete obj[k];
  },

});

let window = {};
window.addEventListener = function () {return wproxy;};

window.globalThis = {close: function () {return wproxy;},stop: function () {return wproxy;},focus: function () {return wproxy;},blur: function () {return wproxy;},open: function () {return wproxy;},alert: function () {return wproxy;},confirm: function () {return wproxy;},prompt: function () {return wproxy;},print: function () {return wproxy;},postMessage: function () {return wproxy;},captureEvents: function () {return wproxy;},releaseEvents: function () {return wproxy;},getSelection: function () {return wproxy;},getComputedStyle: function () {return wproxy;},matchMedia: function () {return wproxy;},moveTo: function () {return wproxy;},moveBy: function () {return wproxy;},resizeTo: function () {return wproxy;},resizeBy: function () {return wproxy;},scroll: function () {return wproxy;},scrollTo: function () {return wproxy;},scrollBy: function () {return wproxy;},getDefaultComputedStyle: function () {return wproxy;},scrollByLines: function () {return wproxy;},scrollByPages: function () {return wproxy;},sizeToContent: function () {return wproxy;},updateCommands: function () {return wproxy;},find: function () {return wproxy;},dump: function () {return wproxy;},setResizable: function () {return wproxy;},requestIdleCallback: function () {return wproxy;},cancelIdleCallback: function () {return wproxy;},requestAnimationFrame: function () {return wproxy;},cancelAnimationFrame: function () {return wproxy;},reportError: function () {return wproxy;},btoa: function () {return wproxy;},atob: function () {return wproxy;},setTimeout: function () {return wproxy;},clearTimeout: function () {return wproxy;},setInterval: function () {return wproxy;},clearInterval: function () {return wproxy;},queueMicrotask: function () {return wproxy;},createImageBitmap: function () {return wproxy;},structuredClone: function () {return wproxy;},fetch: function () {return wproxy;},self: {},name:'',history: {},customElements: {},locationbar: {},menubar: {},personalbar: {},scrollbars: {},statusbar: {},toolbar: {},status:'',closed:'',event:'',frames: {},length:'',opener: {},parent: {},frameElement: {},navigator: {},clientInformation: {},external: {},applicationCache: {},screen: {},innerWidth:'',innerHeight:'',scrollX:'',pageXOffset:'',scrollY:'',pageYOffset:'',screenLeft:'',screenTop:'',screenX:'',screenY:'',outerWidth:'',outerHeight:'',performance: {},mozInnerScreenX:'',mozInnerScreenY:'',devicePixelRatio:'',scrollMaxX:'',scrollMaxY:'',fullScreen:'',ondevicemotion: {},ondeviceorientation: {},onabsolutedeviceorientation: {},InstallTrigger: {},visualViewport: {},crypto: {},onabort: {},onblur: {},onfocus: {},onauxclick: {},onbeforeinput: {},oncanplay: {},oncanplaythrough: {},onchange: {},onclick: {},onclose: {},oncontextmenu: {},oncuechange: {},ondblclick: {},ondrag: {},ondragend: {},ondragenter: {},ondragexit: {},ondragleave: {},ondragover: {},ondragstart: {},ondrop: {},ondurationchange: {},onemptied: {},onended: {},onformdata: {},oninput: {},oninvalid: {},onkeydown: {},onkeypress: {},onkeyup: {},onload: function () {return wproxy;},onloadeddata: {},onloadedmetadata: {},onloadend: {},onloadstart: {},onmousedown: {},onmouseenter: {},onmouseleave: {},onmousemove: {},onmouseout: {},onmouseover: {},onmouseup: {},onwheel: {},onpause: {},onplay: {},onplaying: {},onprogress: {},onratechange: {},onreset: {},onresize: function () {return wproxy;},onscroll: function () {return wproxy;},onsecuritypolicyviolation: {},onseeked: {},onseeking: {},onselect: {},onslotchange: {},onstalled: {},onsubmit: {},onsuspend: {},ontimeupdate: {},onvolumechange: {},onwaiting: {},onselectstart: {},onselectionchange: {},ontoggle: {},onpointercancel: {},onpointerdown: {},onpointerup: {},onpointermove: {},onpointerout: {},onpointerover: {},onpointerenter: {},onpointerleave: {},ongotpointercapture: {},onlostpointercapture: {},onmozfullscreenchange: {},onmozfullscreenerror: {},onanimationcancel: {},onanimationend: {},onanimationiteration: {},onanimationstart: {},ontransitioncancel: {},ontransitionend: {},ontransitionrun: {},ontransitionstart: {},onwebkitanimationend: {},onwebkitanimationiteration: {},onwebkitanimationstart: {},onwebkittransitionend: {},u2f: {},onerror: {},speechSynthesis: {},onafterprint: {},onbeforeprint: {},onbeforeunload: {},onhashchange: function () {return wproxy;},onlanguagechange: {},onmessage: {},onmessageerror: {},onoffline: {},ononline: {},onpagehide: {},onpageshow: function () {return wproxy;},onpopstate: {},onrejectionhandled: {},onstorage: {},onunhandledrejection: {},onunload: function () {return wproxy;},ongamepadconnected: {},ongamepaddisconnected: {},localStorage: {},origin:'',crossOriginIsolated:'',isSecureContext:'',indexedDB: {},caches: {},sessionStorage: {},window: {},document: {},location: {},top: {},_import: function () {return wproxy;},require: function () {return wproxy;},__prepath__:'',unalert: function () {return wproxy;},alertError: function () {return wproxy;},notify: function () {return wproxy;},notice: function () {return wproxy;},notifyError: function () {return wproxy;},unprompt: function () {return wproxy;},notifyTop: function () {return wproxy;},notifyLight: function () {return wproxy;},notifyTopError: function () {return wproxy;},notifyOnly: function () {return wproxy;},unnotify: function () {return wproxy;},promptMiddle: function () {return wproxy;},promptTop: function () {return wproxy;},promptGlass: function () {return wproxy;},promptTopGlass: function () {return wproxy;},promptTopDark: function () {return wproxy;},promptMiddleGlass: function () {return wproxy;},promptDark: function () {return wproxy;},promptMiddleDark: function () {return wproxy;},acover: function () {return wproxy;},coverShadow: function () {return wproxy;},uncover: function () {return wproxy;},uncoverShadow: function () {return wproxy;},setCoverText: function () {return wproxy;},apicall: function () {return wproxy;},initPages: function () {return wproxy;},jump_page_forward:'',addEventListener: function () {return wproxy;},removeEventListener: function () {return wproxy;},dispatchEvent: function () {return wproxy;},};
window.Boolean = function () {return wproxy;};
window.Date = function () {return wproxy;};
window.Math = {};
window.Number = function () {return wproxy;};
window.Error = function () {return wproxy;};
window.InternalError = function () {return wproxy;};
window.AggregateError = function () {return wproxy;};
window.EvalError = function () {return wproxy;};
window.RangeError = function () {return wproxy;};
window.ReferenceError = function () {return wproxy;};
window.SyntaxError = function () {return wproxy;};
window.TypeError = function () {return wproxy;};
window.URIError = function () {return wproxy;};
window.ArrayBuffer = function () {return wproxy;};
window.Int8Array = function () {return wproxy;};
window.Uint8Array = function () {return wproxy;};
window.Int16Array = function () {return wproxy;};
window.Uint16Array = function () {return wproxy;};
window.Int32Array = function () {return wproxy;};
window.Uint32Array = function () {return wproxy;};
window.Float32Array = function () {return wproxy;};
window.Float64Array = function () {return wproxy;};
window.Uint8ClampedArray = function () {return wproxy;};
window.BigInt64Array = function () {return wproxy;};
window.BigUint64Array = function () {return wproxy;};
window.BigInt = function () {return wproxy;};
window.WeakMap = function () {return wproxy;};
window.Set = function () {return wproxy;};
window.DataView = function () {return wproxy;};
window.Symbol = function () {return wproxy;};
window.Intl = {};
window.Reflect = {};
window.WeakSet = function () {return wproxy;};
window.Atomics = {};
window.WebAssembly = {compile: function () {return wproxy;},instantiate: function () {return wproxy;},validate: function () {return wproxy;},compileStreaming: function () {return wproxy;},instantiateStreaming: function () {return wproxy;},};
window.FinalizationRegistry = function () {return wproxy;};
window.WeakRef = function () {return wproxy;};
window.SVGGradientElement = function () {return wproxy;};
window.StyleSheetList = function () {return wproxy;};
window.HTMLSlotElement = function () {return wproxy;};
window.SVGMPathElement = function () {return wproxy;};
window.SVGPathElement = function () {return wproxy;};
window.PermissionStatus = function () {return wproxy;};
window.TrackEvent = function () {return wproxy;};
window.PopStateEvent = function () {return wproxy;};
window.GamepadButton = function () {return wproxy;};
window.Attr = function () {return wproxy;};
window.ConstantSourceNode = function () {return wproxy;};
window.BaseAudioContext = function () {return wproxy;};
window.StaticRange = function () {return wproxy;};
window.HTMLAreaElement = function () {return wproxy;};
window.HTMLPictureElement = function () {return wproxy;};
window.FileReader = function () {return wproxy;};
window.SVGLengthList = function () {return wproxy;};
window.SpeechSynthesisUtterance = function () {return wproxy;};
window.SVGSymbolElement = function () {return wproxy;};
window.ElementInternals = function () {return wproxy;};
window.PerformanceServerTiming = function () {return wproxy;};
window.LockManager = function () {return wproxy;};
window.HTMLFrameElement = function () {return wproxy;};
window.FocusEvent = function () {return wproxy;};
window.SVGAElement = function () {return wproxy;};
window.SVGAnimatedPreserveAspectRatio = function () {return wproxy;};
window.Credential = function () {return wproxy;};
window.RTCStatsReport = function () {return wproxy;};
window.WebGLProgram = function () {return wproxy;};
window.TextEncoder = function () {return wproxy;};
window.MediaSession = function () {return wproxy;};
window.MediaDevices = function () {return wproxy;};
window.MediaSource = function () {return wproxy;};
window.PerformanceEventTiming = function () {return wproxy;};
window.PerformanceObserverEntryList = function () {return wproxy;};
window.SVGAnimatedInteger = function () {return wproxy;};
window.SVGSVGElement = function () {return wproxy;};
window.Screen = function () {return wproxy;};
window.SVGFEComponentTransferElement = function () {return wproxy;};
window.FileSystem = function () {return wproxy;};
window.IDBOpenDBRequest = function () {return wproxy;};
window.PeriodicWave = function () {return wproxy;};
window.IDBVersionChangeEvent = function () {return wproxy;};
window.WebGLRenderingContext = function () {return wproxy;};
window.CanvasCaptureMediaStream = function () {return wproxy;};
window.Image = function () {return wproxy;};
window.DOMMatrixReadOnly = function () {return wproxy;};
window.DataTransfer = function () {return wproxy;};
window.HTMLUListElement = function () {return wproxy;};
window.ReadableStreamDefaultReader = function () {return wproxy;};
window.SVGTransform = function () {return wproxy;};
window.Path2D = function () {return wproxy;};
window.SVGAnimatedNumberList = function () {return wproxy;};
window.SubmitEvent = function () {return wproxy;};
window.SVGTextPathElement = function () {return wproxy;};
window.GainNode = function () {return wproxy;};
window.ReadableByteStreamController = function () {return wproxy;};
window.SVGMatrix = function () {return wproxy;};
window.PaintRequestList = function () {return wproxy;};
window.KeyframeEffect = function () {return wproxy;};
window.SVGFETileElement = function () {return wproxy;};
window.SVGFESpotLightElement = function () {return wproxy;};
window.HTMLOutputElement = function () {return wproxy;};
window.PerformanceResourceTiming = function () {return wproxy;};
window.FileSystemDirectoryEntry = function () {return wproxy;};
window.SVGGeometryElement = function () {return wproxy;};
window.SVGFEFuncGElement = function () {return wproxy;};
window.HTMLAudioElement = function () {return wproxy;};
window.DOMQuad = function () {return wproxy;};
window.ByteLengthQueuingStrategy = function () {return wproxy;};
window.SVGUseElement = function () {return wproxy;};
window.MathMLElement = function () {return wproxy;};
window.CSSPageRule = function () {return wproxy;};
window.AnimationTimeline = function () {return wproxy;};
window.GeolocationPosition = function () {return wproxy;};
window.ClipboardEvent = function () {return wproxy;};
window.CloseEvent = function () {return wproxy;};
window.DragEvent = function () {return wproxy;};
window.WebGLShader = function () {return wproxy;};
window.SVGFEImageElement = function () {return wproxy;};
window.HTMLMarqueeElement = function () {return wproxy;};
window.URLSearchParams = function () {return wproxy;};
window.MediaStreamEvent = function () {return wproxy;};
window.SharedWorker = function () {return wproxy;};
window.MimeType = function () {return wproxy;};
window.CompositionEvent = function () {return wproxy;};
window.SVGFEMergeElement = function () {return wproxy;};
window.mozRTCIceCandidate = function () {return wproxy;};
window.ResizeObserver = function () {return wproxy;};
window.RTCIceCandidate = function () {return wproxy;};
window.XMLDocument = function () {return wproxy;};
window.Worklet = function () {return wproxy;};
window.DOMRectReadOnly = function () {return wproxy;};
window.HTMLFormControlsCollection = function () {return wproxy;};
window.SVGRectElement = function () {return wproxy;};
window.DOMPointReadOnly = function () {return wproxy;};
window.IDBFactory = function () {return wproxy;};
window.HTMLBRElement = function () {return wproxy;};
window.HTMLFieldSetElement = function () {return wproxy;};
window.Gamepad = function () {return wproxy;};
window.AudioNode = function () {return wproxy;};
window.SVGSetElement = function () {return wproxy;};
window.CaretPosition = function () {return wproxy;};
window.HTMLParagraphElement = function () {return wproxy;};
window.HTMLScriptElement = function () {return wproxy;};
window.WebGLShaderPrecisionFormat = function () {return wproxy;};
window.FileList = function () {return wproxy;};
window.MediaDeviceInfo = function () {return wproxy;};
window.RadioNodeList = function () {return wproxy;};
window.AudioDestinationNode = function () {return wproxy;};
window.SVGNumberList = function () {return wproxy;};
window.BeforeUnloadEvent = function () {return wproxy;};
window.IDBCursor = function () {return wproxy;};
window.HTMLAllCollection = function () {return wproxy;};
window.MediaError = function () {return wproxy;};
window.SVGFEBlendElement = function () {return wproxy;};
window.WebGLActiveInfo = function () {return wproxy;};
window.InputEvent = function () {return wproxy;};
window.MediaStream = function () {return wproxy;};
window.Range = function () {return wproxy;};
window.FormData = function () {return wproxy;};
window.DOMMatrix = function () {return wproxy;};
window.AudioBufferSourceNode = function () {return wproxy;};
window.CanvasGradient = function () {return wproxy;};
window.TreeWalker = function () {return wproxy;};
window.MouseEvent = function () {return wproxy;};
window.KeyboardEvent = function () {return wproxy;};
window.PerformanceNavigation = function () {return wproxy;};
window.AudioBuffer = function () {return wproxy;};
window.DOMRect = function () {return wproxy;};
window.SpeechSynthesisErrorEvent = function () {return wproxy;};
window.SVGAnimatedRect = function () {return wproxy;};
window.BroadcastChannel = function () {return wproxy;};
window.SVGTextPositioningElement = function () {return wproxy;};
window.RTCRtpSender = function () {return wproxy;};
window.HTMLButtonElement = function () {return wproxy;};
window.FileSystemDirectoryReader = function () {return wproxy;};
window.SVGStopElement = function () {return wproxy;};
window.GamepadEvent = function () {return wproxy;};
window.MediaKeySystemAccess = function () {return wproxy;};
window.FontFaceSetLoadEvent = function () {return wproxy;};
window.PushSubscriptionOptions = function () {return wproxy;};
window.StereoPannerNode = function () {return wproxy;};
window.HTMLDialogElement = function () {return wproxy;};
window.SVGAnimatedEnumeration = function () {return wproxy;};
window.MutationRecord = function () {return wproxy;};
window.SVGPolylineElement = function () {return wproxy;};
window.SVGFESpecularLightingElement = function () {return wproxy;};
window.FontFace = function () {return wproxy;};
window.WebGL2RenderingContext = function () {return wproxy;};
window.MediaRecorder = function () {return wproxy;};
window.FileSystemFileEntry = function () {return wproxy;};
window.VideoPlaybackQuality = function () {return wproxy;};
window.Selection = function () {return wproxy;};
window.Response = function () {return wproxy;};
window.CSSSupportsRule = function () {return wproxy;};
window.Request = function () {return wproxy;};
window.MediaCapabilities = function () {return wproxy;};
window.ServiceWorker = function () {return wproxy;};
window.HTMLDataElement = function () {return wproxy;};
window.WritableStreamDefaultWriter = function () {return wproxy;};
window.SVGFilterElement = function () {return wproxy;};
window.PerformancePaintTiming = function () {return wproxy;};
window.SVGGraphicsElement = function () {return wproxy;};
window.URL = function () {return wproxy;};
window.PerformanceMark = function () {return wproxy;};
window.HTMLVideoElement = function () {return wproxy;};
window.ErrorEvent = function () {return wproxy;};
window.SVGForeignObjectElement = function () {return wproxy;};
window.GeolocationPositionError = function () {return wproxy;};
window.ResizeObserverSize = function () {return wproxy;};
window.SVGNumber = function () {return wproxy;};
window.WebGLUniformLocation = function () {return wproxy;};
window.ImageBitmap = function () {return wproxy;};
window.TransformStream = function () {return wproxy;};
window.PointerEvent = function () {return wproxy;};
window.ShadowRoot = function () {return wproxy;};
window.GeolocationCoordinates = function () {return wproxy;};
window.SVGPreserveAspectRatio = function () {return wproxy;};
window.DelayNode = function () {return wproxy;};
window.SVGTextElement = function () {return wproxy;};
window.StorageManager = function () {return wproxy;};
window.ScrollAreaEvent = function () {return wproxy;};
window.WebGLRenderbuffer = function () {return wproxy;};
window.TextTrackCue = function () {return wproxy;};
window.SVGTextContentElement = function () {return wproxy;};
window.TransformStreamDefaultController = function () {return wproxy;};
window.RTCRtpTransceiver = function () {return wproxy;};
window.SVGAnimatedString = function () {return wproxy;};
window.CredentialsContainer = function () {return wproxy;};
window.PopupBlockedEvent = function () {return wproxy;};
window.WaveShaperNode = function () {return wproxy;};
window.FileSystemEntry = function () {return wproxy;};
window.SVGAnimateTransformElement = function () {return wproxy;};
window.SVGMetadataElement = function () {return wproxy;};
window.CSSKeyframeRule = function () {return wproxy;};
window.SVGCircleElement = function () {return wproxy;};
window.HTMLTableRowElement = function () {return wproxy;};
window.IIRFilterNode = function () {return wproxy;};
window.IntersectionObserverEntry = function () {return wproxy;};
window.Notification = function () {return wproxy;};
window.CSSLayerStatementRule = function () {return wproxy;};
window.PerformanceNavigationTiming = function () {return wproxy;};
window.SVGAnimatedNumber = function () {return wproxy;};
window.MediaStreamTrack = function () {return wproxy;};
window.HTMLImageElement = function () {return wproxy;};
window.ScriptProcessorNode = function () {return wproxy;};
window.SVGFEGaussianBlurElement = function () {return wproxy;};
window.AudioParam = function () {return wproxy;};
window.CustomEvent = function () {return wproxy;};
window.MessageChannel = function () {return wproxy;};
window.MediaQueryListEvent = function () {return wproxy;};
window.CacheStorage = function () {return wproxy;};
window.SVGFEFloodElement = function () {return wproxy;};
window.PaintRequest = function () {return wproxy;};
window.HTMLPreElement = function () {return wproxy;};
window.ConvolverNode = function () {return wproxy;};
window.HTMLEmbedElement = function () {return wproxy;};
window.SVGElement = function () {return wproxy;};
window.TextTrack = function () {return wproxy;};
window.IDBKeyRange = function () {return wproxy;};
window.DeviceOrientationEvent = function () {return wproxy;};
window.RTCDataChannelEvent = function () {return wproxy;};
window.SVGLength = function () {return wproxy;};
window.SVGStyleElement = function () {return wproxy;};
window.Geolocation = function () {return wproxy;};
window.CSS = {supports: function () {return wproxy;},escape: function () {return wproxy;},};
window.SVGFEDropShadowElement = function () {return wproxy;};
window.ServiceWorkerContainer = function () {return wproxy;};
window.MediaStreamTrackEvent = function () {return wproxy;};
window.NavigationPreloadManager = function () {return wproxy;};
window.SVGViewElement = function () {return wproxy;};
window.FormDataEvent = function () {return wproxy;};
window.MediaStreamTrackAudioSourceNode = function () {return wproxy;};
window.MouseScrollEvent = function () {return wproxy;};
window.RTCRtpReceiver = function () {return wproxy;};
window.IDBObjectStore = function () {return wproxy;};
window.PerformanceEntry = function () {return wproxy;};
window.HashChangeEvent = function () {return wproxy;};
window.SVGAngle = function () {return wproxy;};
window.RTCDTMFToneChangeEvent = function () {return wproxy;};
window.Clipboard = function () {return wproxy;};
window.Cache = function () {return wproxy;};
window.HTMLIFrameElement = function () {return wproxy;};
window.SVGScriptElement = function () {return wproxy;};
window.BiquadFilterNode = function () {return wproxy;};
window.WritableStreamDefaultController = function () {return wproxy;};
window.IDBMutableFile = function () {return wproxy;};
window.RTCPeerConnectionIceEvent = function () {return wproxy;};
window.ProgressEvent = function () {return wproxy;};
window.BlobEvent = function () {return wproxy;};
window.HTMLMediaElement = function () {return wproxy;};
window.HTMLSourceElement = function () {return wproxy;};
window.MediaKeyMessageEvent = function () {return wproxy;};
window.IDBIndex = function () {return wproxy;};
window.webkitURL = function () {return wproxy;};
window.WebGLQuery = function () {return wproxy;};
window.HTMLLabelElement = function () {return wproxy;};
window.RTCDtlsTransport = function () {return wproxy;};
window.SVGFEMorphologyElement = function () {return wproxy;};
window.ChannelSplitterNode = function () {return wproxy;};
window.SourceBuffer = function () {return wproxy;};
window.SVGTSpanElement = function () {return wproxy;};
window.MediaMetadata = function () {return wproxy;};
window.SVGPatternElement = function () {return wproxy;};
window.CSSNamespaceRule = function () {return wproxy;};
window.HTMLQuoteElement = function () {return wproxy;};
window.HTMLMenuElement = function () {return wproxy;};
window.WebGLTransformFeedback = function () {return wproxy;};
window.MediaCapabilitiesInfo = function () {return wproxy;};
window.SVGFEFuncBElement = function () {return wproxy;};
window.ValidityState = function () {return wproxy;};
window.HTMLUnknownElement = function () {return wproxy;};
window.HTMLDataListElement = function () {return wproxy;};
window.SVGRect = function () {return wproxy;};
window.DeviceMotionEvent = function () {return wproxy;};
window.OfflineResourceList = function () {return wproxy;};
window.XMLSerializer = function () {return wproxy;};
window.HTMLMeterElement = function () {return wproxy;};
window.SourceBufferList = function () {return wproxy;};
window.CountQueuingStrategy = function () {return wproxy;};
window.SecurityPolicyViolationEvent = function () {return wproxy;};
window.AudioContext = function () {return wproxy;};
window.PerformanceMeasure = function () {return wproxy;};
window.HTMLHeadingElement = function () {return wproxy;};
window.ResizeObserverEntry = function () {return wproxy;};
window.Audio = function () {return wproxy;};
window.TextMetrics = function () {return wproxy;};
window.U2F = function () {return wproxy;};
window.ServiceWorkerRegistration = function () {return wproxy;};
window.AnimationPlaybackEvent = function () {return wproxy;};
window.Plugin = function () {return wproxy;};
window.CSSImportRule = function () {return wproxy;};
window.DOMStringList = function () {return wproxy;};
window.HTMLOptGroupElement = function () {return wproxy;};
window.RTCTrackEvent = function () {return wproxy;};
window.XPathResult = function () {return wproxy;};
window.Lock = function () {return wproxy;};
window.RTCDataChannel = function () {return wproxy;};
window.HTMLDirectoryElement = function () {return wproxy;};
window.ProcessingInstruction = function () {return wproxy;};
window.DOMException = function () {return wproxy;};
window.ReadableStream = function () {return wproxy;};
window.TextTrackCueList = function () {return wproxy;};
window.AnimationEvent = function () {return wproxy;};
window.MediaStreamAudioDestinationNode = function () {return wproxy;};
window.HTMLTableElement = function () {return wproxy;};
window.SVGPoint = function () {return wproxy;};
window.HTMLModElement = function () {return wproxy;};
window.IDBTransaction = function () {return wproxy;};
window.DynamicsCompressorNode = function () {return wproxy;};
window.SVGAnimatedTransformList = function () {return wproxy;};
window.PublicKeyCredential = function () {return wproxy;};
window.SVGFEDiffuseLightingElement = function () {return wproxy;};
window.IDBDatabase = function () {return wproxy;};
window.SVGFEColorMatrixElement = function () {return wproxy;};
window.TransitionEvent = function () {return wproxy;};
window.AudioListener = function () {return wproxy;};
window.SVGFEMergeNodeElement = function () {return wproxy;};
window.AbortController = function () {return wproxy;};
window.RTCPeerConnection = function () {return wproxy;};
window.AnimationEffect = function () {return wproxy;};
window.Permissions = function () {return wproxy;};
window.SVGLineElement = function () {return wproxy;};
window.MediaStreamAudioSourceNode = function () {return wproxy;};
window.Directory = function () {return wproxy;};
window.MediaKeys = function () {return wproxy;};
window.WebGLTexture = function () {return wproxy;};
window.MediaKeySession = function () {return wproxy;};
window.WritableStream = function () {return wproxy;};
window.SVGEllipseElement = function () {return wproxy;};
window.WheelEvent = function () {return wproxy;};
window.SubtleCrypto = function () {return wproxy;};
window.XPathExpression = function () {return wproxy;};
window.AuthenticatorAssertionResponse = function () {return wproxy;};
window.CSSMozDocumentRule = function () {return wproxy;};
window.SVGAnimatedAngle = function () {return wproxy;};
window.File = function () {return wproxy;};
window.SVGLinearGradientElement = function () {return wproxy;};
window.AnalyserNode = function () {return wproxy;};
window.MutationObserver = function () {return wproxy;};
window.SVGStringList = function () {return wproxy;};
window.SVGAnimateMotionElement = function () {return wproxy;};
window.BarProp = function () {return wproxy;};
window.CanvasPattern = function () {return wproxy;};
window.FontFaceSet = function () {return wproxy;};
window.IDBRequest = function () {return wproxy;};
window.UIEvent = function () {return wproxy;};
window.SVGFEDisplacementMapElement = function () {return wproxy;};
window.VTTCue = function () {return wproxy;};
window.KeyEvent = function () {return wproxy;};
window.WebGLBuffer = function () {return wproxy;};
window.StorageEvent = function () {return wproxy;};
window.OscillatorNode = function () {return wproxy;};
window.AuthenticatorResponse = function () {return wproxy;};
window.OfflineAudioContext = function () {return wproxy;};
window.MediaElementAudioSourceNode = function () {return wproxy;};
window.ImageData = function () {return wproxy;};
window.SpeechSynthesisVoice = function () {return wproxy;};
window.SVGFEConvolveMatrixElement = function () {return wproxy;};
window.SVGMarkerElement = function () {return wproxy;};
window.AudioParamMap = function () {return wproxy;};
window.CSSTransition = function () {return wproxy;};
window.CSSFontFeatureValuesRule = function () {return wproxy;};
window.ChannelMergerNode = function () {return wproxy;};
window.AudioProcessingEvent = function () {return wproxy;};
window.AudioScheduledSourceNode = function () {return wproxy;};
window.WebKitCSSMatrix = function () {return wproxy;};
window.MediaKeyError = function () {return wproxy;};
window.DOMRequest = function () {return wproxy;};
window.HTMLLIElement = function () {return wproxy;};
window.SVGDefsElement = function () {return wproxy;};
window.SVGFETurbulenceElement = function () {return wproxy;};
window.SVGUnitTypes = function () {return wproxy;};
window.PushSubscription = function () {return wproxy;};
window.RTCCertificate = function () {return wproxy;};
window.ReadableStreamBYOBRequest = function () {return wproxy;};
window.GamepadHapticActuator = function () {return wproxy;};
window.TextDecoder = function () {return wproxy;};
window.HTMLHRElement = function () {return wproxy;};
window.SVGClipPathElement = function () {return wproxy;};
window.MimeTypeArray = function () {return wproxy;};
window.TextTrackList = function () {return wproxy;};
window.SVGPointList = function () {return wproxy;};
window.ImageBitmapRenderingContext = function () {return wproxy;};
window.MutationEvent = function () {return wproxy;};
window.GamepadPose = function () {return wproxy;};
window.MediaRecorderErrorEvent = function () {return wproxy;};
window.SVGFEDistantLightElement = function () {return wproxy;};
window.HTMLParamElement = function () {return wproxy;};
window.OfflineAudioCompletionEvent = function () {return wproxy;};
window.IntersectionObserver = function () {return wproxy;};
window.HTMLOptionsCollection = function () {return wproxy;};
window.SVGAnimationElement = function () {return wproxy;};
window.HTMLOListElement = function () {return wproxy;};
window.SVGFEFuncAElement = function () {return wproxy;};
window.SVGAnimatedLength = function () {return wproxy;};
window.HTMLProgressElement = function () {return wproxy;};
window.HTMLTableColElement = function () {return wproxy;};
window.SpeechSynthesisEvent = function () {return wproxy;};
window.SVGAnimatedBoolean = function () {return wproxy;};
window.HTMLDListElement = function () {return wproxy;};
window.HTMLTableCellElement = function () {return wproxy;};
window.HTMLDetailsElement = function () {return wproxy;};
window.CSSAnimation = function () {return wproxy;};
window.XPathEvaluator = function () {return wproxy;};
window.RTCDTMFSender = function () {return wproxy;};
window.SVGFEOffsetElement = function () {return wproxy;};
window.XSLTProcessor = function () {return wproxy;};
window.SVGFECompositeElement = function () {return wproxy;};
window.ReadableStreamDefaultController = function () {return wproxy;};
window.WebGLSync = function () {return wproxy;};
window.mozRTCSessionDescription = function () {return wproxy;};
window.MediaEncryptedEvent = function () {return wproxy;};
window.WebGLSampler = function () {return wproxy;};
window.AuthenticatorAttestationResponse = function () {return wproxy;};
window.ScreenOrientation = function () {return wproxy;};
window.SVGComponentTransferFunctionElement = function () {return wproxy;};
window.PerformanceObserver = function () {return wproxy;};
window.CDATASection = function () {return wproxy;};
window.HTMLTableSectionElement = function () {return wproxy;};
window.AudioWorklet = function () {return wproxy;};
window.MessagePort = function () {return wproxy;};
window.HTMLLegendElement = function () {return wproxy;};
window.WebGLFramebuffer = function () {return wproxy;};
window.VisualViewport = function () {return wproxy;};
window.Blob = function () {return wproxy;};
window.PannerNode = function () {return wproxy;};
window.SVGFEPointLightElement = function () {return wproxy;};
window.TimeEvent = function () {return wproxy;};
window.HTMLFontElement = function () {return wproxy;};
window.DOMPoint = function () {return wproxy;};
window.NodeIterator = function () {return wproxy;};
window.WebGLContextEvent = function () {return wproxy;};
window.XMLHttpRequestUpload = function () {return wproxy;};
window.VTTRegion = function () {return wproxy;};
window.SVGSwitchElement = function () {return wproxy;};
window.SVGTransformList = function () {return wproxy;};
window.AbortSignal = function () {return wproxy;};
window.SVGFEFuncRElement = function () {return wproxy;};
window.HTMLTrackElement = function () {return wproxy;};
window.EventSource = function () {return wproxy;};
window.CSSCounterStyleRule = function () {return wproxy;};
window.HTMLFrameSetElement = function () {return wproxy;};
window.SVGImageElement = function () {return wproxy;};
window.SVGGElement = function () {return wproxy;};
window.HTMLMapElement = function () {return wproxy;};
window.mozRTCPeerConnection = function () {return wproxy;};
window.HTMLObjectElement = function () {return wproxy;};
window.HTMLTableCaptionElement = function () {return wproxy;};
window.HTMLBaseElement = function () {return wproxy;};
window.SVGAnimatedLengthList = function () {return wproxy;};
window.AbstractRange = function () {return wproxy;};
window.PromiseRejectionEvent = function () {return wproxy;};
window.TimeRanges = function () {return wproxy;};
window.PluginArray = function () {return wproxy;};
window.Animation = function () {return wproxy;};
window.SVGMaskElement = function () {return wproxy;};
window.IDBFileRequest = function () {return wproxy;};
window.SVGRadialGradientElement = function () {return wproxy;};
window.SVGAnimateElement = function () {return wproxy;};
window.MediaKeyStatusMap = function () {return wproxy;};
window.IDBFileHandle = function () {return wproxy;};
window.DocumentTimeline = function () {return wproxy;};
window.DataTransferItemList = function () {return wproxy;};
window.PushManager = function () {return wproxy;};
window.ReadableStreamBYOBReader = function () {return wproxy;};
window.MessageEvent = function () {return wproxy;};
window.SVGPolygonElement = function () {return wproxy;};
window.WebGLVertexArrayObject = function () {return wproxy;};
window.SVGTitleElement = function () {return wproxy;};
window.HTMLTimeElement = function () {return wproxy;};
window.IDBCursorWithValue = function () {return wproxy;};
window.AudioWorkletNode = function () {return wproxy;};
window.SpeechSynthesis = function () {return wproxy;};
window.DataTransferItem = function () {return wproxy;};
window.RTCSessionDescription = function () {return wproxy;};
window.CSSLayerBlockRule = function () {return wproxy;};
window.CryptoKey = function () {return wproxy;};
window.SVGDescElement = function () {return wproxy;};
window.Headers = function () {return wproxy;};
window.Function = function () {return wproxy;};
window.Object = function () {return wproxy;};
window.eval = function () {return wproxy;};
window.EventTarget = function () {return wproxy;};
window.Window = function () {return wproxy;};
window.close = function () {return wproxy;};
window.stop = function () {return wproxy;};
window.focus = function () {return wproxy;};
window.blur = function () {return wproxy;};
window.open = function () {return wproxy;};
window.alert = function () {return wproxy;};
window.confirm = function () {return wproxy;};
window.prompt = function () {return wproxy;};
window.print = function () {return wproxy;};
window.postMessage = function () {return wproxy;};
window.captureEvents = function () {return wproxy;};
window.releaseEvents = function () {return wproxy;};
window.getSelection = function () {return wproxy;};
window.getComputedStyle = function () {return wproxy;};
window.matchMedia = function () {return wproxy;};
window.moveTo = function () {return wproxy;};
window.moveBy = function () {return wproxy;};
window.resizeTo = function () {return wproxy;};
window.resizeBy = function () {return wproxy;};
window.scroll = function () {return wproxy;};
window.scrollTo = function () {return wproxy;};
window.scrollBy = function () {return wproxy;};
window.getDefaultComputedStyle = function () {return wproxy;};
window.scrollByLines = function () {return wproxy;};
window.scrollByPages = function () {return wproxy;};
window.sizeToContent = function () {return wproxy;};
window.updateCommands = function () {return wproxy;};
window.find = function () {return wproxy;};
window.dump = function () {return wproxy;};
window.setResizable = function () {return wproxy;};
window.requestIdleCallback = function () {return wproxy;};
window.cancelIdleCallback = function () {return wproxy;};
window.requestAnimationFrame = function () {return wproxy;};
window.cancelAnimationFrame = function () {return wproxy;};
window.reportError = function () {return wproxy;};
window.btoa = function () {return wproxy;};
window.atob = function () {return wproxy;};
window.setTimeout = function () {return wproxy;};
window.clearTimeout = function () {return wproxy;};
window.setInterval = function () {return wproxy;};
window.clearInterval = function () {return wproxy;};
window.queueMicrotask = function () {return wproxy;};
window.createImageBitmap = function () {return wproxy;};
window.structuredClone = function () {return wproxy;};
window.fetch = function () {return wproxy;};
window.self = undefined;
window.name = undefined;
window.history = undefined;
window.customElements = undefined;
window.locationbar = undefined;
window.menubar = undefined;
window.personalbar = undefined;
window.scrollbars = undefined;
window.statusbar = undefined;
window.toolbar = undefined;
window.status = undefined;
window.closed = undefined;
window.event = undefined;
window.frames = undefined;
window.length = undefined;
window.opener = undefined;
window.parent = undefined;
window.frameElement = undefined;
window.navigator = undefined;
window.clientInformation = undefined;
window.external = undefined;
window.applicationCache = undefined;
window.screen = undefined;
window.innerWidth = undefined;
window.innerHeight = undefined;
window.scrollX = undefined;
window.pageXOffset = undefined;
window.scrollY = undefined;
window.pageYOffset = undefined;
window.screenLeft = undefined;
window.screenTop = undefined;
window.screenX = undefined;
window.screenY = undefined;
window.outerWidth = undefined;
window.outerHeight = undefined;
window.performance = undefined;
window.mozInnerScreenX = undefined;
window.mozInnerScreenY = undefined;
window.devicePixelRatio = undefined;
window.scrollMaxX = undefined;
window.scrollMaxY = undefined;
window.fullScreen = undefined;
window.ondevicemotion = undefined;
window.ondeviceorientation = undefined;
window.onabsolutedeviceorientation = undefined;
window.InstallTrigger = undefined;
window.visualViewport = undefined;
window.crypto = undefined;
window.onabort = undefined;
window.onblur = undefined;
window.onfocus = undefined;
window.onauxclick = undefined;
window.onbeforeinput = undefined;
window.oncanplay = undefined;
window.oncanplaythrough = undefined;
window.onchange = undefined;
window.onclick = undefined;
window.onclose = undefined;
window.oncontextmenu = undefined;
window.oncuechange = undefined;
window.ondblclick = undefined;
window.ondrag = undefined;
window.ondragend = undefined;
window.ondragenter = undefined;
window.ondragexit = undefined;
window.ondragleave = undefined;
window.ondragover = undefined;
window.ondragstart = undefined;
window.ondrop = undefined;
window.ondurationchange = undefined;
window.onemptied = undefined;
window.onended = undefined;
window.onformdata = undefined;
window.oninput = undefined;
window.oninvalid = undefined;
window.onkeydown = undefined;
window.onkeypress = undefined;
window.onkeyup = undefined;
window.onload = undefined;
window.onloadeddata = undefined;
window.onloadedmetadata = undefined;
window.onloadend = undefined;
window.onloadstart = undefined;
window.onmousedown = undefined;
window.onmouseenter = undefined;
window.onmouseleave = undefined;
window.onmousemove = undefined;
window.onmouseout = undefined;
window.onmouseover = undefined;
window.onmouseup = undefined;
window.onwheel = undefined;
window.onpause = undefined;
window.onplay = undefined;
window.onplaying = undefined;
window.onprogress = undefined;
window.onratechange = undefined;
window.onreset = undefined;
window.onresize = undefined;
window.onscroll = undefined;
window.onsecuritypolicyviolation = undefined;
window.onseeked = undefined;
window.onseeking = undefined;
window.onselect = undefined;
window.onslotchange = undefined;
window.onstalled = undefined;
window.onsubmit = undefined;
window.onsuspend = undefined;
window.ontimeupdate = undefined;
window.onvolumechange = undefined;
window.onwaiting = undefined;
window.onselectstart = undefined;
window.onselectionchange = undefined;
window.ontoggle = undefined;
window.onpointercancel = undefined;
window.onpointerdown = undefined;
window.onpointerup = undefined;
window.onpointermove = undefined;
window.onpointerout = undefined;
window.onpointerover = undefined;
window.onpointerenter = undefined;
window.onpointerleave = undefined;
window.ongotpointercapture = undefined;
window.onlostpointercapture = undefined;
window.onmozfullscreenchange = undefined;
window.onmozfullscreenerror = undefined;
window.onanimationcancel = undefined;
window.onanimationend = undefined;
window.onanimationiteration = undefined;
window.onanimationstart = undefined;
window.ontransitioncancel = undefined;
window.ontransitionend = undefined;
window.ontransitionrun = undefined;
window.ontransitionstart = undefined;
window.onwebkitanimationend = undefined;
window.onwebkitanimationiteration = undefined;
window.onwebkitanimationstart = undefined;
window.onwebkittransitionend = undefined;
window.u2f = undefined;
window.onerror = undefined;
window.speechSynthesis = undefined;
window.onafterprint = undefined;
window.onbeforeprint = undefined;
window.onbeforeunload = undefined;
window.onhashchange = undefined;
window.onlanguagechange = undefined;
window.onmessage = undefined;
window.onmessageerror = undefined;
window.onoffline = undefined;
window.ononline = undefined;
window.onpagehide = undefined;
window.onpageshow = undefined;
window.onpopstate = undefined;
window.onrejectionhandled = undefined;
window.onstorage = undefined;
window.onunhandledrejection = undefined;
window.onunload = undefined;
window.ongamepadconnected = undefined;
window.ongamepaddisconnected = undefined;
window.localStorage = undefined;
window.origin = undefined;
window.crossOriginIsolated = undefined;
window.isSecureContext = undefined;
window.indexedDB = undefined;
window.caches = undefined;
window.sessionStorage = undefined;
window.window = undefined;
window.document = undefined;
window.location = undefined;
window.top = undefined;
window.netscape = {};
window.Node = function () {return wproxy;};
window.Document = function () {return wproxy;};
window.HTMLDocument = function () {return wproxy;};
window.EventCounts = function () {return wproxy;};
window.Map = function () {return wproxy;};
window.Performance = function () {return wproxy;};
window.Event = function () {return wproxy;};
window.PerformanceTiming = function () {return wproxy;};
window.Location = function () {return wproxy;};
window.XMLHttpRequestEventTarget = function () {return wproxy;};
window.XMLHttpRequest = function () {return wproxy;};
window.WebSocket = function () {return wproxy;};
window.JSON = {};
window.Promise = function () {return wproxy;};
window.Array = function () {return wproxy;};
window.console = {assert: function () {return wproxy;},clear: function () {return wproxy;},count: function () {return wproxy;},countReset: function () {return wproxy;},debug: function () {return wproxy;},error: function () {return wproxy;},info: function () {return wproxy;},log: function () {return wproxy;},table: function () {return wproxy;},trace: function () {return wproxy;},warn: function () {return wproxy;},dir: function () {return wproxy;},dirxml: function () {return wproxy;},group: function () {return wproxy;},groupCollapsed: function () {return wproxy;},groupEnd: function () {return wproxy;},time: function () {return wproxy;},timeLog: function () {return wproxy;},timeEnd: function () {return wproxy;},exception: function () {return wproxy;},timeStamp: function () {return wproxy;},profile: function () {return wproxy;},profileEnd: function () {return wproxy;},};
window.Storage = function () {return wproxy;};
window.Element = function () {return wproxy;};
window.HTMLElement = function () {return wproxy;};
window.HTMLMetaElement = function () {return wproxy;};
window.HTMLLinkElement = function () {return wproxy;};
window.DOMTokenList = function () {return wproxy;};
window.StyleSheetApplicableStateChangeEvent = function () {return wproxy;};
window.StyleSheet = function () {return wproxy;};
window.CSSStyleSheet = function () {return wproxy;};
window.CSSRuleList = function () {return wproxy;};
window.CSSRule = function () {return wproxy;};
window.CSSKeyframesRule = function () {return wproxy;};
window.CSSStyleRule = function () {return wproxy;};
window.CSSGroupingRule = function () {return wproxy;};
window.CSSConditionRule = function () {return wproxy;};
window.CSSMediaRule = function () {return wproxy;};
window.CSSFontFaceRule = function () {return wproxy;};
window.HTMLStyleElement = function () {return wproxy;};
window.MediaList = function () {return wproxy;};
window.MediaQueryList = function () {return wproxy;};
window.Navigator = function () {return wproxy;};
window.escape = function () {return wproxy;};
window.unescape = function () {return wproxy;};
window.decodeURI = function () {return wproxy;};
window.encodeURI = function () {return wproxy;};
window.decodeURIComponent = function () {return wproxy;};
window.encodeURIComponent = function () {return wproxy;};
window.String = function () {return wproxy;};
window.History = function () {return wproxy;};
window.Proxy = function () {return wproxy;};
window.RegExp = function () {return wproxy;};
window._import = function () {return wproxy;};
window.require = function () {return wproxy;};
window.__prepath__ = '';
window.unalert = function () {return wproxy;};
window.alertError = function () {return wproxy;};
window.notify = function () {return wproxy;};
window.notice = function () {return wproxy;};
window.notifyError = function () {return wproxy;};
window.unprompt = function () {return wproxy;};
window.notifyTop = function () {return wproxy;};
window.notifyLight = function () {return wproxy;};
window.notifyTopError = function () {return wproxy;};
window.notifyOnly = function () {return wproxy;};
window.unnotify = function () {return wproxy;};
window.promptMiddle = function () {return wproxy;};
window.promptTop = function () {return wproxy;};
window.promptGlass = function () {return wproxy;};
window.promptTopGlass = function () {return wproxy;};
window.promptTopDark = function () {return wproxy;};
window.promptMiddleGlass = function () {return wproxy;};
window.promptDark = function () {return wproxy;};
window.promptMiddleDark = function () {return wproxy;};
window.acover = function () {return wproxy;};
window.coverShadow = function () {return wproxy;};
window.uncover = function () {return wproxy;};
window.uncoverShadow = function () {return wproxy;};
window.setCoverText = function () {return wproxy;};
window.apicall = function () {return wproxy;};
window.CustomElementRegistry = function () {return wproxy;};
window.XULElement = function () {return wproxy;};
window.initPages = function () {return wproxy;};
window.jump_page_forward = false;
window.HTMLHeadElement = function () {return wproxy;};
window.Crypto = function () {return wproxy;};
window.DocumentFragment = function () {return wproxy;};
window.HTMLTemplateElement = function () {return wproxy;};
window.NodeFilter = function () {return wproxy;};
window.NamedNodeMap = function () {return wproxy;};
window.CharacterData = function () {return wproxy;};
window.Text = function () {return wproxy;};
window.Comment = function () {return wproxy;};
window.DOMParser = function () {return wproxy;};
window.DOMImplementation = function () {return wproxy;};
window.HTMLFormElement = function () {return wproxy;};
window.HTMLHtmlElement = function () {return wproxy;};
window.HTMLCollection = function () {return wproxy;};
window.HTMLBodyElement = function () {return wproxy;};
window.HTMLTitleElement = function () {return wproxy;};
window.NodeList = function () {return wproxy;};
window.DocumentType = function () {return wproxy;};
window.HTMLDivElement = function () {return wproxy;};
window.HTMLInputElement = function () {return wproxy;};
window.HTMLAnchorElement = function () {return wproxy;};
window.HTMLTextAreaElement = function () {return wproxy;};
window.CSSStyleDeclaration = function () {return wproxy;};
window.CSS2Properties = function () {return wproxy;};
window.HTMLSelectElement = function () {return wproxy;};
window.HTMLOptionElement = function () {return wproxy;};
window.Option = function () {return wproxy;};
window.HTMLCanvasElement = function () {return wproxy;};
window.CanvasRenderingContext2D = function () {return wproxy;};
window.InstallTriggerImpl = function () {return wproxy;};
window.HTMLSpanElement = function () {return wproxy;};
window.Worker = function () {return wproxy;};
window.PageTransitionEvent = function () {return wproxy;};
window.IdleDeadline = function () {return wproxy;};
window.NotifyPaintEvent = function () {return wproxy;};
window.DOMRectList = function () {return wproxy;};
window.DOMStringMap = function () {return wproxy;};
let document = {};document.location = {href:'',origin:'',protocol:'',host:'',hostname:'',port:'',pathname:'',search:'',hash:'',assign: function () {return wproxy;},replace: function () {return wproxy;},reload: function () {return wproxy;},toString: function () {return wproxy;},};
document.getElementsByTagName = function () {return wproxy;};
document.getElementsByTagNameNS = function () {return wproxy;};
document.getElementsByClassName = function () {return wproxy;};
document.getElementById = function () {return wproxy;};
document.createElement = function () {return wproxy;};
document.createElementNS = function () {return wproxy;};
document.createDocumentFragment = function () {return wproxy;};
document.createTextNode = function () {return wproxy;};
document.createComment = function () {return wproxy;};
document.createProcessingInstruction = function () {return wproxy;};
document.importNode = function () {return wproxy;};
document.adoptNode = function () {return wproxy;};
document.createEvent = function () {return wproxy;};
document.createRange = function () {return wproxy;};
document.createNodeIterator = function () {return wproxy;};
document.createTreeWalker = function () {return wproxy;};
document.createCDATASection = function () {return wproxy;};
document.createAttribute = function () {return wproxy;};
document.createAttributeNS = function () {return wproxy;};
document.getElementsByName = function () {return wproxy;};
document.open = function () {return wproxy;};
document.close = function () {return wproxy;};
document.write = function () {return wproxy;};
document.writeln = function () {return wproxy;};
document.hasFocus = function () {return wproxy;};
document.execCommand = function () {return wproxy;};
document.queryCommandEnabled = function () {return wproxy;};
document.queryCommandIndeterm = function () {return wproxy;};
document.queryCommandState = function () {return wproxy;};
document.queryCommandSupported = function () {return wproxy;};
document.queryCommandValue = function () {return wproxy;};
document.releaseCapture = function () {return wproxy;};
document.mozSetImageElement = function () {return wproxy;};
document.clear = function () {return wproxy;};
document.captureEvents = function () {return wproxy;};
document.releaseEvents = function () {return wproxy;};
document.exitFullscreen = function () {return wproxy;};
document.mozCancelFullScreen = function () {return wproxy;};
document.exitPointerLock = function () {return wproxy;};
document.enableStyleSheetsForSet = function () {return wproxy;};
document.caretPositionFromPoint = function () {return wproxy;};
document.querySelector = function () {return wproxy;};
document.querySelectorAll = function () {return wproxy;};
document.getSelection = function () {return wproxy;};
document.hasStorageAccess = function () {return wproxy;};
document.requestStorageAccess = function () {return wproxy;};
document.elementFromPoint = function () {return wproxy;};
document.elementsFromPoint = function () {return wproxy;};
document.getAnimations = function () {return wproxy;};
document.prepend = function () {return wproxy;};
document.append = function () {return wproxy;};
document.replaceChildren = function () {return wproxy;};
document.createExpression = function () {return wproxy;};
document.createNSResolver = function () {return wproxy;};
document.evaluate = function () {return wproxy;};
document.implementation = {hasFeature: function () {return wproxy;},createDocumentType: function () {return wproxy;},createDocument: function () {return wproxy;},createHTMLDocument: function () {return wproxy;},};
document.URL = '';
document.documentURI = '';
document.compatMode = 'CSS1Compat';
document.characterSet = 'UTF-8';
document.charset = 'UTF-8';
document.inputEncoding = 'UTF-8';
document.contentType = 'text/html';
document.doctype = {before: function () {return wproxy;},after: function () {return wproxy;},replaceWith: function () {return wproxy;},remove: function () {return wproxy;},name:'',publicId:'',systemId:'',getRootNode: function () {return wproxy;},hasChildNodes: function () {return wproxy;},insertBefore: function () {return wproxy;},appendChild: function () {return wproxy;},replaceChild: function () {return wproxy;},removeChild: function () {return wproxy;},normalize: function () {return wproxy;},cloneNode: function () {return wproxy;},isSameNode: function () {return wproxy;},isEqualNode: function () {return wproxy;},compareDocumentPosition: function () {return wproxy;},contains: function () {return wproxy;},lookupPrefix: function () {return wproxy;},lookupNamespaceURI: function () {return wproxy;},isDefaultNamespace: function () {return wproxy;},nodeType:'',nodeName:'',baseURI:'',isConnected:'',ownerDocument: {},parentNode: {},parentElement: {},childNodes: {},firstChild: {},lastChild: {},previousSibling: {},nextSibling: {},nodeValue: {},textContent: {},ELEMENT_NODE:'',ATTRIBUTE_NODE:'',TEXT_NODE:'',CDATA_SECTION_NODE:'',ENTITY_REFERENCE_NODE:'',ENTITY_NODE:'',PROCESSING_INSTRUCTION_NODE:'',COMMENT_NODE:'',DOCUMENT_NODE:'',DOCUMENT_TYPE_NODE:'',DOCUMENT_FRAGMENT_NODE:'',NOTATION_NODE:'',DOCUMENT_POSITION_DISCONNECTED:'',DOCUMENT_POSITION_PRECEDING:'',DOCUMENT_POSITION_FOLLOWING:'',DOCUMENT_POSITION_CONTAINS:'',DOCUMENT_POSITION_CONTAINED_BY:'',DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:'',addEventListener: function () {return wproxy;},removeEventListener: function () {return wproxy;},dispatchEvent: function () {return wproxy;},};
document.documentElement = {version:'',click: function () {return wproxy;},attachInternals: function () {return wproxy;},focus: function () {return wproxy;},blur: function () {return wproxy;},title:'',lang:'',dir:'',innerText:'',outerText:'',hidden:'',accessKey:'',accessKeyLabel:'',draggable:'',contentEditable:'',isContentEditable:'',spellcheck:'',inputMode:'',enterKeyHint:'',nonce:'',offsetParent: {},offsetTop:'',offsetLeft:'',offsetWidth:'',offsetHeight:'',oncopy: {},oncut: {},onpaste: {},style: {},onabort: {},onblur: {},onfocus: {},onauxclick: {},onbeforeinput: {},oncanplay: {},oncanplaythrough: {},onchange: {},onclick: {},onclose: {},oncontextmenu: {},oncuechange: {},ondblclick: {},ondrag: {},ondragend: {},ondragenter: {},ondragexit: {},ondragleave: {},ondragover: {},ondragstart: {},ondrop: {},ondurationchange: {},onemptied: {},onended: {},onformdata: {},oninput: {},oninvalid: {},onkeydown: {},onkeypress: {},onkeyup: {},onload: {},onloadeddata: {},onloadedmetadata: {},onloadend: {},onloadstart: {},onmousedown: {},onmouseenter: {},onmouseleave: {},onmousemove: {},onmouseout: {},onmouseover: {},onmouseup: {},onwheel: {},onpause: {},onplay: {},onplaying: {},onprogress: {},onratechange: {},onreset: {},onresize: {},onscroll: {},onsecuritypolicyviolation: {},onseeked: {},onseeking: {},onselect: {},onslotchange: {},onstalled: {},onsubmit: {},onsuspend: {},ontimeupdate: {},onvolumechange: {},onwaiting: {},onselectstart: {},onselectionchange: {},ontoggle: {},onpointercancel: {},onpointerdown: {},onpointerup: {},onpointermove: {},onpointerout: {},onpointerover: {},onpointerenter: {},onpointerleave: {},ongotpointercapture: {},onlostpointercapture: {},onmozfullscreenchange: {},onmozfullscreenerror: {},onanimationcancel: {},onanimationend: {},onanimationiteration: {},onanimationstart: {},ontransitioncancel: {},ontransitionend: {},ontransitionrun: {},ontransitionstart: {},onwebkitanimationend: {},onwebkitanimationiteration: {},onwebkitanimationstart: {},onwebkittransitionend: {},dataset: {},tabIndex:'',onerror: {},getAttributeNames: function () {return wproxy;},getAttribute: function () {return wproxy;},getAttributeNS: function () {return wproxy;},toggleAttribute: function () {return wproxy;},setAttribute: function () {return wproxy;},setAttributeNS: function () {return wproxy;},removeAttribute: function () {return wproxy;},removeAttributeNS: function () {return wproxy;},hasAttribute: function () {return wproxy;},hasAttributeNS: function () {return wproxy;},hasAttributes: function () {return wproxy;},closest: function () {return wproxy;},matches: function () {return wproxy;},webkitMatchesSelector: function () {return wproxy;},getElementsByTagName: function () {return wproxy;},getElementsByTagNameNS: function () {return wproxy;},getElementsByClassName: function () {return wproxy;},insertAdjacentElement: function () {return wproxy;},insertAdjacentText: function () {return wproxy;},mozMatchesSelector: function () {return wproxy;},setPointerCapture: function () {return wproxy;},releasePointerCapture: function () {return wproxy;},hasPointerCapture: function () {return wproxy;},setCapture: function () {return wproxy;},releaseCapture: function () {return wproxy;},getAttributeNode: function () {return wproxy;},setAttributeNode: function () {return wproxy;},removeAttributeNode: function () {return wproxy;},getAttributeNodeNS: function () {return wproxy;},setAttributeNodeNS: function () {return wproxy;},getClientRects: function () {return wproxy;},getBoundingClientRect: function () {return wproxy;},scrollIntoView: function () {return wproxy;},scroll: function () {return wproxy;},scrollTo: function () {return wproxy;},scrollBy: function () {return wproxy;},insertAdjacentHTML: function () {return wproxy;},querySelector: function () {return wproxy;},querySelectorAll: function () {return wproxy;},attachShadow: function () {return wproxy;},requestFullscreen: function () {return wproxy;},mozRequestFullScreen: function () {return wproxy;},requestPointerLock: function () {return wproxy;},animate: function () {return wproxy;},getAnimations: function () {return wproxy;},before: function () {return wproxy;},after: function () {return wproxy;},replaceWith: function () {return wproxy;},remove: function () {return wproxy;},prepend: function () {return wproxy;},append: function () {return wproxy;},replaceChildren: function () {return wproxy;},namespaceURI:'',prefix: {},localName:'',tagName:'',id:'',className:'',classList: {},part: {},attributes: {},scrollTop:'',scrollLeft:'',scrollWidth:'',scrollHeight:'',clientTop:'',clientLeft:'',clientWidth:'',clientHeight:'',scrollTopMax:'',scrollLeftMax:'',innerHTML:'',outerHTML:'',shadowRoot: {},assignedSlot: {},slot:'',onfullscreenchange: {},onfullscreenerror: {},previousElementSibling: {},nextElementSibling: {},children: {},firstElementChild: {},lastElementChild: {},childElementCount:'',getRootNode: function () {return wproxy;},hasChildNodes: function () {return wproxy;},insertBefore: function () {return wproxy;},appendChild: function () {return wproxy;},replaceChild: function () {return wproxy;},removeChild: function () {return wproxy;},normalize: function () {return wproxy;},cloneNode: function () {return wproxy;},isSameNode: function () {return wproxy;},isEqualNode: function () {return wproxy;},compareDocumentPosition: function () {return wproxy;},contains: function () {return wproxy;},lookupPrefix: function () {return wproxy;},lookupNamespaceURI: function () {return wproxy;},isDefaultNamespace: function () {return wproxy;},nodeType:'',nodeName:'',baseURI:'',isConnected:'',ownerDocument: {},parentNode: {},parentElement: {},childNodes: {},firstChild: {},lastChild: {},previousSibling: {},nextSibling: {},nodeValue: {},textContent:'',ELEMENT_NODE:'',ATTRIBUTE_NODE:'',TEXT_NODE:'',CDATA_SECTION_NODE:'',ENTITY_REFERENCE_NODE:'',ENTITY_NODE:'',PROCESSING_INSTRUCTION_NODE:'',COMMENT_NODE:'',DOCUMENT_NODE:'',DOCUMENT_TYPE_NODE:'',DOCUMENT_FRAGMENT_NODE:'',NOTATION_NODE:'',DOCUMENT_POSITION_DISCONNECTED:'',DOCUMENT_POSITION_PRECEDING:'',DOCUMENT_POSITION_FOLLOWING:'',DOCUMENT_POSITION_CONTAINS:'',DOCUMENT_POSITION_CONTAINED_BY:'',DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:'',addEventListener: function () {return wproxy;},removeEventListener: function () {return wproxy;},dispatchEvent: function () {return wproxy;},};
document.domain = 'localhost';
document.referrer = '';
document.cookie = '';
document.lastModified = '07/19/2022 15:49:19';
document.readyState = '';
document.title = '';
document.dir = '';
document.body = {text:'',link:'',vLink:'',aLink:'',bgColor:'',background:'',onafterprint: {},onbeforeprint: {},onbeforeunload: {},onhashchange: function () {return wproxy;},onlanguagechange: {},onmessage: {},onmessageerror: {},onoffline: {},ononline: {},onpagehide: {},onpageshow: function () {return wproxy;},onpopstate: {},onrejectionhandled: {},onstorage: {},onunhandledrejection: {},onunload: function () {return wproxy;},ongamepadconnected: {},ongamepaddisconnected: {},click: function () {return wproxy;},attachInternals: function () {return wproxy;},focus: function () {return wproxy;},blur: function () {return wproxy;},title:'',lang:'',dir:'',innerText:'',outerText:'',hidden:'',accessKey:'',accessKeyLabel:'',draggable:'',contentEditable:'',isContentEditable:'',spellcheck:'',inputMode:'',enterKeyHint:'',nonce:'',offsetParent: {},offsetTop:'',offsetLeft:'',offsetWidth:'',offsetHeight:'',oncopy: {},oncut: {},onpaste: {},style: {},onabort: {},onblur: {},onfocus: {},onauxclick: {},onbeforeinput: {},oncanplay: {},oncanplaythrough: {},onchange: {},onclick: {},onclose: {},oncontextmenu: {},oncuechange: {},ondblclick: {},ondrag: {},ondragend: {},ondragenter: {},ondragexit: {},ondragleave: {},ondragover: {},ondragstart: {},ondrop: {},ondurationchange: {},onemptied: {},onended: {},onformdata: {},oninput: {},oninvalid: {},onkeydown: {},onkeypress: {},onkeyup: {},onload: function () {return wproxy;},onloadeddata: {},onloadedmetadata: {},onloadend: {},onloadstart: {},onmousedown: {},onmouseenter: {},onmouseleave: {},onmousemove: {},onmouseout: {},onmouseover: {},onmouseup: {},onwheel: {},onpause: {},onplay: {},onplaying: {},onprogress: {},onratechange: {},onreset: {},onresize: function () {return wproxy;},onscroll: function () {return wproxy;},onsecuritypolicyviolation: {},onseeked: {},onseeking: {},onselect: {},onslotchange: {},onstalled: {},onsubmit: {},onsuspend: {},ontimeupdate: {},onvolumechange: {},onwaiting: {},onselectstart: {},onselectionchange: {},ontoggle: {},onpointercancel: {},onpointerdown: {},onpointerup: {},onpointermove: {},onpointerout: {},onpointerover: {},onpointerenter: {},onpointerleave: {},ongotpointercapture: {},onlostpointercapture: {},onmozfullscreenchange: {},onmozfullscreenerror: {},onanimationcancel: {},onanimationend: {},onanimationiteration: {},onanimationstart: {},ontransitioncancel: {},ontransitionend: {},ontransitionrun: {},ontransitionstart: {},onwebkitanimationend: {},onwebkitanimationiteration: {},onwebkitanimationstart: {},onwebkittransitionend: {},dataset: {},tabIndex:'',onerror: {},getAttributeNames: function () {return wproxy;},getAttribute: function () {return wproxy;},getAttributeNS: function () {return wproxy;},toggleAttribute: function () {return wproxy;},setAttribute: function () {return wproxy;},setAttributeNS: function () {return wproxy;},removeAttribute: function () {return wproxy;},removeAttributeNS: function () {return wproxy;},hasAttribute: function () {return wproxy;},hasAttributeNS: function () {return wproxy;},hasAttributes: function () {return wproxy;},closest: function () {return wproxy;},matches: function () {return wproxy;},webkitMatchesSelector: function () {return wproxy;},getElementsByTagName: function () {return wproxy;},getElementsByTagNameNS: function () {return wproxy;},getElementsByClassName: function () {return wproxy;},insertAdjacentElement: function () {return wproxy;},insertAdjacentText: function () {return wproxy;},mozMatchesSelector: function () {return wproxy;},setPointerCapture: function () {return wproxy;},releasePointerCapture: function () {return wproxy;},hasPointerCapture: function () {return wproxy;},setCapture: function () {return wproxy;},releaseCapture: function () {return wproxy;},getAttributeNode: function () {return wproxy;},setAttributeNode: function () {return wproxy;},removeAttributeNode: function () {return wproxy;},getAttributeNodeNS: function () {return wproxy;},setAttributeNodeNS: function () {return wproxy;},getClientRects: function () {return wproxy;},getBoundingClientRect: function () {return wproxy;},scrollIntoView: function () {return wproxy;},scroll: function () {return wproxy;},scrollTo: function () {return wproxy;},scrollBy: function () {return wproxy;},insertAdjacentHTML: function () {return wproxy;},querySelector: function () {return wproxy;},querySelectorAll: function () {return wproxy;},attachShadow: function () {return wproxy;},requestFullscreen: function () {return wproxy;},mozRequestFullScreen: function () {return wproxy;},requestPointerLock: function () {return wproxy;},animate: function () {return wproxy;},getAnimations: function () {return wproxy;},before: function () {return wproxy;},after: function () {return wproxy;},replaceWith: function () {return wproxy;},remove: function () {return wproxy;},prepend: function () {return wproxy;},append: function () {return wproxy;},replaceChildren: function () {return wproxy;},namespaceURI:'',prefix: {},localName:'',tagName:'',id:'',className:'',classList: {},part: {},attributes: {},scrollTop:'',scrollLeft:'',scrollWidth:'',scrollHeight:'',clientTop:'',clientLeft:'',clientWidth:'',clientHeight:'',scrollTopMax:'',scrollLeftMax:'',innerHTML:'',outerHTML:'',shadowRoot: {},assignedSlot: {},slot:'',onfullscreenchange: {},onfullscreenerror: {},previousElementSibling: {},nextElementSibling: {},children: {},firstElementChild: {},lastElementChild: {},childElementCount:'',getRootNode: function () {return wproxy;},hasChildNodes: function () {return wproxy;},insertBefore: function () {return wproxy;},appendChild: function () {return wproxy;},replaceChild: function () {return wproxy;},removeChild: function () {return wproxy;},normalize: function () {return wproxy;},cloneNode: function () {return wproxy;},isSameNode: function () {return wproxy;},isEqualNode: function () {return wproxy;},compareDocumentPosition: function () {return wproxy;},contains: function () {return wproxy;},lookupPrefix: function () {return wproxy;},lookupNamespaceURI: function () {return wproxy;},isDefaultNamespace: function () {return wproxy;},nodeType:'',nodeName:'',baseURI:'',isConnected:'',ownerDocument: {},parentNode: {},parentElement: {},childNodes: {},firstChild: {},lastChild: {},previousSibling: {},nextSibling: {},nodeValue: {},textContent:'',ELEMENT_NODE:'',ATTRIBUTE_NODE:'',TEXT_NODE:'',CDATA_SECTION_NODE:'',ENTITY_REFERENCE_NODE:'',ENTITY_NODE:'',PROCESSING_INSTRUCTION_NODE:'',COMMENT_NODE:'',DOCUMENT_NODE:'',DOCUMENT_TYPE_NODE:'',DOCUMENT_FRAGMENT_NODE:'',NOTATION_NODE:'',DOCUMENT_POSITION_DISCONNECTED:'',DOCUMENT_POSITION_PRECEDING:'',DOCUMENT_POSITION_FOLLOWING:'',DOCUMENT_POSITION_CONTAINS:'',DOCUMENT_POSITION_CONTAINED_BY:'',DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:'',addEventListener: function () {return wproxy;},removeEventListener: function () {return wproxy;},dispatchEvent: function () {return wproxy;},};
document.head = {click: function () {return wproxy;},attachInternals: function () {return wproxy;},focus: function () {return wproxy;},blur: function () {return wproxy;},title:'',lang:'',dir:'',innerText:'',outerText:'',hidden:'',accessKey:'',accessKeyLabel:'',draggable:'',contentEditable:'',isContentEditable:'',spellcheck:'',inputMode:'',enterKeyHint:'',nonce:'',offsetParent: {},offsetTop:'',offsetLeft:'',offsetWidth:'',offsetHeight:'',oncopy: {},oncut: {},onpaste: {},style: {},onabort: {},onblur: {},onfocus: {},onauxclick: {},onbeforeinput: {},oncanplay: {},oncanplaythrough: {},onchange: {},onclick: {},onclose: {},oncontextmenu: {},oncuechange: {},ondblclick: {},ondrag: {},ondragend: {},ondragenter: {},ondragexit: {},ondragleave: {},ondragover: {},ondragstart: {},ondrop: {},ondurationchange: {},onemptied: {},onended: {},onformdata: {},oninput: {},oninvalid: {},onkeydown: {},onkeypress: {},onkeyup: {},onload: {},onloadeddata: {},onloadedmetadata: {},onloadend: {},onloadstart: {},onmousedown: {},onmouseenter: {},onmouseleave: {},onmousemove: {},onmouseout: {},onmouseover: {},onmouseup: {},onwheel: {},onpause: {},onplay: {},onplaying: {},onprogress: {},onratechange: {},onreset: {},onresize: {},onscroll: {},onsecuritypolicyviolation: {},onseeked: {},onseeking: {},onselect: {},onslotchange: {},onstalled: {},onsubmit: {},onsuspend: {},ontimeupdate: {},onvolumechange: {},onwaiting: {},onselectstart: {},onselectionchange: {},ontoggle: {},onpointercancel: {},onpointerdown: {},onpointerup: {},onpointermove: {},onpointerout: {},onpointerover: {},onpointerenter: {},onpointerleave: {},ongotpointercapture: {},onlostpointercapture: {},onmozfullscreenchange: {},onmozfullscreenerror: {},onanimationcancel: {},onanimationend: {},onanimationiteration: {},onanimationstart: {},ontransitioncancel: {},ontransitionend: {},ontransitionrun: {},ontransitionstart: {},onwebkitanimationend: {},onwebkitanimationiteration: {},onwebkitanimationstart: {},onwebkittransitionend: {},dataset: {},tabIndex:'',onerror: {},getAttributeNames: function () {return wproxy;},getAttribute: function () {return wproxy;},getAttributeNS: function () {return wproxy;},toggleAttribute: function () {return wproxy;},setAttribute: function () {return wproxy;},setAttributeNS: function () {return wproxy;},removeAttribute: function () {return wproxy;},removeAttributeNS: function () {return wproxy;},hasAttribute: function () {return wproxy;},hasAttributeNS: function () {return wproxy;},hasAttributes: function () {return wproxy;},closest: function () {return wproxy;},matches: function () {return wproxy;},webkitMatchesSelector: function () {return wproxy;},getElementsByTagName: function () {return wproxy;},getElementsByTagNameNS: function () {return wproxy;},getElementsByClassName: function () {return wproxy;},insertAdjacentElement: function () {return wproxy;},insertAdjacentText: function () {return wproxy;},mozMatchesSelector: function () {return wproxy;},setPointerCapture: function () {return wproxy;},releasePointerCapture: function () {return wproxy;},hasPointerCapture: function () {return wproxy;},setCapture: function () {return wproxy;},releaseCapture: function () {return wproxy;},getAttributeNode: function () {return wproxy;},setAttributeNode: function () {return wproxy;},removeAttributeNode: function () {return wproxy;},getAttributeNodeNS: function () {return wproxy;},setAttributeNodeNS: function () {return wproxy;},getClientRects: function () {return wproxy;},getBoundingClientRect: function () {return wproxy;},scrollIntoView: function () {return wproxy;},scroll: function () {return wproxy;},scrollTo: function () {return wproxy;},scrollBy: function () {return wproxy;},insertAdjacentHTML: function () {return wproxy;},querySelector: function () {return wproxy;},querySelectorAll: function () {return wproxy;},attachShadow: function () {return wproxy;},requestFullscreen: function () {return wproxy;},mozRequestFullScreen: function () {return wproxy;},requestPointerLock: function () {return wproxy;},animate: function () {return wproxy;},getAnimations: function () {return wproxy;},before: function () {return wproxy;},after: function () {return wproxy;},replaceWith: function () {return wproxy;},remove: function () {return wproxy;},prepend: function () {return wproxy;},append: function () {return wproxy;},replaceChildren: function () {return wproxy;},namespaceURI:'',prefix: {},localName:'',tagName:'',id:'',className:'',classList: {},part: {},attributes: {},scrollTop:'',scrollLeft:'',scrollWidth:'',scrollHeight:'',clientTop:'',clientLeft:'',clientWidth:'',clientHeight:'',scrollTopMax:'',scrollLeftMax:'',innerHTML:'',outerHTML:'',shadowRoot: {},assignedSlot: {},slot:'',onfullscreenchange: {},onfullscreenerror: {},previousElementSibling: {},nextElementSibling: {},children: {},firstElementChild: {},lastElementChild: {},childElementCount:'',getRootNode: function () {return wproxy;},hasChildNodes: function () {return wproxy;},insertBefore: function () {return wproxy;},appendChild: function () {return wproxy;},replaceChild: function () {return wproxy;},removeChild: function () {return wproxy;},normalize: function () {return wproxy;},cloneNode: function () {return wproxy;},isSameNode: function () {return wproxy;},isEqualNode: function () {return wproxy;},compareDocumentPosition: function () {return wproxy;},contains: function () {return wproxy;},lookupPrefix: function () {return wproxy;},lookupNamespaceURI: function () {return wproxy;},isDefaultNamespace: function () {return wproxy;},nodeType:'',nodeName:'',baseURI:'',isConnected:'',ownerDocument: {},parentNode: {},parentElement: {},childNodes: {},firstChild: {},lastChild: {},previousSibling: {},nextSibling: {},nodeValue: {},textContent:'',ELEMENT_NODE:'',ATTRIBUTE_NODE:'',TEXT_NODE:'',CDATA_SECTION_NODE:'',ENTITY_REFERENCE_NODE:'',ENTITY_NODE:'',PROCESSING_INSTRUCTION_NODE:'',COMMENT_NODE:'',DOCUMENT_NODE:'',DOCUMENT_TYPE_NODE:'',DOCUMENT_FRAGMENT_NODE:'',NOTATION_NODE:'',DOCUMENT_POSITION_DISCONNECTED:'',DOCUMENT_POSITION_PRECEDING:'',DOCUMENT_POSITION_FOLLOWING:'',DOCUMENT_POSITION_CONTAINS:'',DOCUMENT_POSITION_CONTAINED_BY:'',DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:'',addEventListener: function () {return wproxy;},removeEventListener: function () {return wproxy;},dispatchEvent: function () {return wproxy;},};
document.images = {item: function () {return wproxy;},namedItem: function () {return wproxy;},length:'',};
document.embeds = {item: function () {return wproxy;},namedItem: function () {return wproxy;},length:'',};
document.plugins = {item: function () {return wproxy;},namedItem: function () {return wproxy;},length:'',};
document.links = {item: function () {return wproxy;},namedItem: function () {return wproxy;},length:'',};
document.forms = {0: {},item: function () {return wproxy;},namedItem: function () {return wproxy;},length:'',};
document.scripts = {0: {},1: {},2: {},3: {},4: {},5: {},6: {},7: {},item: function () {return wproxy;},namedItem: function () {return wproxy;},length:'',};
document.defaultView = {close: function () {return wproxy;},stop: function () {return wproxy;},focus: function () {return wproxy;},blur: function () {return wproxy;},open: function () {return wproxy;},alert: function () {return wproxy;},confirm: function () {return wproxy;},prompt: function () {return wproxy;},print: function () {return wproxy;},postMessage: function () {return wproxy;},captureEvents: function () {return wproxy;},releaseEvents: function () {return wproxy;},getSelection: function () {return wproxy;},getComputedStyle: function () {return wproxy;},matchMedia: function () {return wproxy;},moveTo: function () {return wproxy;},moveBy: function () {return wproxy;},resizeTo: function () {return wproxy;},resizeBy: function () {return wproxy;},scroll: function () {return wproxy;},scrollTo: function () {return wproxy;},scrollBy: function () {return wproxy;},getDefaultComputedStyle: function () {return wproxy;},scrollByLines: function () {return wproxy;},scrollByPages: function () {return wproxy;},sizeToContent: function () {return wproxy;},updateCommands: function () {return wproxy;},find: function () {return wproxy;},dump: function () {return wproxy;},setResizable: function () {return wproxy;},requestIdleCallback: function () {return wproxy;},cancelIdleCallback: function () {return wproxy;},requestAnimationFrame: function () {return wproxy;},cancelAnimationFrame: function () {return wproxy;},reportError: function () {return wproxy;},btoa: function () {return wproxy;},atob: function () {return wproxy;},setTimeout: function () {return wproxy;},clearTimeout: function () {return wproxy;},setInterval: function () {return wproxy;},clearInterval: function () {return wproxy;},queueMicrotask: function () {return wproxy;},createImageBitmap: function () {return wproxy;},structuredClone: function () {return wproxy;},fetch: function () {return wproxy;},self: {},name:'',history: {},customElements: {},locationbar: {},menubar: {},personalbar: {},scrollbars: {},statusbar: {},toolbar: {},status:'',closed:'',event:'',frames: {},length:'',opener: {},parent: {},frameElement: {},navigator: {},clientInformation: {},external: {},applicationCache: {},screen: {},innerWidth:'',innerHeight:'',scrollX:'',pageXOffset:'',scrollY:'',pageYOffset:'',screenLeft:'',screenTop:'',screenX:'',screenY:'',outerWidth:'',outerHeight:'',performance: {},mozInnerScreenX:'',mozInnerScreenY:'',devicePixelRatio:'',scrollMaxX:'',scrollMaxY:'',fullScreen:'',ondevicemotion: {},ondeviceorientation: {},onabsolutedeviceorientation: {},InstallTrigger: {},visualViewport: {},crypto: {},onabort: {},onblur: {},onfocus: {},onauxclick: {},onbeforeinput: {},oncanplay: {},oncanplaythrough: {},onchange: {},onclick: {},onclose: {},oncontextmenu: {},oncuechange: {},ondblclick: {},ondrag: {},ondragend: {},ondragenter: {},ondragexit: {},ondragleave: {},ondragover: {},ondragstart: {},ondrop: {},ondurationchange: {},onemptied: {},onended: {},onformdata: {},oninput: {},oninvalid: {},onkeydown: {},onkeypress: {},onkeyup: {},onload: function () {return wproxy;},onloadeddata: {},onloadedmetadata: {},onloadend: {},onloadstart: {},onmousedown: {},onmouseenter: {},onmouseleave: {},onmousemove: {},onmouseout: {},onmouseover: {},onmouseup: {},onwheel: {},onpause: {},onplay: {},onplaying: {},onprogress: {},onratechange: {},onreset: {},onresize: function () {return wproxy;},onscroll: function () {return wproxy;},onsecuritypolicyviolation: {},onseeked: {},onseeking: {},onselect: {},onslotchange: {},onstalled: {},onsubmit: {},onsuspend: {},ontimeupdate: {},onvolumechange: {},onwaiting: {},onselectstart: {},onselectionchange: {},ontoggle: {},onpointercancel: {},onpointerdown: {},onpointerup: {},onpointermove: {},onpointerout: {},onpointerover: {},onpointerenter: {},onpointerleave: {},ongotpointercapture: {},onlostpointercapture: {},onmozfullscreenchange: {},onmozfullscreenerror: {},onanimationcancel: {},onanimationend: {},onanimationiteration: {},onanimationstart: {},ontransitioncancel: {},ontransitionend: {},ontransitionrun: {},ontransitionstart: {},onwebkitanimationend: {},onwebkitanimationiteration: {},onwebkitanimationstart: {},onwebkittransitionend: {},u2f: {},onerror: {},speechSynthesis: {},onafterprint: {},onbeforeprint: {},onbeforeunload: {},onhashchange: function () {return wproxy;},onlanguagechange: {},onmessage: {},onmessageerror: {},onoffline: {},ononline: {},onpagehide: {},onpageshow: function () {return wproxy;},onpopstate: {},onrejectionhandled: {},onstorage: {},onunhandledrejection: {},onunload: function () {return wproxy;},ongamepadconnected: {},ongamepaddisconnected: {},localStorage: {},origin:'',crossOriginIsolated:'',isSecureContext:'',indexedDB: {},caches: {},sessionStorage: {},window: {},document: {},location: {},top: {},_import: function () {return wproxy;},require: function () {return wproxy;},__prepath__:'',unalert: function () {return wproxy;},alertError: function () {return wproxy;},notify: function () {return wproxy;},notice: function () {return wproxy;},notifyError: function () {return wproxy;},unprompt: function () {return wproxy;},notifyTop: function () {return wproxy;},notifyLight: function () {return wproxy;},notifyTopError: function () {return wproxy;},notifyOnly: function () {return wproxy;},unnotify: function () {return wproxy;},promptMiddle: function () {return wproxy;},promptTop: function () {return wproxy;},promptGlass: function () {return wproxy;},promptTopGlass: function () {return wproxy;},promptTopDark: function () {return wproxy;},promptMiddleGlass: function () {return wproxy;},promptDark: function () {return wproxy;},promptMiddleDark: function () {return wproxy;},acover: function () {return wproxy;},coverShadow: function () {return wproxy;},uncover: function () {return wproxy;},uncoverShadow: function () {return wproxy;},setCoverText: function () {return wproxy;},apicall: function () {return wproxy;},initPages: function () {return wproxy;},jump_page_forward:'',addEventListener: function () {return wproxy;},removeEventListener: function () {return wproxy;},dispatchEvent: function () {return wproxy;},};
document.designMode = 'off';
document.onreadystatechange = {};
document.onbeforescriptexecute = {};
document.onafterscriptexecute = {};
document.currentScript = {};
document.fgColor = '';
document.linkColor = '';
document.vlinkColor = '';
document.alinkColor = '';
document.bgColor = '';
document.anchors = {item: function () {return wproxy;},namedItem: function () {return wproxy;},length:'',};
document.applets = {item: function () {return wproxy;},namedItem: function () {return wproxy;},length:'',};
document.all = [];
document.fullscreen = false;
document.mozFullScreen = false;
document.fullscreenEnabled = true;
document.mozFullScreenEnabled = true;
document.onfullscreenchange = {};
document.onfullscreenerror = {};
document.onpointerlockchange = {};
document.onpointerlockerror = {};
document.hidden = false;
document.visibilityState = 'visible';
document.onvisibilitychange = {};
document.selectedStyleSheetSet = {};
document.lastStyleSheetSet = {};
document.preferredStyleSheetSet = '';
document.styleSheetSets = {item: function () {return wproxy;},contains: function () {return wproxy;},length:'',};
document.scrollingElement = {version:'',click: function () {return wproxy;},attachInternals: function () {return wproxy;},focus: function () {return wproxy;},blur: function () {return wproxy;},title:'',lang:'',dir:'',innerText:'',outerText:'',hidden:'',accessKey:'',accessKeyLabel:'',draggable:'',contentEditable:'',isContentEditable:'',spellcheck:'',inputMode:'',enterKeyHint:'',nonce:'',offsetParent: {},offsetTop:'',offsetLeft:'',offsetWidth:'',offsetHeight:'',oncopy: {},oncut: {},onpaste: {},style: {},onabort: {},onblur: {},onfocus: {},onauxclick: {},onbeforeinput: {},oncanplay: {},oncanplaythrough: {},onchange: {},onclick: {},onclose: {},oncontextmenu: {},oncuechange: {},ondblclick: {},ondrag: {},ondragend: {},ondragenter: {},ondragexit: {},ondragleave: {},ondragover: {},ondragstart: {},ondrop: {},ondurationchange: {},onemptied: {},onended: {},onformdata: {},oninput: {},oninvalid: {},onkeydown: {},onkeypress: {},onkeyup: {},onload: {},onloadeddata: {},onloadedmetadata: {},onloadend: {},onloadstart: {},onmousedown: {},onmouseenter: {},onmouseleave: {},onmousemove: {},onmouseout: {},onmouseover: {},onmouseup: {},onwheel: {},onpause: {},onplay: {},onplaying: {},onprogress: {},onratechange: {},onreset: {},onresize: {},onscroll: {},onsecuritypolicyviolation: {},onseeked: {},onseeking: {},onselect: {},onslotchange: {},onstalled: {},onsubmit: {},onsuspend: {},ontimeupdate: {},onvolumechange: {},onwaiting: {},onselectstart: {},onselectionchange: {},ontoggle: {},onpointercancel: {},onpointerdown: {},onpointerup: {},onpointermove: {},onpointerout: {},onpointerover: {},onpointerenter: {},onpointerleave: {},ongotpointercapture: {},onlostpointercapture: {},onmozfullscreenchange: {},onmozfullscreenerror: {},onanimationcancel: {},onanimationend: {},onanimationiteration: {},onanimationstart: {},ontransitioncancel: {},ontransitionend: {},ontransitionrun: {},ontransitionstart: {},onwebkitanimationend: {},onwebkitanimationiteration: {},onwebkitanimationstart: {},onwebkittransitionend: {},dataset: {},tabIndex:'',onerror: {},getAttributeNames: function () {return wproxy;},getAttribute: function () {return wproxy;},getAttributeNS: function () {return wproxy;},toggleAttribute: function () {return wproxy;},setAttribute: function () {return wproxy;},setAttributeNS: function () {return wproxy;},removeAttribute: function () {return wproxy;},removeAttributeNS: function () {return wproxy;},hasAttribute: function () {return wproxy;},hasAttributeNS: function () {return wproxy;},hasAttributes: function () {return wproxy;},closest: function () {return wproxy;},matches: function () {return wproxy;},webkitMatchesSelector: function () {return wproxy;},getElementsByTagName: function () {return wproxy;},getElementsByTagNameNS: function () {return wproxy;},getElementsByClassName: function () {return wproxy;},insertAdjacentElement: function () {return wproxy;},insertAdjacentText: function () {return wproxy;},mozMatchesSelector: function () {return wproxy;},setPointerCapture: function () {return wproxy;},releasePointerCapture: function () {return wproxy;},hasPointerCapture: function () {return wproxy;},setCapture: function () {return wproxy;},releaseCapture: function () {return wproxy;},getAttributeNode: function () {return wproxy;},setAttributeNode: function () {return wproxy;},removeAttributeNode: function () {return wproxy;},getAttributeNodeNS: function () {return wproxy;},setAttributeNodeNS: function () {return wproxy;},getClientRects: function () {return wproxy;},getBoundingClientRect: function () {return wproxy;},scrollIntoView: function () {return wproxy;},scroll: function () {return wproxy;},scrollTo: function () {return wproxy;},scrollBy: function () {return wproxy;},insertAdjacentHTML: function () {return wproxy;},querySelector: function () {return wproxy;},querySelectorAll: function () {return wproxy;},attachShadow: function () {return wproxy;},requestFullscreen: function () {return wproxy;},mozRequestFullScreen: function () {return wproxy;},requestPointerLock: function () {return wproxy;},animate: function () {return wproxy;},getAnimations: function () {return wproxy;},before: function () {return wproxy;},after: function () {return wproxy;},replaceWith: function () {return wproxy;},remove: function () {return wproxy;},prepend: function () {return wproxy;},append: function () {return wproxy;},replaceChildren: function () {return wproxy;},namespaceURI:'',prefix: {},localName:'',tagName:'',id:'',className:'',classList: {},part: {},attributes: {},scrollTop:'',scrollLeft:'',scrollWidth:'',scrollHeight:'',clientTop:'',clientLeft:'',clientWidth:'',clientHeight:'',scrollTopMax:'',scrollLeftMax:'',innerHTML:'',outerHTML:'',shadowRoot: {},assignedSlot: {},slot:'',onfullscreenchange: {},onfullscreenerror: {},previousElementSibling: {},nextElementSibling: {},children: {},firstElementChild: {},lastElementChild: {},childElementCount:'',getRootNode: function () {return wproxy;},hasChildNodes: function () {return wproxy;},insertBefore: function () {return wproxy;},appendChild: function () {return wproxy;},replaceChild: function () {return wproxy;},removeChild: function () {return wproxy;},normalize: function () {return wproxy;},cloneNode: function () {return wproxy;},isSameNode: function () {return wproxy;},isEqualNode: function () {return wproxy;},compareDocumentPosition: function () {return wproxy;},contains: function () {return wproxy;},lookupPrefix: function () {return wproxy;},lookupNamespaceURI: function () {return wproxy;},isDefaultNamespace: function () {return wproxy;},nodeType:'',nodeName:'',baseURI:'',isConnected:'',ownerDocument: {},parentNode: {},parentElement: {},childNodes: {},firstChild: {},lastChild: {},previousSibling: {},nextSibling: {},nodeValue: {},textContent:'',ELEMENT_NODE:'',ATTRIBUTE_NODE:'',TEXT_NODE:'',CDATA_SECTION_NODE:'',ENTITY_REFERENCE_NODE:'',ENTITY_NODE:'',PROCESSING_INSTRUCTION_NODE:'',COMMENT_NODE:'',DOCUMENT_NODE:'',DOCUMENT_TYPE_NODE:'',DOCUMENT_FRAGMENT_NODE:'',NOTATION_NODE:'',DOCUMENT_POSITION_DISCONNECTED:'',DOCUMENT_POSITION_PRECEDING:'',DOCUMENT_POSITION_FOLLOWING:'',DOCUMENT_POSITION_CONTAINS:'',DOCUMENT_POSITION_CONTAINED_BY:'',DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:'',addEventListener: function () {return wproxy;},removeEventListener: function () {return wproxy;},dispatchEvent: function () {return wproxy;},};
document.timeline = {currentTime:'',};
document.rootElement = {};
document.oncopy = {};
document.oncut = {};
document.onpaste = {};
document.activeElement = {text:'',link:'',vLink:'',aLink:'',bgColor:'',background:'',onafterprint: {},onbeforeprint: {},onbeforeunload: {},onhashchange: function () {return wproxy;},onlanguagechange: {},onmessage: {},onmessageerror: {},onoffline: {},ononline: {},onpagehide: {},onpageshow: function () {return wproxy;},onpopstate: {},onrejectionhandled: {},onstorage: {},onunhandledrejection: {},onunload: function () {return wproxy;},ongamepadconnected: {},ongamepaddisconnected: {},click: function () {return wproxy;},attachInternals: function () {return wproxy;},focus: function () {return wproxy;},blur: function () {return wproxy;},title:'',lang:'',dir:'',innerText:'',outerText:'',hidden:'',accessKey:'',accessKeyLabel:'',draggable:'',contentEditable:'',isContentEditable:'',spellcheck:'',inputMode:'',enterKeyHint:'',nonce:'',offsetParent: {},offsetTop:'',offsetLeft:'',offsetWidth:'',offsetHeight:'',oncopy: {},oncut: {},onpaste: {},style: {},onabort: {},onblur: {},onfocus: {},onauxclick: {},onbeforeinput: {},oncanplay: {},oncanplaythrough: {},onchange: {},onclick: {},onclose: {},oncontextmenu: {},oncuechange: {},ondblclick: {},ondrag: {},ondragend: {},ondragenter: {},ondragexit: {},ondragleave: {},ondragover: {},ondragstart: {},ondrop: {},ondurationchange: {},onemptied: {},onended: {},onformdata: {},oninput: {},oninvalid: {},onkeydown: {},onkeypress: {},onkeyup: {},onload: function () {return wproxy;},onloadeddata: {},onloadedmetadata: {},onloadend: {},onloadstart: {},onmousedown: {},onmouseenter: {},onmouseleave: {},onmousemove: {},onmouseout: {},onmouseover: {},onmouseup: {},onwheel: {},onpause: {},onplay: {},onplaying: {},onprogress: {},onratechange: {},onreset: {},onresize: function () {return wproxy;},onscroll: function () {return wproxy;},onsecuritypolicyviolation: {},onseeked: {},onseeking: {},onselect: {},onslotchange: {},onstalled: {},onsubmit: {},onsuspend: {},ontimeupdate: {},onvolumechange: {},onwaiting: {},onselectstart: {},onselectionchange: {},ontoggle: {},onpointercancel: {},onpointerdown: {},onpointerup: {},onpointermove: {},onpointerout: {},onpointerover: {},onpointerenter: {},onpointerleave: {},ongotpointercapture: {},onlostpointercapture: {},onmozfullscreenchange: {},onmozfullscreenerror: {},onanimationcancel: {},onanimationend: {},onanimationiteration: {},onanimationstart: {},ontransitioncancel: {},ontransitionend: {},ontransitionrun: {},ontransitionstart: {},onwebkitanimationend: {},onwebkitanimationiteration: {},onwebkitanimationstart: {},onwebkittransitionend: {},dataset: {},tabIndex:'',onerror: {},getAttributeNames: function () {return wproxy;},getAttribute: function () {return wproxy;},getAttributeNS: function () {return wproxy;},toggleAttribute: function () {return wproxy;},setAttribute: function () {return wproxy;},setAttributeNS: function () {return wproxy;},removeAttribute: function () {return wproxy;},removeAttributeNS: function () {return wproxy;},hasAttribute: function () {return wproxy;},hasAttributeNS: function () {return wproxy;},hasAttributes: function () {return wproxy;},closest: function () {return wproxy;},matches: function () {return wproxy;},webkitMatchesSelector: function () {return wproxy;},getElementsByTagName: function () {return wproxy;},getElementsByTagNameNS: function () {return wproxy;},getElementsByClassName: function () {return wproxy;},insertAdjacentElement: function () {return wproxy;},insertAdjacentText: function () {return wproxy;},mozMatchesSelector: function () {return wproxy;},setPointerCapture: function () {return wproxy;},releasePointerCapture: function () {return wproxy;},hasPointerCapture: function () {return wproxy;},setCapture: function () {return wproxy;},releaseCapture: function () {return wproxy;},getAttributeNode: function () {return wproxy;},setAttributeNode: function () {return wproxy;},removeAttributeNode: function () {return wproxy;},getAttributeNodeNS: function () {return wproxy;},setAttributeNodeNS: function () {return wproxy;},getClientRects: function () {return wproxy;},getBoundingClientRect: function () {return wproxy;},scrollIntoView: function () {return wproxy;},scroll: function () {return wproxy;},scrollTo: function () {return wproxy;},scrollBy: function () {return wproxy;},insertAdjacentHTML: function () {return wproxy;},querySelector: function () {return wproxy;},querySelectorAll: function () {return wproxy;},attachShadow: function () {return wproxy;},requestFullscreen: function () {return wproxy;},mozRequestFullScreen: function () {return wproxy;},requestPointerLock: function () {return wproxy;},animate: function () {return wproxy;},getAnimations: function () {return wproxy;},before: function () {return wproxy;},after: function () {return wproxy;},replaceWith: function () {return wproxy;},remove: function () {return wproxy;},prepend: function () {return wproxy;},append: function () {return wproxy;},replaceChildren: function () {return wproxy;},namespaceURI:'',prefix: {},localName:'',tagName:'',id:'',className:'',classList: {},part: {},attributes: {},scrollTop:'',scrollLeft:'',scrollWidth:'',scrollHeight:'',clientTop:'',clientLeft:'',clientWidth:'',clientHeight:'',scrollTopMax:'',scrollLeftMax:'',innerHTML:'',outerHTML:'',shadowRoot: {},assignedSlot: {},slot:'',onfullscreenchange: {},onfullscreenerror: {},previousElementSibling: {},nextElementSibling: {},children: {},firstElementChild: {},lastElementChild: {},childElementCount:'',getRootNode: function () {return wproxy;},hasChildNodes: function () {return wproxy;},insertBefore: function () {return wproxy;},appendChild: function () {return wproxy;},replaceChild: function () {return wproxy;},removeChild: function () {return wproxy;},normalize: function () {return wproxy;},cloneNode: function () {return wproxy;},isSameNode: function () {return wproxy;},isEqualNode: function () {return wproxy;},compareDocumentPosition: function () {return wproxy;},contains: function () {return wproxy;},lookupPrefix: function () {return wproxy;},lookupNamespaceURI: function () {return wproxy;},isDefaultNamespace: function () {return wproxy;},nodeType:'',nodeName:'',baseURI:'',isConnected:'',ownerDocument: {},parentNode: {},parentElement: {},childNodes: {},firstChild: {},lastChild: {},previousSibling: {},nextSibling: {},nodeValue: {},textContent:'',ELEMENT_NODE:'',ATTRIBUTE_NODE:'',TEXT_NODE:'',CDATA_SECTION_NODE:'',ENTITY_REFERENCE_NODE:'',ENTITY_NODE:'',PROCESSING_INSTRUCTION_NODE:'',COMMENT_NODE:'',DOCUMENT_NODE:'',DOCUMENT_TYPE_NODE:'',DOCUMENT_FRAGMENT_NODE:'',NOTATION_NODE:'',DOCUMENT_POSITION_DISCONNECTED:'',DOCUMENT_POSITION_PRECEDING:'',DOCUMENT_POSITION_FOLLOWING:'',DOCUMENT_POSITION_CONTAINS:'',DOCUMENT_POSITION_CONTAINED_BY:'',DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:'',addEventListener: function () {return wproxy;},removeEventListener: function () {return wproxy;},dispatchEvent: function () {return wproxy;},};
document.styleSheets = {0: {},1: {},2: {},3: {},4: {},5: {},6: {},7: {},8: {},item: function () {return wproxy;},length:'',};
document.pointerLockElement = {};
document.fullscreenElement = {};
document.mozFullScreenElement = {};
document.adoptedStyleSheets = [];
document.fonts = {add: function () {return wproxy;},has: function () {return wproxy;},delete: function () {return wproxy;},clear: function () {return wproxy;},entries: function () {return wproxy;},values: function () {return wproxy;},forEach: function () {return wproxy;},load: function () {return wproxy;},check: function () {return wproxy;},size:'',onloading: {},onloadingdone: {},onloadingerror: {},ready: {},status:'',keys: function () {return wproxy;},addEventListener: function () {return wproxy;},removeEventListener: function () {return wproxy;},dispatchEvent: function () {return wproxy;},};
document.onabort = {};
document.onblur = {};
document.onfocus = {};
document.onauxclick = {};
document.onbeforeinput = {};
document.oncanplay = {};
document.oncanplaythrough = {};
document.onchange = {};
document.onclick = {};
document.onclose = {};
document.oncontextmenu = {};
document.oncuechange = {};
document.ondblclick = {};
document.ondrag = {};
document.ondragend = {};
document.ondragenter = {};
document.ondragexit = {};
document.ondragleave = {};
document.ondragover = {};
document.ondragstart = {};
document.ondrop = {};
document.ondurationchange = {};
document.onemptied = {};
document.onended = {};
document.onformdata = {};
document.oninput = {};
document.oninvalid = {};
document.onkeydown = {};
document.onkeypress = {};
document.onkeyup = {};
document.onload = {};
document.onloadeddata = {};
document.onloadedmetadata = {};
document.onloadend = {};
document.onloadstart = {};
document.onmousedown = {};
document.onmouseenter = {};
document.onmouseleave = {};
document.onmousemove = {};
document.onmouseout = {};
document.onmouseover = {};
document.onmouseup = {};
document.onwheel = {};
document.onpause = {};
document.onplay = {};
document.onplaying = {};
document.onprogress = {};
document.onratechange = {};
document.onreset = {};
document.onresize = {};
document.onscroll = {};
document.onsecuritypolicyviolation = {};
document.onseeked = {};
document.onseeking = {};
document.onselect = {};
document.onslotchange = {};
document.onstalled = {};
document.onsubmit = {};
document.onsuspend = {};
document.ontimeupdate = {};
document.onvolumechange = {};
document.onwaiting = {};
document.onselectstart = {};
document.onselectionchange = {};
document.ontoggle = {};
document.onpointercancel = {};
document.onpointerdown = {};
document.onpointerup = {};
document.onpointermove = {};
document.onpointerout = {};
document.onpointerover = {};
document.onpointerenter = {};
document.onpointerleave = {};
document.ongotpointercapture = {};
document.onlostpointercapture = {};
document.onmozfullscreenchange = {};
document.onmozfullscreenerror = {};
document.onanimationcancel = {};
document.onanimationend = {};
document.onanimationiteration = {};
document.onanimationstart = {};
document.ontransitioncancel = {};
document.ontransitionend = {};
document.ontransitionrun = {};
document.ontransitionstart = {};
document.onwebkitanimationend = {};
document.onwebkitanimationiteration = {};
document.onwebkitanimationstart = {};
document.onwebkittransitionend = {};
document.onerror = {};
document.children = {0: {},item: function () {return wproxy;},namedItem: function () {return wproxy;},length:'',};
document.firstElementChild = {version:'',click: function () {return wproxy;},attachInternals: function () {return wproxy;},focus: function () {return wproxy;},blur: function () {return wproxy;},title:'',lang:'',dir:'',innerText:'',outerText:'',hidden:'',accessKey:'',accessKeyLabel:'',draggable:'',contentEditable:'',isContentEditable:'',spellcheck:'',inputMode:'',enterKeyHint:'',nonce:'',offsetParent: {},offsetTop:'',offsetLeft:'',offsetWidth:'',offsetHeight:'',oncopy: {},oncut: {},onpaste: {},style: {},onabort: {},onblur: {},onfocus: {},onauxclick: {},onbeforeinput: {},oncanplay: {},oncanplaythrough: {},onchange: {},onclick: {},onclose: {},oncontextmenu: {},oncuechange: {},ondblclick: {},ondrag: {},ondragend: {},ondragenter: {},ondragexit: {},ondragleave: {},ondragover: {},ondragstart: {},ondrop: {},ondurationchange: {},onemptied: {},onended: {},onformdata: {},oninput: {},oninvalid: {},onkeydown: {},onkeypress: {},onkeyup: {},onload: {},onloadeddata: {},onloadedmetadata: {},onloadend: {},onloadstart: {},onmousedown: {},onmouseenter: {},onmouseleave: {},onmousemove: {},onmouseout: {},onmouseover: {},onmouseup: {},onwheel: {},onpause: {},onplay: {},onplaying: {},onprogress: {},onratechange: {},onreset: {},onresize: {},onscroll: {},onsecuritypolicyviolation: {},onseeked: {},onseeking: {},onselect: {},onslotchange: {},onstalled: {},onsubmit: {},onsuspend: {},ontimeupdate: {},onvolumechange: {},onwaiting: {},onselectstart: {},onselectionchange: {},ontoggle: {},onpointercancel: {},onpointerdown: {},onpointerup: {},onpointermove: {},onpointerout: {},onpointerover: {},onpointerenter: {},onpointerleave: {},ongotpointercapture: {},onlostpointercapture: {},onmozfullscreenchange: {},onmozfullscreenerror: {},onanimationcancel: {},onanimationend: {},onanimationiteration: {},onanimationstart: {},ontransitioncancel: {},ontransitionend: {},ontransitionrun: {},ontransitionstart: {},onwebkitanimationend: {},onwebkitanimationiteration: {},onwebkitanimationstart: {},onwebkittransitionend: {},dataset: {},tabIndex:'',onerror: {},getAttributeNames: function () {return wproxy;},getAttribute: function () {return wproxy;},getAttributeNS: function () {return wproxy;},toggleAttribute: function () {return wproxy;},setAttribute: function () {return wproxy;},setAttributeNS: function () {return wproxy;},removeAttribute: function () {return wproxy;},removeAttributeNS: function () {return wproxy;},hasAttribute: function () {return wproxy;},hasAttributeNS: function () {return wproxy;},hasAttributes: function () {return wproxy;},closest: function () {return wproxy;},matches: function () {return wproxy;},webkitMatchesSelector: function () {return wproxy;},getElementsByTagName: function () {return wproxy;},getElementsByTagNameNS: function () {return wproxy;},getElementsByClassName: function () {return wproxy;},insertAdjacentElement: function () {return wproxy;},insertAdjacentText: function () {return wproxy;},mozMatchesSelector: function () {return wproxy;},setPointerCapture: function () {return wproxy;},releasePointerCapture: function () {return wproxy;},hasPointerCapture: function () {return wproxy;},setCapture: function () {return wproxy;},releaseCapture: function () {return wproxy;},getAttributeNode: function () {return wproxy;},setAttributeNode: function () {return wproxy;},removeAttributeNode: function () {return wproxy;},getAttributeNodeNS: function () {return wproxy;},setAttributeNodeNS: function () {return wproxy;},getClientRects: function () {return wproxy;},getBoundingClientRect: function () {return wproxy;},scrollIntoView: function () {return wproxy;},scroll: function () {return wproxy;},scrollTo: function () {return wproxy;},scrollBy: function () {return wproxy;},insertAdjacentHTML: function () {return wproxy;},querySelector: function () {return wproxy;},querySelectorAll: function () {return wproxy;},attachShadow: function () {return wproxy;},requestFullscreen: function () {return wproxy;},mozRequestFullScreen: function () {return wproxy;},requestPointerLock: function () {return wproxy;},animate: function () {return wproxy;},getAnimations: function () {return wproxy;},before: function () {return wproxy;},after: function () {return wproxy;},replaceWith: function () {return wproxy;},remove: function () {return wproxy;},prepend: function () {return wproxy;},append: function () {return wproxy;},replaceChildren: function () {return wproxy;},namespaceURI:'',prefix: {},localName:'',tagName:'',id:'',className:'',classList: {},part: {},attributes: {},scrollTop:'',scrollLeft:'',scrollWidth:'',scrollHeight:'',clientTop:'',clientLeft:'',clientWidth:'',clientHeight:'',scrollTopMax:'',scrollLeftMax:'',innerHTML:'',outerHTML:'',shadowRoot: {},assignedSlot: {},slot:'',onfullscreenchange: {},onfullscreenerror: {},previousElementSibling: {},nextElementSibling: {},children: {},firstElementChild: {},lastElementChild: {},childElementCount:'',getRootNode: function () {return wproxy;},hasChildNodes: function () {return wproxy;},insertBefore: function () {return wproxy;},appendChild: function () {return wproxy;},replaceChild: function () {return wproxy;},removeChild: function () {return wproxy;},normalize: function () {return wproxy;},cloneNode: function () {return wproxy;},isSameNode: function () {return wproxy;},isEqualNode: function () {return wproxy;},compareDocumentPosition: function () {return wproxy;},contains: function () {return wproxy;},lookupPrefix: function () {return wproxy;},lookupNamespaceURI: function () {return wproxy;},isDefaultNamespace: function () {return wproxy;},nodeType:'',nodeName:'',baseURI:'',isConnected:'',ownerDocument: {},parentNode: {},parentElement: {},childNodes: {},firstChild: {},lastChild: {},previousSibling: {},nextSibling: {},nodeValue: {},textContent:'',ELEMENT_NODE:'',ATTRIBUTE_NODE:'',TEXT_NODE:'',CDATA_SECTION_NODE:'',ENTITY_REFERENCE_NODE:'',ENTITY_NODE:'',PROCESSING_INSTRUCTION_NODE:'',COMMENT_NODE:'',DOCUMENT_NODE:'',DOCUMENT_TYPE_NODE:'',DOCUMENT_FRAGMENT_NODE:'',NOTATION_NODE:'',DOCUMENT_POSITION_DISCONNECTED:'',DOCUMENT_POSITION_PRECEDING:'',DOCUMENT_POSITION_FOLLOWING:'',DOCUMENT_POSITION_CONTAINS:'',DOCUMENT_POSITION_CONTAINED_BY:'',DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:'',addEventListener: function () {return wproxy;},removeEventListener: function () {return wproxy;},dispatchEvent: function () {return wproxy;},};
document.lastElementChild = {version:'',click: function () {return wproxy;},attachInternals: function () {return wproxy;},focus: function () {return wproxy;},blur: function () {return wproxy;},title:'',lang:'',dir:'',innerText:'',outerText:'',hidden:'',accessKey:'',accessKeyLabel:'',draggable:'',contentEditable:'',isContentEditable:'',spellcheck:'',inputMode:'',enterKeyHint:'',nonce:'',offsetParent: {},offsetTop:'',offsetLeft:'',offsetWidth:'',offsetHeight:'',oncopy: {},oncut: {},onpaste: {},style: {},onabort: {},onblur: {},onfocus: {},onauxclick: {},onbeforeinput: {},oncanplay: {},oncanplaythrough: {},onchange: {},onclick: {},onclose: {},oncontextmenu: {},oncuechange: {},ondblclick: {},ondrag: {},ondragend: {},ondragenter: {},ondragexit: {},ondragleave: {},ondragover: {},ondragstart: {},ondrop: {},ondurationchange: {},onemptied: {},onended: {},onformdata: {},oninput: {},oninvalid: {},onkeydown: {},onkeypress: {},onkeyup: {},onload: {},onloadeddata: {},onloadedmetadata: {},onloadend: {},onloadstart: {},onmousedown: {},onmouseenter: {},onmouseleave: {},onmousemove: {},onmouseout: {},onmouseover: {},onmouseup: {},onwheel: {},onpause: {},onplay: {},onplaying: {},onprogress: {},onratechange: {},onreset: {},onresize: {},onscroll: {},onsecuritypolicyviolation: {},onseeked: {},onseeking: {},onselect: {},onslotchange: {},onstalled: {},onsubmit: {},onsuspend: {},ontimeupdate: {},onvolumechange: {},onwaiting: {},onselectstart: {},onselectionchange: {},ontoggle: {},onpointercancel: {},onpointerdown: {},onpointerup: {},onpointermove: {},onpointerout: {},onpointerover: {},onpointerenter: {},onpointerleave: {},ongotpointercapture: {},onlostpointercapture: {},onmozfullscreenchange: {},onmozfullscreenerror: {},onanimationcancel: {},onanimationend: {},onanimationiteration: {},onanimationstart: {},ontransitioncancel: {},ontransitionend: {},ontransitionrun: {},ontransitionstart: {},onwebkitanimationend: {},onwebkitanimationiteration: {},onwebkitanimationstart: {},onwebkittransitionend: {},dataset: {},tabIndex:'',onerror: {},getAttributeNames: function () {return wproxy;},getAttribute: function () {return wproxy;},getAttributeNS: function () {return wproxy;},toggleAttribute: function () {return wproxy;},setAttribute: function () {return wproxy;},setAttributeNS: function () {return wproxy;},removeAttribute: function () {return wproxy;},removeAttributeNS: function () {return wproxy;},hasAttribute: function () {return wproxy;},hasAttributeNS: function () {return wproxy;},hasAttributes: function () {return wproxy;},closest: function () {return wproxy;},matches: function () {return wproxy;},webkitMatchesSelector: function () {return wproxy;},getElementsByTagName: function () {return wproxy;},getElementsByTagNameNS: function () {return wproxy;},getElementsByClassName: function () {return wproxy;},insertAdjacentElement: function () {return wproxy;},insertAdjacentText: function () {return wproxy;},mozMatchesSelector: function () {return wproxy;},setPointerCapture: function () {return wproxy;},releasePointerCapture: function () {return wproxy;},hasPointerCapture: function () {return wproxy;},setCapture: function () {return wproxy;},releaseCapture: function () {return wproxy;},getAttributeNode: function () {return wproxy;},setAttributeNode: function () {return wproxy;},removeAttributeNode: function () {return wproxy;},getAttributeNodeNS: function () {return wproxy;},setAttributeNodeNS: function () {return wproxy;},getClientRects: function () {return wproxy;},getBoundingClientRect: function () {return wproxy;},scrollIntoView: function () {return wproxy;},scroll: function () {return wproxy;},scrollTo: function () {return wproxy;},scrollBy: function () {return wproxy;},insertAdjacentHTML: function () {return wproxy;},querySelector: function () {return wproxy;},querySelectorAll: function () {return wproxy;},attachShadow: function () {return wproxy;},requestFullscreen: function () {return wproxy;},mozRequestFullScreen: function () {return wproxy;},requestPointerLock: function () {return wproxy;},animate: function () {return wproxy;},getAnimations: function () {return wproxy;},before: function () {return wproxy;},after: function () {return wproxy;},replaceWith: function () {return wproxy;},remove: function () {return wproxy;},prepend: function () {return wproxy;},append: function () {return wproxy;},replaceChildren: function () {return wproxy;},namespaceURI:'',prefix: {},localName:'',tagName:'',id:'',className:'',classList: {},part: {},attributes: {},scrollTop:'',scrollLeft:'',scrollWidth:'',scrollHeight:'',clientTop:'',clientLeft:'',clientWidth:'',clientHeight:'',scrollTopMax:'',scrollLeftMax:'',innerHTML:'',outerHTML:'',shadowRoot: {},assignedSlot: {},slot:'',onfullscreenchange: {},onfullscreenerror: {},previousElementSibling: {},nextElementSibling: {},children: {},firstElementChild: {},lastElementChild: {},childElementCount:'',getRootNode: function () {return wproxy;},hasChildNodes: function () {return wproxy;},insertBefore: function () {return wproxy;},appendChild: function () {return wproxy;},replaceChild: function () {return wproxy;},removeChild: function () {return wproxy;},normalize: function () {return wproxy;},cloneNode: function () {return wproxy;},isSameNode: function () {return wproxy;},isEqualNode: function () {return wproxy;},compareDocumentPosition: function () {return wproxy;},contains: function () {return wproxy;},lookupPrefix: function () {return wproxy;},lookupNamespaceURI: function () {return wproxy;},isDefaultNamespace: function () {return wproxy;},nodeType:'',nodeName:'',baseURI:'',isConnected:'',ownerDocument: {},parentNode: {},parentElement: {},childNodes: {},firstChild: {},lastChild: {},previousSibling: {},nextSibling: {},nodeValue: {},textContent:'',ELEMENT_NODE:'',ATTRIBUTE_NODE:'',TEXT_NODE:'',CDATA_SECTION_NODE:'',ENTITY_REFERENCE_NODE:'',ENTITY_NODE:'',PROCESSING_INSTRUCTION_NODE:'',COMMENT_NODE:'',DOCUMENT_NODE:'',DOCUMENT_TYPE_NODE:'',DOCUMENT_FRAGMENT_NODE:'',NOTATION_NODE:'',DOCUMENT_POSITION_DISCONNECTED:'',DOCUMENT_POSITION_PRECEDING:'',DOCUMENT_POSITION_FOLLOWING:'',DOCUMENT_POSITION_CONTAINS:'',DOCUMENT_POSITION_CONTAINED_BY:'',DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:'',addEventListener: function () {return wproxy;},removeEventListener: function () {return wproxy;},dispatchEvent: function () {return wproxy;},};
document.childElementCount = 1;
document.getRootNode = function () {return wproxy;};
document.hasChildNodes = function () {return wproxy;};
document.insertBefore = function () {return wproxy;};
document.appendChild = function () {return wproxy;};
document.replaceChild = function () {return wproxy;};
document.removeChild = function () {return wproxy;};
document.normalize = function () {return wproxy;};
document.cloneNode = function () {return wproxy;};
document.isSameNode = function () {return wproxy;};
document.isEqualNode = function () {return wproxy;};
document.compareDocumentPosition = function () {return wproxy;};
document.contains = function () {return wproxy;};
document.lookupPrefix = function () {return wproxy;};
document.lookupNamespaceURI = function () {return wproxy;};
document.isDefaultNamespace = function () {return wproxy;};
document.nodeType = 9;
document.nodeName = '#document';
document.baseURI = '';
document.isConnected = true;
document.ownerDocument = {};
document.parentNode = {};
document.parentElement = {};
document.childNodes = {0: {},1: {},item: function () {return wproxy;},keys: function () {return wproxy;},values: function () {return wproxy;},entries: function () {return wproxy;},forEach: function () {return wproxy;},length:'',};
document.firstChild = {before: function () {return wproxy;},after: function () {return wproxy;},replaceWith: function () {return wproxy;},remove: function () {return wproxy;},name:'',publicId:'',systemId:'',getRootNode: function () {return wproxy;},hasChildNodes: function () {return wproxy;},insertBefore: function () {return wproxy;},appendChild: function () {return wproxy;},replaceChild: function () {return wproxy;},removeChild: function () {return wproxy;},normalize: function () {return wproxy;},cloneNode: function () {return wproxy;},isSameNode: function () {return wproxy;},isEqualNode: function () {return wproxy;},compareDocumentPosition: function () {return wproxy;},contains: function () {return wproxy;},lookupPrefix: function () {return wproxy;},lookupNamespaceURI: function () {return wproxy;},isDefaultNamespace: function () {return wproxy;},nodeType:'',nodeName:'',baseURI:'',isConnected:'',ownerDocument: {},parentNode: {},parentElement: {},childNodes: {},firstChild: {},lastChild: {},previousSibling: {},nextSibling: {},nodeValue: {},textContent: {},ELEMENT_NODE:'',ATTRIBUTE_NODE:'',TEXT_NODE:'',CDATA_SECTION_NODE:'',ENTITY_REFERENCE_NODE:'',ENTITY_NODE:'',PROCESSING_INSTRUCTION_NODE:'',COMMENT_NODE:'',DOCUMENT_NODE:'',DOCUMENT_TYPE_NODE:'',DOCUMENT_FRAGMENT_NODE:'',NOTATION_NODE:'',DOCUMENT_POSITION_DISCONNECTED:'',DOCUMENT_POSITION_PRECEDING:'',DOCUMENT_POSITION_FOLLOWING:'',DOCUMENT_POSITION_CONTAINS:'',DOCUMENT_POSITION_CONTAINED_BY:'',DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:'',addEventListener: function () {return wproxy;},removeEventListener: function () {return wproxy;},dispatchEvent: function () {return wproxy;},};
document.lastChild = {version:'',click: function () {return wproxy;},attachInternals: function () {return wproxy;},focus: function () {return wproxy;},blur: function () {return wproxy;},title:'',lang:'',dir:'',innerText:'',outerText:'',hidden:'',accessKey:'',accessKeyLabel:'',draggable:'',contentEditable:'',isContentEditable:'',spellcheck:'',inputMode:'',enterKeyHint:'',nonce:'',offsetParent: {},offsetTop:'',offsetLeft:'',offsetWidth:'',offsetHeight:'',oncopy: {},oncut: {},onpaste: {},style: {},onabort: {},onblur: {},onfocus: {},onauxclick: {},onbeforeinput: {},oncanplay: {},oncanplaythrough: {},onchange: {},onclick: {},onclose: {},oncontextmenu: {},oncuechange: {},ondblclick: {},ondrag: {},ondragend: {},ondragenter: {},ondragexit: {},ondragleave: {},ondragover: {},ondragstart: {},ondrop: {},ondurationchange: {},onemptied: {},onended: {},onformdata: {},oninput: {},oninvalid: {},onkeydown: {},onkeypress: {},onkeyup: {},onload: {},onloadeddata: {},onloadedmetadata: {},onloadend: {},onloadstart: {},onmousedown: {},onmouseenter: {},onmouseleave: {},onmousemove: {},onmouseout: {},onmouseover: {},onmouseup: {},onwheel: {},onpause: {},onplay: {},onplaying: {},onprogress: {},onratechange: {},onreset: {},onresize: {},onscroll: {},onsecuritypolicyviolation: {},onseeked: {},onseeking: {},onselect: {},onslotchange: {},onstalled: {},onsubmit: {},onsuspend: {},ontimeupdate: {},onvolumechange: {},onwaiting: {},onselectstart: {},onselectionchange: {},ontoggle: {},onpointercancel: {},onpointerdown: {},onpointerup: {},onpointermove: {},onpointerout: {},onpointerover: {},onpointerenter: {},onpointerleave: {},ongotpointercapture: {},onlostpointercapture: {},onmozfullscreenchange: {},onmozfullscreenerror: {},onanimationcancel: {},onanimationend: {},onanimationiteration: {},onanimationstart: {},ontransitioncancel: {},ontransitionend: {},ontransitionrun: {},ontransitionstart: {},onwebkitanimationend: {},onwebkitanimationiteration: {},onwebkitanimationstart: {},onwebkittransitionend: {},dataset: {},tabIndex:'',onerror: {},getAttributeNames: function () {return wproxy;},getAttribute: function () {return wproxy;},getAttributeNS: function () {return wproxy;},toggleAttribute: function () {return wproxy;},setAttribute: function () {return wproxy;},setAttributeNS: function () {return wproxy;},removeAttribute: function () {return wproxy;},removeAttributeNS: function () {return wproxy;},hasAttribute: function () {return wproxy;},hasAttributeNS: function () {return wproxy;},hasAttributes: function () {return wproxy;},closest: function () {return wproxy;},matches: function () {return wproxy;},webkitMatchesSelector: function () {return wproxy;},getElementsByTagName: function () {return wproxy;},getElementsByTagNameNS: function () {return wproxy;},getElementsByClassName: function () {return wproxy;},insertAdjacentElement: function () {return wproxy;},insertAdjacentText: function () {return wproxy;},mozMatchesSelector: function () {return wproxy;},setPointerCapture: function () {return wproxy;},releasePointerCapture: function () {return wproxy;},hasPointerCapture: function () {return wproxy;},setCapture: function () {return wproxy;},releaseCapture: function () {return wproxy;},getAttributeNode: function () {return wproxy;},setAttributeNode: function () {return wproxy;},removeAttributeNode: function () {return wproxy;},getAttributeNodeNS: function () {return wproxy;},setAttributeNodeNS: function () {return wproxy;},getClientRects: function () {return wproxy;},getBoundingClientRect: function () {return wproxy;},scrollIntoView: function () {return wproxy;},scroll: function () {return wproxy;},scrollTo: function () {return wproxy;},scrollBy: function () {return wproxy;},insertAdjacentHTML: function () {return wproxy;},querySelector: function () {return wproxy;},querySelectorAll: function () {return wproxy;},attachShadow: function () {return wproxy;},requestFullscreen: function () {return wproxy;},mozRequestFullScreen: function () {return wproxy;},requestPointerLock: function () {return wproxy;},animate: function () {return wproxy;},getAnimations: function () {return wproxy;},before: function () {return wproxy;},after: function () {return wproxy;},replaceWith: function () {return wproxy;},remove: function () {return wproxy;},prepend: function () {return wproxy;},append: function () {return wproxy;},replaceChildren: function () {return wproxy;},namespaceURI:'',prefix: {},localName:'',tagName:'',id:'',className:'',classList: {},part: {},attributes: {},scrollTop:'',scrollLeft:'',scrollWidth:'',scrollHeight:'',clientTop:'',clientLeft:'',clientWidth:'',clientHeight:'',scrollTopMax:'',scrollLeftMax:'',innerHTML:'',outerHTML:'',shadowRoot: {},assignedSlot: {},slot:'',onfullscreenchange: {},onfullscreenerror: {},previousElementSibling: {},nextElementSibling: {},children: {},firstElementChild: {},lastElementChild: {},childElementCount:'',getRootNode: function () {return wproxy;},hasChildNodes: function () {return wproxy;},insertBefore: function () {return wproxy;},appendChild: function () {return wproxy;},replaceChild: function () {return wproxy;},removeChild: function () {return wproxy;},normalize: function () {return wproxy;},cloneNode: function () {return wproxy;},isSameNode: function () {return wproxy;},isEqualNode: function () {return wproxy;},compareDocumentPosition: function () {return wproxy;},contains: function () {return wproxy;},lookupPrefix: function () {return wproxy;},lookupNamespaceURI: function () {return wproxy;},isDefaultNamespace: function () {return wproxy;},nodeType:'',nodeName:'',baseURI:'',isConnected:'',ownerDocument: {},parentNode: {},parentElement: {},childNodes: {},firstChild: {},lastChild: {},previousSibling: {},nextSibling: {},nodeValue: {},textContent:'',ELEMENT_NODE:'',ATTRIBUTE_NODE:'',TEXT_NODE:'',CDATA_SECTION_NODE:'',ENTITY_REFERENCE_NODE:'',ENTITY_NODE:'',PROCESSING_INSTRUCTION_NODE:'',COMMENT_NODE:'',DOCUMENT_NODE:'',DOCUMENT_TYPE_NODE:'',DOCUMENT_FRAGMENT_NODE:'',NOTATION_NODE:'',DOCUMENT_POSITION_DISCONNECTED:'',DOCUMENT_POSITION_PRECEDING:'',DOCUMENT_POSITION_FOLLOWING:'',DOCUMENT_POSITION_CONTAINS:'',DOCUMENT_POSITION_CONTAINED_BY:'',DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:'',addEventListener: function () {return wproxy;},removeEventListener: function () {return wproxy;},dispatchEvent: function () {return wproxy;},};
document.previousSibling = {};
document.nextSibling = {};
document.nodeValue = {};
document.textContent = {};
document.ELEMENT_NODE = 1;
document.ATTRIBUTE_NODE = 2;
document.TEXT_NODE = 3;
document.CDATA_SECTION_NODE = 4;
document.ENTITY_REFERENCE_NODE = 5;
document.ENTITY_NODE = 6;
document.PROCESSING_INSTRUCTION_NODE = 7;
document.COMMENT_NODE = 8;
document.DOCUMENT_NODE = 9;
document.DOCUMENT_TYPE_NODE = 10;
document.DOCUMENT_FRAGMENT_NODE = 11;
document.NOTATION_NODE = 12;
document.DOCUMENT_POSITION_DISCONNECTED = 1;
document.DOCUMENT_POSITION_PRECEDING = 2;
document.DOCUMENT_POSITION_FOLLOWING = 4;
document.DOCUMENT_POSITION_CONTAINS = 8;
document.DOCUMENT_POSITION_CONTAINED_BY = 16;
document.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
document.addEventListener = function () {return wproxy;};
document.removeEventListener = function () {return wproxy;};
document.dispatchEvent = function () {return wproxy;};

window.document = document;

for (let k in window) !global[k] && (global[k] = window[k]);
for (let k in window.globalThis) !global[k] && (global[k] = window.globalThis[k]);

/** -------------  */

'use strict';

class HtmlState_ {

  constructor () {
    this.STATE = {
      CHAR: 'c',
      TAG_ATTR_PRE: '_',
      TAG_ATTR: 'a',
      TAG_START: '<',
      TAG_END: '>',
      TAG_CLOSE : '/',
      TAG_CLOSE_END: '/>',
      SPACE: ' ',
      TAG_ATTR_VALUE_START: '@',
      TAG_ATTR_VALUE_END: '/@',
      TAG_CLOSE_START: '</',
      TAG_ATTR_SET_VALUE: '=',
      TAG_ATTR_VALUE: 'v',
      TAG_NAME: 'n',
      TAG_CLOSE_NAME: 'cn',
      NONE: 0
    }

    //记录当前属性值的类型：单引号、双引号、无
    this.attrType = ''
    this.curState = this.STATE.NONE
    this.cursor = 0
    this.lastCursor = 0

    this.tagStack = []
    this.tagCloseStack = []

    this.singleTags = [
      'br', 'hr', 'img', 'input', 'param', 'meta', 'link'
    ]

    this.lastErrorMsg = ''

    this.curTagIndex = 0
    this.curTagEndIndex = 0

    this.data = ''

    this.is_script = false

    this.script_reg = new RegExp('<SCRIPT>', 'ig')
    this.script_end_reg = new RegExp('<\/SCRIPT>', 'ig')
    this.html_comment_reg = new RegExp('<!--(.|[\r\n])*?-->','mg')
  }

  diffCloseTag () {
    let tagname = ''
    let endIndex = this.curTagEndIndex

    while (this.data[endIndex] !== ' ' && endIndex < this.cursor) {
      endIndex += 1
    }

    tagname = this.data.substring(this.curTagEndIndex, endIndex)

    if (tagname.toLowerCase() !== this.tagStack.pop()) {
      return false
    }

    return true
  }

  pushTag () {
    
    let tagname = ''
    let endIndex = this.curTagIndex

    while (this.data[endIndex] !== ' ' && endIndex < this.cursor) {
      endIndex += 1
    }

    tagname = this.data.substring(this.curTagIndex, endIndex).toLowerCase()

    this.singleTags.indexOf(tagname) < 0 && this.tagStack.push(tagname)

    if (tagname === 'script')
      this.is_script = true

  }

  /**
   * 在不是设置属性值的状态下（TAG_ATTR_VALUE），如果出现了< >则为非法格式。
   * 在属性值中，如果出现了单引号或双引号的冲突则为非法格式。
   */

  checkSpace (next_char) {
    if (this.STATE.TAG_START === this.curState || this.STATE.TAG_CLOSE === this.curState) {
      return false
    }

    if (next_char === ' ') return true

    if (this.curState === this.STATE.TAG_ATTR_VALUE_END) {
      this.curState = this.STATE.TAG_ATTR_PRE
      return true
    }

    if (this.curState === this.STATE.TAG_ATTR_VALUE) {
      if (this.attrType === '') {
        this.curState = this.STATE.TAG_ATTR_PRE
      }

      return true
    }

    if (this.STATE.TAG_NAME === this.curState || this.curState === this.STATE.TAG_ATTR) {
      this.curState = this.STATE.TAG_ATTR_PRE
    }
    else if (this.STATE.NONE === this.curState) {
      this.curState = this.STATE.CHAR
    }
    else if (next_char === '>') {
      return false
    }

    return true
  }

  checkTagStart (next_char) {

    if (this.curState === this.STATE.TAG_ATTR_VALUE) {
      if (this.attrType !== '') {
        return false
      }
      return true
    }

    if (this.STATE.TAG_END === this.curState 
      || this.STATE.TAG_CLOSE_END === this.curState 
      || this.STATE.NONE === this.curState 
      || this.STATE.CHAR === this.curState)
    {
      if (next_char === '/') {
        this.curState = this.STATE.TAG_CLOSE
        this.cursor += 1
        this.curTagEndIndex = this.cursor + 1
      } else {
        this.curState = this.STATE.TAG_START
        this.curTagIndex = this.cursor + 1
      }
      
      return true
    }

    return false
  }

  checkTagEnd (cur_char, next_char) {
    
    if (this.curState === this.STATE.TAG_CLOSE_NAME) {
      this.curState = this.STATE.TAG_CLOSE_END
      if (!this.diffCloseTag()) {
        return false
      }
      return true
    }

    if (this.curState === this.STATE.TAG_NAME 
      || this.curState === this.STATE.TAG_ATTR
      || this.curState === this.STATE.TAG_ATTR_PRE
      || (this.curState === this.STATE.TAG_ATTR_VALUE && this.attrType === '')
      || this.curState === this.STATE.TAG_ATTR_VALUE_END)
    {
      this.curState = this.STATE.TAG_END
      this.pushTag()
      return true
    }

    return false
  }

  checkAttrQuote (cur_char, next_char) {
    if (this.curState === this.STATE.NONE 
      || this.curState === this.STATE.CHAR 
      || this.curState === this.STATE.TAG_CLOSE_END
      || this.curState === this.STATE.TAG_END)
    {
      this.curState = this.STATE.CHAR
      return true
    }

    if (this.curState === this.STATE.TAG_ATTR_SET_VALUE) {
      this.attrType = cur_char
      this.curState = this.STATE.TAG_ATTR_VALUE_START
      return true
    }

    if (this.curState === this.STATE.TAG_ATTR_VALUE_END) {
      return false
    }

    if (this.curState === this.STATE.TAG_ATTR_VALUE || this.curState === this.STATE.TAG_ATTR_VALUE_START)
    {
      // a="''" or a='""'
      if (cur_char !== this.attrType) {
        if (this.curState === this.STATE.TAG_ATTR_VALUE_START) {
          //中间的属性值允许出现空格
          if (next_char === '\n') {
            return false
          }
          this.curState = this.STATE.TAG_ATTR_VALUE
          return true
        }
        
        if (next_char === '\n') {
          return false
        }
        //this.STATE.TAG_ATTR_VALUE 不用改
        return true
      }

      /* if (cur_char !== this.attrType) {
        return false
      } */
      this.curState = this.STATE.TAG_ATTR_VALUE_END
      return true
    }

    return false
  }

  checkAttrSetValue (next_char) {

    if (this.curState === this.STATE.NONE) {
      this.curState = this.STATE.CHAR
      return true
    }

    if (this.STATE.CHAR === this.curState 
      || this.curState === this.STATE.TAG_END 
      || this.curState === this.STATE.TAG_CLOSE_END)
    {
      this.curState = this.STATE.CHAR
      return true
    }

    if (this.STATE.TAG_ATTR === this.curState) {
      this.curState = this.STATE.TAG_ATTR_SET_VALUE
      return true
    }

    return false
  }

  checkChar(cur_char, next_char) {
    if (cur_char === '/' && next_char && next_char === '>') {
      if ( (this.attrType === '' && this.curState === this.STATE.TAG_ATTR_VALUE)
        || this.STATE.TAG_NAME === this.curState
        || this.STATE.TAG_ATTR === this.curState
        || this.STATE.TAG_ATTR_PRE === this.curState
      ) {
        this.cursor += 1
        this.curState = this.STATE.TAG_CLOSE_END
        return true
      }
    }

    if (this.curState === this.STATE.TAG_ATTR_PRE) {
      this.curState = this.STATE.TAG_ATTR
      return true
    }

    if (this.curState === this.STATE.TAG_ATTR_SET_VALUE) {

      if (cur_char === '\\') {
        this.cursor += 2
        return true
      }

      this.attrType = ''
      this.curState = this.STATE.TAG_ATTR_VALUE
      return true
    }

    if (this.curState === this.STATE.NONE) {
      this.curState = this.STATE.CHAR
      return true
    }

    if (this.curState === this.STATE.TAG_ATTR_VALUE_START) {
      this.curState = this.STATE.TAG_ATTR_VALUE
      return true
    }

    if (this.curState === this.STATE.TAG_START) {
      this.curState = this.STATE.TAG_NAME
      return true
    }

    if (this.curState === this.STATE.TAG_CLOSE) {
      this.curState = this.STATE.TAG_CLOSE_NAME
      return true
    }
    
    return true
  }

  checkState (cur_char, next_char) {

    if (cur_char !== this.attrType && this.attrType !== '') {
      if (this.curState === this.STATE.TAG_ATTR_VALUE)
      {
        return true
      }
    }

    if (this.is_script) {
      let script_ind = this.data.indexOf('<\/script>', this.cursor);
      if (script_ind < 0) {
        return false
      }

      this.cursor = script_ind - 1
      this.is_script = false
      return true
    }

    switch (cur_char) {
      case '<':
        return this.checkTagStart(next_char)

      case '>':
        return this.checkTagEnd(cur_char, next_char)

      case '"':
      case "'":
        return this.checkAttrQuote(cur_char, next_char)

      case ' ':
        return this.checkSpace(next_char)

      case '=':
        return this.checkAttrSetValue(next_char)

      default:
        return this.checkChar(cur_char, next_char)
    }

  }

  diffStack () {
    if (this.tagStack.length !== this.tagCloseStack.length) {
      return false
    }

    return true
  }

  init () {
    this.curState = this.STATE.NONE
    this.attrType = ''
    this.curTagIndex = this.curTagEndIndex = 0
    this.tagStack = []
    this.is_script = false
    this.data = ''
    this.cursor = 0
  }

  parse (data) {
    
    this.init();

    if ( !(typeof data === 'string' || (data instanceof String)) ) {
      return true;
    }

    if (data.indexOf('<!doctype html>') >= 0) {
      this.lastErrorMsg = '渲染数据不可出现&lt;!doctype html&gt;声明';
      return false;
    }

    this.data = data.replace(this.script_reg, '<script>')
                    .replace(this.script_end_reg, '<\/script>')
                    .replace(this.html_comment_reg, '');

    if (this.data.length === 0) {
      return true
    }

    if (this.data.length === 1) {
      if (this.data[0] === '<' || this.data[0] === '>') {
        this.lastErrorMsg = '标签符号 < 或 > 需要转义'
        return false
      }

      return true
    }

    this.cursor = 0

    let end_index = this.data.length
    let last_index = this.data.length - 1
    let st

    while (this.cursor < end_index) {
      if (this.cursor < last_index)
        st = this.checkState(this.data[this.cursor], this.data[this.cursor+1])
      else
        st = this.checkState(this.data[this.cursor], '')

      if (this.curState === this.STATE.TAG_START)
        this.lastCursor = this.cursor

      if (!st) {
        let errt = this.data.substring(this.lastCursor, this.cursor + 10);
        
        this.lastErrorMsg = `index ${this.lastCursor} ~ ${this.cursor}, 错误的语法。<p style="color:#df6878;">...`
          +`${errt.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}...</p>`;

        console.error(this.data);
        return false;
      }

      this.cursor += 1
    }

    //console.log(this.cursor, data[this.cursor], this.curState)
    //最后的结束状态只能是字符或者标签结束
    if (this.curState !== this.STATE.CHAR 
      && this.curState !== this.STATE.TAG_END 
      && this.curState !== this.STATE.TAG_CLOSE_END)
    {
      this.lastErrorMsg = '标签结束状态错误，请检查模板字符串的语法格式。'
      return false
    }

    if (!this.diffStack()) {
      this.lastErrorMsg = '模板标签包含嵌套不一致。'
      return false
    }

    return true
  }

}

const w = new function () {
  this.alertlog = {a:[], s:[]};
  this.notifylog = '';
  this.notifylogcount = 0;

  Object.defineProperty(this, 'config', {
    value: {},
    writable: false,
    enumerable: true,
    configurable: false
  });

  this.config.notFound = '';

  this.host = '';
  this.prepath = '';
  this.homepage = null;

  this.__title__ = '';
  this.curTitle = '';

  this.checkhtml = true;

  this.errorList = [];
  
  Object.defineProperty(this, 'title', {
    set: (t) => {
      if (t === null || t === '' || t === undefined) {
        document.getElementById('app-title').innerHTML = this.__title__;
        this.curTitle = this.__title__;
      } else {
        document.getElementById('app-title').innerHTML = t;
        this.curTitle = t;
      }
    },
    get: () => {
      return this.curTitle;
    }
  });

  this.attachTitle = (t) => {
    this.title = `${this.__title__}${t}`;
  };

  this.resetTitle = () => {
    this.title = this.__title__;
  };

  this.ua = navigator.userAgent;

  this.isFirefox = false;
  if (navigator.userAgent.indexOf('Firefox') > 0) {
    this.isFirefox = true;
  }

  this.alertLock = false;

  //replace=false, notClose=false, withCover = false
  this.alert = function (info, options = {}) {
    let domname = 'alertdom';
    let coverdomname = 'alertcoverdom';
    let logs = w.alertlog.a;
    if (options.shadow) {
      domname = 'alertdom1';
      coverdomname = 'alertcoverdom1';
      logs = w.alertlog.s;
    }

    if (w.alertLock && !options.shadow) {
      return false;
    }

    info = w.fmtHTML(w.curpagename, info);

    let check_stat = true;
    w.checkhtml && (check_stat = w._htmlcheck(info));

    if (!check_stat) {
      return w[domname];
    }

    if (w[domname]) {
      ;(logs.length > 3) && (logs.pop());

      if (options.replace) {
        while (logs.pop()){}
        ;(typeof info === 'string') && info && logs.push(info);
      } else {
        ;(typeof info === 'string') && info && logs.unshift(info);
      }

      let closeText = '<div style="text-align:right;">'
        +'<a href="javascript:w.unalert();" '
        +'style="color:#696365;font-size:105%;text-decoration:none;" click>'
        +'&nbsp;X&nbsp;</a>'
        +'</div>';

      if (options.notClose) {
        closeText = '';
      }

      w[domname].className = 'w-global-alert-info';

      if (options.transparent) w[domname].className += ' w-global-alert-trans';

      if (typeof info === 'object') {
        w[domname].innerHTML = `${closeText}${info.innerHTML}`;
      } else {
        w[domname].innerHTML = `${closeText}${logs.join('<br>')}`;
      }
      w.initPageDomEvents(options.context || w.curpage, w[domname]);
    }

    if (options.withCover && w[coverdomname]) {
      !options.shadow && (w.alertLock = true);
      w[coverdomname].className = 'w-alert-cover-page';
    }

    return w[domname];
  };

  this.unalert = function (mode = 'self') {

    let domlist = [ 'alertdom' ];
    let cdomlist = [ 'alertcoverdom' ];

    if (mode === 'shadow') {
      domlist = ['alertdom1'];
      cdomlist = ['alertcoverdom1'];
    } else if (mode === 'all') {
      domlist = ['alertdom', 'alertdom1'];
      cdomlist = ['alertcoverdom', 'alertcoverdom1'];
    }

    ;(mode !== 'shadow') && (this.alertLock = false);

    if (mode === 'all' || mode === 'shadow') {
      while(w.alertlog.s.pop()){}
    }

    if (mode === 'all' || mode === 'self') {
      while(w.alertlog.a.pop()){}
    }

    for (let a of domlist) {
      if (w[a]) {
        w[a].innerHTML = '';
        w[a].className = '';
      }
    }

    for (let a of cdomlist) {
      if (w[a]) {
        w[a].className = '';
        w[a].innerHTML = '';
        w[a].style.cssText = '';
      }
    }
  };

  this.uncover = function () {
    this.unalert();
  };

  this.uncoverShadow = function () {
    this.unalert('shadow');
  };

  this.coverShadow = function (info, trans = false) {
    this.alert(info, {
      replace: true,
      notClose: true,
      withCover: true,
      shadow: true,
      transparent: trans
    });
  };

  this.cover = function (info, trans = false) {
    this.alert(info, {
      replace: true,
      notClose: true,
      withCover: true,
      transparent: trans
    });
  };

  this.alertError = function (info, tmout = 0) {
    info = `<span style="color:#e73949;">${info}</span>`;
    w.alert(info);
    if (tmout > 0) {
      setTimeout(() => {
        w.unalert();
      }, tmout);
    }
  };

  this.notifyError = function (info, tmout = 2500) {
    w.notify(info, {tmout: tmout, ntype: 'error'});
  };

  this.notifyLight = function (info, tmout = 2500) {
    w.notify(info, {tmout: tmout, ntype: 'light'});
  };

  this.notifyTop = function (info, tmout = 2500) {
    w.notify(info, {tmout:tmout, ntype: 'top'});
  };

  this.notifyTopError = function (info, tmout = 2500) {
    w.notify(info, {tmout: tmout, ntype: 'top-error'});
  };

  this.notifyOnly = function (info, tmout = 2500) {
    w.notify(info, {tmout: tmout, ntype: 'only'});
  };

  this.notifyTimer = null;

  this.notify = function (info, options = {}) {
    let tmout = options.timeout || options.tmout;

    tmout = tmout !== undefined && !isNaN(tmout)
                  ? tmout : 3500;

    let ntype = options.ntype || 'notify';

    if (tmout < 0) {
      w.notifyTimer && clearTimeout(w.notifyTimer);
      w.notifyTimer = null;
      w.unnotify();
    }

    info = w.fmtHTML(w.curpagename, info);

    let check_stat = true;

    w.checkhtml && (check_stat = w._htmlcheck(info));

    if (!check_stat) {
      return w.notifydom;
    }

    if (ntype.indexOf('error') >= 0) {
      info = `<span style="color:#f96567;font-size:95%;">${info}</span>`;
    }

    let where_is = 'w-notify-bottom';
    if (ntype.indexOf('top') >= 0) {
      where_is = 'w-notify-top';
    }

    let colorText = '#e5e5e9';

    if (ntype.indexOf('light') >= 0) {
      where_is += ' w-notify-light';
      colorText = '#4a4a4a';
    }

    if (ntype.indexOf('only') >= 0) {
      w.notifylogcount = 6;
      if (w.notifydom.className.length > 0) {
        w.unnotify();
      }
    }

    if (w.notifydom) {
      w.notifylogcount += 1;
      if (w.notifylogcount > 5) {
        w.notifylog = '';
        w.notifylogcount = 1;
      }
      
      w.notifylog = `${info}<br>${w.notifylog}`;

      w.notifydom.className = `w-global-notify-box ${where_is} w-global-notify-info`;

      if (ntype.indexOf('noclose') >= 0) {
        w.notifydom.innerHTML = `<p style="color:${colorText};">${w.notifylog}</p>`;
      } else {
        w.notifydom.innerHTML = `<div style="text-align:right;">`
          +`<a href="javascript:w.unnotify();" `
          +`style="color:#dfdfdf;font-size:109%;text-decoration:none;" click>&nbsp;X&nbsp;</a>`
          +`</div><div style="color:${colorText};">${w.notifylog}</div>`;
      }
      w.initPageDomEvents(w.curpage, w.notifydom);
    }

    if (tmout >= 0) {
      w.notifyTimer && clearTimeout(w.notifyTimer);
      w.notifyTimer = setTimeout(() => {
        w.unnotify();
      }, tmout);
    }

    return w.notifydom;
  };

  this.unnotify = function () {
    if (w.notifydom) {
      w.notifylog = '';
      w.notifylogcount = 0;
      w.notifydom.className = '';
      w.notifydom.innerHTML = '';
      w.notifyTimer = null;
    }
  };

  this.notice = function (info) {
    w.notify(info, {tmout: -1});
  };

  this.promptMiddle = function (info, options = {}) {
    options.wh = 'middle';
    w.prompt(info, options);
  };

  this.promptMiddleGlass = function (info, options = {}) {
    options.wh = 'middle';
    options.glass = 'glass';
    this.promptGlass(info, options);
  };

  this.promptGlass = function (info, options = {}) {
    options.glass = 'glass';
    this.prompt(info, options);
  };

  this.promptDark = function (info, options = {}) {
    options.glass = 'dark';
    this.prompt(info, options);
  };

  this.promptMiddleDark = function (info, options = {}) {
    options.wh = 'middle';
    options.glass = 'dark';

    this.promptDark(info, options);
  };

  this.promptTop = function (info, options = {}) {
    options.wh = 'top';
    this.prompt(info, options);
  };

  this.promptTopGlass = function (info, options = {}) {
    options.wh = 'top';
    options.glass = 'glass';
    this.prompt(info, options);
  };

  this.promptTopDark = function (info, options = {}) {
    options.wh = 'top';
    options.glass = 'dark';
    this.prompt(info, options);
  };

  //wh = 'bottom', noclose = false, glass = false
  this.prompt = function (info, options = {}) {

    info = w.fmtHTML(w.curpagename, info);

    let wh = options.wh || 'bottom';
    let noclose = options.noclose || false;
    let glass = options.glass || false;

    if (w.promptdom) {
      w.promptdom.className = `w-prompt-box w-prompt-${wh} w-prompt-display`;
      let pcolor = '#424242';

      if (glass === true || glass === 'glass') {
        w.promptdom.className += ' w-prompt-glass';
      } else if (glass === 'dark') {
        w.promptdom.className += ' w-prompt-dark';
        pcolor = '#efefef';
      }

      if (options.color) pcolor = options.color;

      if (noclose) {
        w.promptdom.innerHTML = `<p style="color:${pcolor};">${info}</p>`;
      } else {
        w.promptclosedom.className = 'w-prompt-close';
        if (glass === true || glass === 'glass')
          w.promptclosedom.className += ' w-prompt-close-glass';
        w.promptclosedom.onclick = evt => {
          w.unprompt();
        };

        w.promptdom.innerHTML = `<div style="overflow:auto;word-wrap:break-word;">`
          + `<p style="color:${pcolor};">${info}</p></div>`;
      }

      w.initPageDomEvents(options.target || w.curpage, w.promptdom);
    }

    return w.promptdom;
  };

  this.promptBlock = function (info) {
    if (w.promptdom) {
      w.promptdom.className = 'w-prompt-box w-prompt-block';
      w.promptdom.innerHTML = `<div style="color:#4a4a4f;padding:0.8rem;margin-top:5%;">`
          + `${w.fmtHTML(w.curpagename, info)}`
          + `</div>`;
    }
    w.initPageDomEvents(w.curpage, w.promptdom);
    return w.promptdom;
  };

  this.unprompt = function () {
    if (w.promptdom) {
      w.promptdom.className = '';
      w.promptdom.innerHTML = '';
    }

    if (w.promptclosedom) {
      w.promptclosedom.className = '';
      w.promptclosedom.innerHTML = '';
    }

  };

  this.parseHashUrl = function (h) {
    let url = {
      query : {},
      path  : '',
      orgpath : ''
    };

    if (h.length > 0 && h[0] == '#') {
      h = h.substring(1);
    }

    url.orgpath = h;

    let hsp = h.split('?');
    url.path = hsp[0];

    let qs = '';
    if (hsp.length > 1) {
      qs = hsp[1];
    }

    if (qs) {
      let qsp = qs.split('&');
      let tmp = [];
      for (let i=0; i<qsp.length; i++) {
        tmp = qsp[i].split('=');
        if (tmp.length < 1) {
          tmp.push('');
        }
        url.query[tmp[0]] = tmp[1];
      }
    }
    
    return url;
  };

  this.firstListenHash = true;
  this.listenHashLock = false;
  this.historyList = ['#'];
  this.historyLength = history.length;
  this.pageShowType = '';
  this.pageShowTypeLock = false;
  
  this.listenHash = async function (op = '') {
    if (this.listenHashLock === true) {
      return false;
    }

    if (!this.pageShowTypeLock) {
      this.pageShowType = op;
    }
    
    this.pageShowTypeLock = false;

    try {
      this.listenHashLock = true;
      let h = location.hash;
      let r = this.parseHashUrl(h);

      if (w.tabs.pages.indexOf(r.path) >= 0) {
        this.listenHashLock = false;
        if (this.firstListenHash) {
          location.hash = '';
          return;
        }
        return;
      }

      this.firstListenHash = false;

      //表示从其他页面到了tab主页
      if (r.path == '' && w.tabs.list.length > 0) {
        this.listenHashLock = false;
        let tp = w.tabs.cur;
        w.tabs.cur = '';
        return w.switchTab(tp || w.tabs.pages[0]);
      }
    
      await this.loadPage(r);
      this.listenHashLock = false;
    } catch (err) {
      this.listenHashLock = false;
    }finally{this.listenHashLock = false;}

    return true;
  };

  this.pageNameList=[];
  Object.defineProperty(this, 'pages', {
    value: Object.create(null),
    enumerable: true,
    configurable: false,
    writable: false
  });

  this.curpage = null;
  this.curpagename = null;

  this.storage = new function () {
    this.length = 0;

    this.set = function (k, d) {
      try {
        let tmp;
        switch (typeof d) {
          case 'number':
            tmp = `${d}`;
            break;
          case 'object':
            tmp = JSON.stringify(d);
            break;
          case 'function':
            tmp = 'function';
            break;
          case 'string':
            tmp = d;
            break;
          default:
            tmp = d.toString();
        }

        localStorage.setItem(k, tmp);
        this.length += tmp.length;
        return true;

      } catch (err) {
        return false;
      }
    };

    this.get = function (k, jsonserial = false) {
      let tmp = localStorage.getItem(k);
      if (tmp === null) {
        return null;
      }
      try {
        return jsonserial ? JSON.parse(tmp) : tmp;
      } catch (err) {
        return null;
      }
    };

    this.remove = function (k) {
      let tmp = localStorage.getItem(k);
      if (tmp !== null) {
        localStorage.removeItem(k);
        this.length -= tmp.length;
      }
    };

    this.delete = this.remove;

    this.clear = function () {
      localStorage.clear();
      this.length = 0;
    };

    this.getPre = function (pre, options = null) {
      let total = localStorage.length;
      let nk;
      let dlist = [];
      for (let i = 0; i < total; i++) {
        nk = localStorage.key(i);
        if (nk.indexOf(pre) !== 0) continue;

        if (options && options.justKeys) {
          dlist.push(nk);
        } else {
          dlist.push({
            key: nk,
            data: this.jget(nk)
          });
        }
      }

      return dlist;
    };

    this.removePre = function (pre, callback = null) {
      let dlist = this.getPre(pre);
      for (let a of dlist) {
        if (callback && typeof callback === 'function') {
          callback(a) && this.remove(a.key);
        } else {
          this.remove(a.key);
        }
      }
    };

    this.jget = function (k) {
      return this.get(k,true);
    };

  };

  this.initFlag = false;

  this.initOnePage = function (name, obj=null) {
    let pg = this.pages[name];
    if (!pg) {
      pg = this.pages[name] = obj || {};
    }

    if (pg.state) {
      return false;
    }

    pg.__dom__ = this.pgcdom.insertBefore(document.createElement('div'),
                                          this.pgcdom.firstChild);
    pg.initCount = 0;
    pg.loaded = false;
    pg.scroll = 0;
    pg.bottomTime = 0;
    pg.pageKey = name;
    pg.__name__ = name;
    pg.init = false;
    pg.__dom__.onscroll = w.events.scroll;
    pg.state = true;
    pg.tabsPlace = '';

    if (w.tabs.list.length > 0) {
        pg.tabsPlace = '<div style="height:3.8rem;">&nbsp;</div>';

        if (w.tabs.pages.indexOf(name) >= 0) {
          pg.__dom__.style.cssText = 'z-index:1;';
        }
    }

    pg.view = function (data) {return w.view(name, data);};
    pg.resetView = function (data) {return w.resetView(name, data);};
    pg.render = function (htext) {return w.fmtHTML(name, htext);};
    pg.setScroll = function(scr) {
        if (scr < 0) { w.pages[name].__dom__.scrollTop += scr; }
        else { w.pages[name].__dom__.scrollTop = scr; }
    };
    pg.destroy = function () {w.destroyPage(w.pages[name]);};
    pg.query = function(qstr) {return w.pages[name].__dom__.querySelector(qstr);};
    pg.queryAll = function(qstr) {return w.pages[name].__dom__.querySelectorAll(qstr);};
    pg.setAttr = function (data) {w.setAttr(name, data);};
    if (!w.pages[name].data || typeof w.pages[name].data !== 'object') {
        w.pages[name].data = {};
    }
    w._make_page_bind(name);
    w._page_style_bind(name);
  }

  this.initPage = function () {
    for (let k in this.pages) {
      this.initOnePage(k);
    }
    this.initFlag = true;
  };

  this.destroyAllPage = function () {
    for (let k in w.pages) {
      this.destroyPage(w.pages[k]);
    }
  };

  this.destroyPage = function (page = null) {
    if (page === null) {
      page = this.curpage;
      if (page === null) {
        return ;
      }
    }
    if (page.onunload && typeof page.onunload === 'function') {
      try {
        page.onunload();
      } catch (err) {
        w.notifyError(`Page：${page.__name__} 执行onunload失败：<p>${err.message}</p>`, 10000);
      }
    }
    
    page.__dom__.innerHTML = '';
    page.__dom__.className = 'w-hide-cur-page';
    page.init = false;
    page.loaded = false;
    page.bottomTime = 0;
  };

  this.stopPage = function (page = null) {
    if (page === null) {
      page = this.curpage;
      if (page === null) {
        return ;
      }
    }
    page.__dom__.className = 'w-hide-cur-page';
  };

  this.unStopPage = function (page = null) {
    if (page === null) {
      page = this.curpage;
      if (page === null) {
        return ;
      }
    }
    page.__dom__.className = 'w-current-page-display';
  };

  this.hidePage = function (page = null) {
    if (!page) page = w.curpage;
    if (page === null) {
      return ;
    }

    if (w.pageShowType === 'back') {
      page.__dom__.className = 'w-hide-cur-page w-hide-cur-page-back';
    } else {
      page.__dom__.className = 'w-hide-cur-page';
    }

    if (page.onhide && typeof page.onhide === 'function') {
      try {
        page.onhide();
      } catch (err) {
        console.error(err);
      }
    }
  };

  this.showPage = function (page) {
    if (!w.pageShowType || location.hash === '#' || w.curpagename === w.homepage || location.hash === '') {
      page.__dom__.className = 'w-current-page-display';
    }
    else if (w.pageShowType === 'forward') {
      page.__dom__.className = 'w-current-page-display w-current-page-display-forward';
    } else if (w.pageShowType === 'back') {
      page.__dom__.className = 'w-current-page-display w-current-page-display-back';
    }
  };

  this.hideAll = function () {
    for (let k in this.pages) {
      this.pages[k].__dom__.className = 'w-hide-cur-page';
    }
  };

  this.context = function () {
    return {
      path : '',
      model : {},
      request : w.request,
      dom : null,
      url : {}
    };
  };

};

w._htmlparse = new HtmlState_();

w._htmlcheck = function (data) {
  if (!w._htmlparse.parse(data)) {
    w.notify(w._htmlparse.lastErrorMsg, {tmout: 10000, ntype: 'top-error'});
    return false;
  }
  return true;
};

w.setCoverText = (text = '', style = '') => {
  w.alertcoverdom.innerHTML = text;
  w.alertcoverdom.style.cssText = style;
};

w.setCoverShadowText = (text = '', style = '') => {
  w.alertcoverdom1.innerHTML = text;
  w.alertcoverdom1.style.cssText = style;
};

w.sliderPage = function(html = null, append = true, obj=null) {
  if (w.slidedom) {
    w.slidedom.className = 'w-common-slide-right';
    w.slidexdom.className = 'w-common-slide-right-close';
    w.slidexdom.onclick = w.hideSliderPage;

    if (html !== null) {
      if (typeof html === 'string') {
        let fmthtml = w.fmtHTML(w.curpagename, html);
        let check_stat = true;

        w.checkhtml && (check_stat = w._htmlcheck(fmthtml));
        check_stat && (w.slidedom.innerHTML = fmthtml);

      } else {
        if (append) {
          w.slidedom.innerHTML = '';
          w.slidedom.appendChild(html);
        } else {
          w.slidedom.innerHTML = w.fmtHTML(w.curpagename, html.innerHTML);;
        }
      }
      w.initPageDomEvents(obj || w.curpage, w.slidedom);
    }
  }

  return w.slidedom;
};

w.hideSliderPage = function () {
  if (w.slidedom) {
    w.slidedom.className = 'w-hide-common-slide-right';
    w.slidexdom.className = 'w-hide-common-slide-right-close';
    w.slidedom.innerHTML = '';
  }
};

w.hideSlider = w.hideSliderPage;

w.scrollTop = function (bh='smooth') {
  w.scroll({
    top: 0,
    behavior: bh
  });
};

w.scroll = function (x, y) {
  if (w.curpage && w.curpage.__dom__) {
    w.curpage.__dom__.scroll(x, y);
  }
};

w.loadPageLock = false;

w.handleNotFound = function () {
  if (!w.config.notFound || typeof w.config.notFound === 'string') {
    let notfoundText = `<div style="font-size:125%;font-weight:bold;">404: 没有此页面</div><p>${location.hash} 页面不存在！！</p><p style="text-align:center;"><a href="javascript:unalert();w.redirect('#');">回到首页</a></p>`;
    this.alert(w.config.notFound || notfoundText);
  } else {
    if (typeof w.config.notFound === 'function') {
      w.config.notFound();
    } else if (typeof w.config.notFound === 'object') {
      let obj = w.config.notFound;
      if (obj.redirect && w.pages[obj.redirect]) {
        w.redirect(obj.redirect);
      } else {
        this.alert('<div>404: 没有此页面</div>');
      }
    }
  }
};

w.going = null;

w.routeInfo = function() {
  return w.curpage ? (w.curpage.__ctx__ || null) : null;
};

w.loadPage = async function (R) {
  if (w.loadPageLock) {
    return false;
  }

  w.loadPageLock = true;

  let route = R.path;
  if (route == '' || route == '/') {
    route = this.homepage;
  }

  let pageindex = w.pageNameList.indexOf(route);

  if (this.pages[route] === undefined && pageindex >= 0) {
    alert('正在等待页面初始化···', {notClose: true});
  
    for (let i = 0; i < 222; i++) {
      await new Promise(rv => {setTimeout(rv, 5)});
      if (this.pages[route] && this.pages[route].state) break;
    }

    setTimeout(()=>{w.unalert();},111);

    if (this.pages[route] === undefined) {
      w.notify('等待页面超时！', {ntype: 'top error noclose'});
      //经过这个延迟，页面有可能已经准备好。
      await new Promise(rv => {setTimeout(rv, 1101)});
    }
  
  }

  if (this.pages[route] === undefined) {
      w.loadPageLock = false;
      this.handleNotFound();
      return false;
  }

  let pg = this.pages[route];
  let c = this.context();
  c.path = route;
  c.query = R.query;
  c.orgpath = R.orgpath;

  c.goTop = function () {
    pg.scroll = 0;
    c.dom.scrollTop = 0;
  };
  
  c.dom = pg.__dom__;
  c.loaded = pg.loaded;

  c.name = pg.__name__;
  this.going = pg.__name__;

  pg.__ctx__ = c;

  //loadPage是一个异步函数，如果此时在runHook中的函数执行了重定向操作会导致页面显示失败。
  //因为此时，listenHasLock为true
  if (false === await w.runHooks(c)) {
    w.loadPageLock = false;
    return false;
  }

  let oldpg = this.curpage;
  this.curpage = pg;
  this.curpagename = pg.__name__;
  this.hidePage(oldpg);
  this.showPage(pg);

  w.loadPageLock = false;

  if (pg.init === false) {
    if (!w._htmlcheck(pg.orgHTML)) {
      w.notifyTopError(`页面初始化错误：${pg.__name__}.html`, 10000);
      return false;
    }
    pg.init = true;

    pg.__dom__.innerHTML = `${pg.orgHTML}${pg.tabsPlace}`;

    w.initPageDomEvents(pg, pg.__dom__);
  }

  //为了避免在重定向或跳转页面的操作时出现冲突。
  //这里先解锁hash，允许listenHash执行，避免后续的事件函数执行出现漫长等待。
  w.listenHashLock = false;

  if (pg.onload && typeof pg.onload === 'function' && pg.loaded === false) {
    pg.loaded = true;
    try {
      await pg.onload(c);
    } catch (err) {
      w.notify(err.message);
    }
  }

  if (pg.onshow && typeof pg.onshow === 'function') {
    try {
      await pg.onshow(c);
    } catch (err) {
      w.notify(err.message);
    }
  }

  pg.__dom__.scrollTop = pg.scroll;
};

w.reload = function (force = true) {
  let pg = w.curpage;

  w.destroyPage(pg);

  if (!pg || force) {
    return w.listenHash();
  }

  let R = w.parseHashUrl(pg.__name__);
  w.loadPage(R);
};

w.qs = function (args) {
  let qrs_list = [];

  for (let k in args) {
    qrs_list.push(`${k}=${encodeURIComponent(args[k])}`);
  }

  return qrs_list.join('&');
};

w.go = async function (path, args = {}, op = 'forward') {
  if (typeof args === 'string') {
    op = args;
    args = {};
  }
  
  this.pageShowTypeLock = true;
  w.pageShowType = op;

  let qrs = w.qs(args);

  if (w.listenHashLock) {
    for (let i = 0; i < 500; i++) {
      await new Promise(rv => {setTimeout(rv, 5)});
      if (!w.listenHashLock) break;
    }
  }
  
  location.hash = `${path}${qrs.length>0?'?':''}${qrs}`;
};

w.goBack = function () {
  if (window.history.length > 1) {
    window.history.back();
    return true;
  }
  return false;
}

w.redirectBack = function (n=1) {
  if (w.historyList.length < n) {
    return false;
  }

  let last_url = w.historyList[w.historyList.length - n];

  if (!last_url) {
    return false;
  }

  w.redirect(last_url);
}

w.redirect = function (path, args = {}) {
  this.pageShowTypeLock = true;
  w.pageShowType = 'forward';
  
  if (path[0] !== '#') path = `#${path}`;

  let qrs = w.qs(args.query || {});

  let startRedirect = async () => {
    history.replaceState({id: path}, '', `${path}${qrs.length > 0 ? '?' : ''}${qrs}`);
    if (args.noticeInfo) {
      w.notify(args.noticeInfo, {ntype: 'top noclose', timeout: 5000});
    }

    if (w.listenHashLock) {  
      //有可能某些页面还没准准备好导致页面初始化需要等待，此时listenHash会等待，这里也要等待。
      for (let i = 0; i < 500; i++) {
        await new Promise(rv => {setTimeout(rv, 5)});
        if (!w.listenHashLock) break;
      }
    }

    if (args.noticeInfo) {
      if (args.noticeTimeout && typeof args.noticeTimeout === 'number') {
        setTimeout(()=>{w.unnotify();}, args.noticeTimeout);
      } else w.unnotify();
    }

    w.listenHash();
  };

  if (args.delay && typeof args.delay === 'number') {
    return setTimeout(startRedirect, args.delay);
  }

  startRedirect();
};

w.fmtHTML = function (pagename, ht) {

  if (!ht || !ht.replace || typeof ht.replace !== 'function') {
    return ht || '';
  }

  ht = ht.replace(/ on[^(=|"|'|;)]+="[^"]+"/g, m => {
    let sp = m.split('=');
    let fstr = sp[1].substring(1, sp[1].length-1);
    let retFalse = '';

    if (fstr.indexOf('w.') != 0) {
      fstr = `w.pages.${pagename}.${fstr}(this);`;
      if (sp[0] === ' onsubmit') {
        retFalse = 'return false;';
      }
      return `${sp[0]}="${fstr}${retFalse}"`;
    }

    return m;
  });

  ht = ht.replace(/ on[^=]+=[^(\s|>|"|')]+/g, m => {
    let sp = m.split('=');
    let fstr = sp[1];

    if (fstr.indexOf('w.') != 0) {
      fstr = `w.pages.${pagename}.${fstr}(this);`;
      if (sp[0] === ' onsubmit') {
        return `${sp[0]}="${fstr}return false;"`;
      }
      return `${sp[0]}=${fstr}`;
    }

    return m;
  });

  return ht;
};

w.setAttr = function (pagename, data) {

  if (this.pages[pagename] === undefined) {
    return;
  }

  if (typeof data !== 'object') {
    return;
  }

  let pg = this.pages[pagename];
  let pgdom = pg.__dom__;

  let qcss, nds, attr;

  for (let k in data) {
    qcss = `[data-name=${k}]`;

    if (k[0] === '#') {
      qcss = k;
    } else if (k[0] === '@') {
      qcss = `[name=${k.substring(1)}]`;
    } else if (k[0] === '.') {
      qcss = `[class=${k.substring(1)}]`;
    } else if (k.indexOf('[') >= 0) {
      qcss = k;
    } else if (k[0] === ':') {
      qcss = `[data-bind=${k.substring(1)}]`;
    }

    nds = pgdom.querySelectorAll(qcss);

    if (nds.length === 0) {
      nds = w._queryGlobal(qcss);
    }

    attr = data[k];

    for (let d of nds) {
      for (let a in attr) {
        switch (a) {
          case 'class':
            d.className = attr[a];
            break;

          case 'style':
            if (typeof attr[a] === 'string') {
              d.style.cssText = attr[a];
            } else if (typeof attr[a] === 'object') {
              for (let ak in attr[a]) {
                d.style[ak] = attr[a][ak];
              }
            }
            break;

          default:
            d[a] = attr[a];
        }
        
      }
    }

  }

};

w._globaldoms = [
  'alertdom', 'slidedom', 'promptdom', 'navibtndom', 'notifydom', 
];

w._queryGlobal = function (qstr) {
  let nds = [];
  let t = [];
  
  for (let a of w._globaldoms) {
    if (!w[a]) {
      continue;
    }
    
    t = w[a].querySelectorAll(qstr);

    for (let n of t) {
      nds.push(n);
    }

  }

  return nds;
};

w.errorHandle = null;

w.__cacheError = function (err) {
  if (w.errorList.length > 500) {
    for (let i = 0; i < 100; i++) {
      w.errorList.shift();
    }
  }
  w.errorList.push(err);
  if (w.errorHandle && typeof w.errorHandle === 'function') {
    try {
      w.errorHandle(w.errorList);
    } catch (err) {
      w.notifyError(`errorHandle:<p>${err.message}</p>`, 5000);
    }
  }
};

/**
 * 如果页面对象存在和名字对应的模板函数，则把数据传递给模板函数，否则直接进行渲染。
 * @param {string} pagename 
 * @param {any} data 
 * @param {object} options 
 */
w.view = function (pagename, data) {

  if (this.pages[pagename] === undefined) {
    return;
  }

  if (typeof data !== 'object') {
    return;
  }

  let pg = this.pages[pagename];
  let pgdom = pg.__dom__;

  let qcss = '';
  let nds = '';

  for (let k in data) {
    qcss = `[data-name=${k}]`;
    
    if (k[0] === '&') {
      qcss = k.substring(1);
    } else if ([':', '.', '#'].indexOf(k[0]) >= 0) {
      qcss = k;
    } else if (k.indexOf('[') >= 0) {
      qcss = k;
    }

    nds = pgdom.querySelectorAll(qcss);

    if (nds.length === 0) {
      nds = w._queryGlobal(qcss);
    }

    if (data[k] === null) {
      w._resetData(pagename, pg, nds);
      continue;
    }

    try {
      w._setData(pagename, pg, nds, data[k]);
    } catch (err) {
      if (w.debug) {
        w.notifyError(err.message, 3500);
        console.error(err);
      } else {
        w.__cacheError(err);
      }
    }
  }
};

w.resetView = function(pagename, qss) {
  if (!Array.isArray(qss)) {
    qss = [qss];
  }
  
  let data = {};
  for (let q of qss) {
    if (q && typeof q === 'string') {
      data[q] = null;
    }
  }
  w.view(pagename, data);
};

w._resetData = function (pagename, pg, nds) {
  for (let d of nds) {
    if (d.tagName === 'IMG') {
      d.src = '';
      continue;
    }
    
    if (d.tagName === 'INPUT') {
      if (['checkbox', 'radio'].indexOf(d.type) >= 0) {
        d.checked = false;
        continue;
      }
    }

    if (d.value !== undefined) {
      ;(d.tagName !== 'SELECT') && (d.value = '');
    } else {
      d.innerHTML = '';
    }
  }
};

w._setData = function (pagename, pg, nds, data) {

  let dtemp = '';
  let dtemp_fmtval = '';
  let dataType = typeof data;

  for (let i = 0; i < nds.length; i++) {
    
    if (nds[i].dataset.map && typeof pg[nds[i].dataset.map] === 'function') {
      dtemp = pg[nds[i].dataset.map]({
        data: data,
        target: nds[i],
        type: 'map',
        dataType}) || '';

    } else if (nds[i].dataset.list && typeof pg[nds[i].dataset.list] === 'function') {
      if (Array.isArray(data)) {
        data.forEach((a, ind) => {
          dtemp += pg[nds[i].dataset.list]({
            data: a, 
            index: ind, 
            key: ind, 
            target: nds[i], 
            type: 'list', 
            dataType: (typeof a)}) || '';
        });
      } else if (data && typeof data === 'object') {
        for (let k in data) {
          dtemp += pg[nds[i].dataset.list]({
            data: data[k], key: k, target: nds[i], type: 'list', dataType: (typeof data[k])
          }) || '';
        }
      } else {
        dtemp = pg[nds[i].dataset.list]({data: data, target: nds[i], type: 'list', dataType}) || '';
      }
    } else {
      if (pg.display && typeof pg.display === 'object' 
        && pg.display[nds[i].dataset.name]
        && typeof pg.display[nds[i].dataset.name] === 'function')
      {
        dtemp = pg.display[nds[i].dataset.name]({
          data: data, target: nds[i], type: 'display', dataType
        }) || (typeof data === 'object' ? JSON.stringify(data) : data);
      } else if (typeof data === 'object') {
        dtemp = JSON.stringify(data);
      } else {
        dtemp = data;
      }
    }

    if (nds[i].tagName === 'IMG') {
      nds[i].src = dtemp;
      continue;
    }

    if (pagename)
      dtemp_fmtval = w.fmtHTML(pagename, dtemp);
    else dtemp_fmtval = dtemp;

    if (nds[i].dataset.insert === undefined) {
      nds[i].dataset.insert = 'replace';
    }

    if (nds[i].tagName === 'SELECT') {

      if (!((/<option .*option>/i).test(dtemp_fmtval)) ) {

        for (let o of nds[i].options) {
          if (o.value == dtemp) {
            o.selected = true;
            break;
          }
        }

        continue;
      }
    } else if (nds[i].tagName === 'INPUT') {
      if (['checkbox', 'radio'].indexOf(nds[i].type) >= 0) {
          if (typeof dtemp === 'boolean') {
            nds[i].checked = dtemp;
            continue;
          }
      }
    }

    if (nds[i].value !== undefined && nds[i].tagName !== 'SELECT') {
      switch (nds[i].dataset.insert) {
        case 'before':
          nds[i].value = `${dtemp}${nds[i].value}`;
          break;
        case 'end':
          nds[i].value = `${nds[i].value}${dtemp}`;
          break;
        default:
          nds[i].value = dtemp;
      }
    } else {
      //开启后，则检测html文本是否存在语法错误。
      if (w.checkhtml) {
        if (!w._htmlcheck(dtemp_fmtval)) {
          return false;
        }
      }

      switch (nds[i].dataset.insert) {
        case 'before':
          nds[i].insertAdjacentHTML('afterbegin', dtemp_fmtval);
          break;
        case 'end':
          nds[i].insertAdjacentHTML('beforeend', dtemp_fmtval);
          break;
        default:
          nds[i].innerHTML = dtemp_fmtval;
      }
      if (pagename)
        w.initPageDomEvents(pg, nds[i]);
      else if (pagename === 0) {
        //如果在组件里，使用view，则需要执行initPageDomEvents，目前使用pagename为0表示组件内调用。
        w.initPageDomEvents(pg, nds[i]);
      }
    }

    dtemp = '';
    dtemp_fmtval = '';
  }

};

w.data = {};

w.bind = new Proxy(w.data, {
  set: (obj, k, data) => {
    obj[k] = data;

    let qstr = `[data-bind=${k}]`;
    let nds = w._queryGlobal(qstr);

    for (let n of nds) {
      n.innerHTML = data;
    }

    return true;
  },

  deleteProperty : (obj, k) => {
    delete obj[k];

    let qstr = `[data-bind=${k}]`;
    let nds = w._queryGlobal(qstr);
    
    for (let d of nds) {
      d.innerHTML = '';
    }
    return true;
  }
});

w._make_page_bind = function (pagename) {
  let pxy = new Proxy(w.pages[pagename].data, {
    set: (obj, k, data) => {
      obj[k] = data;

      let qstr = `[data-bind=${k}]`;
      let nds = w.pages[pagename].queryAll(qstr);

      if (nds.length === 0) {
        nds = w._queryGlobal(qstr);
      }

      try {
        w._setData(pagename, w.pages[pagename], nds, data);
      } catch (err) {
        if (w.debug) {
          w.notifyError(err.message, 3500);
          console.error(err);
        } else {
          w.__cacheError(err);
        }
      }

      return true;
    },

    deleteProperty : (obj, k) => {
      delete obj[k];

      let qstr = `[data-bind=${k}]`;
      let nds = w.pages[pagename].queryAll(qstr);

      if (nds.length === 0) {
        nds = w._queryGlobal(qstr);
      }
      
      for (let d of nds) {
        d.innerHTML = '';
      }

      return true;
    }
  });
  
  Object.defineProperty(w.pages[pagename], 'bind', {
    value: pxy,
    writable: false
  });
};

w._page_style_bind = function (pname) {
  w.pages[pname].__style__ = {};

  let pxy = new Proxy(w.pages[pname].__style__, {
    set: (obj, k, data) => {
      obj[k] = data;

      let styleData = {}
      
      styleData[k] = {
        style: data
      };

      w.setAttr(pname, styleData);

      return true;
    },

    get: (obj, k) => {
      if (obj[k]) return obj[k];
      return null;
    },

    deleteProperty: (obj, k) => {
      if (obj[k]) {
        delete obj[k];
      }

      return true;
    }
  });

  Object.defineProperty(w.pages[pname], 'style', {
    value: pxy,
    writable: false
  });
};

w.parseform = function (fd) {
  let m = {
    node : fd,
    childs : {},
    buttons : {},
    submit : null,
    files : {},
    values : {}
  };

  let inds = fd.querySelectorAll('input');
  let secnds = fd.querySelectorAll('select');
  let textnds = fd.querySelectorAll('textarea');

  for (let i=0; i<inds.length; i++) {
    if (inds[i].name === undefined || inds[i].name === '') {
      continue;
    }

    m.childs[inds[i].name] = inds[i];
    switch (inds[i].type) {
      case 'text':
      case 'number':
      case 'email':
        m.values[inds[i].name] = inds[i].value.trim(); break;
      case 'button':
        m.buttons[inds[i].name] = inds[i]; break;
      case 'submit':
        m.submit = inds[i]; break;
      case 'file':
        if (inds[i].files.length > 0) {
          m.files[inds[i].name] = inds[i].files;
        }break;

      case 'checkbox':
        if (inds[i].checked) {
          if (m.values[inds[i].name]) {
            m.values[inds[i].name].push(inds[i].value);
          } else {
            m.values[inds[i].name] = [ inds[i].value ];
          }
        } break;
      case 'radio':
        if (inds[i].checked) {
          m.values[inds[i].name] = inds[i].value;
        } break;
      default:
        m.values[inds[i].name] = inds[i].value;
    }
  }

  for (let i=0; i < secnds.length; i++) {
    if (secnds[i].name === undefined || secnds[i].name === '') {
      continue;
    }
    if (secnds[i].options.length <= 0) {
      continue;
    }

    m.childs[secnds[i].name] = secnds[i];
    m.values[ secnds[i].name ] = secnds[i].options[secnds[i].selectedIndex].value;
  }

  for (let i = 0; i < textnds.length; i++) {
    if (textnds[i].name === undefined || textnds[i].name === '') {
      continue;
    }

    m.childs[textnds[i].name] = textnds[i];
    m.values[ textnds[i].name ] = textnds[i].value;
  }

  return m;
};

//需要钩子机制来全局处理一些操作然后再调用真正的页面。
//钩子是一个对象，其中要包括hook函数（async function），执行此函数时会
//把请求上下文传递过去,如果函数返回false或null则表示禁止执行下一步，
//抛出错误也禁止执行下一步。
Object.defineProperties(w, {
  hooks: {
    value: [],
    writable: false,
    enumerable: false,
    configurable: false,
  },

  hookFunc: {
    value: {},
    writable: false,
    enumerable: false,
    configurable: false,
  }
});

//w.hooks = [];
//w.hookFunc = {};

/**
 * 
 * @param {function} callback 
 * @param {string|object} name 
 * @returns 
 */
w.addHook = function (callback, name='') {
  if (typeof callback !== 'function') {
    return w.notifyError(`${callback}不是function`);
  }

  let opts = {
    name: typeof name === 'string' ? name : '',
    page: null,
    exclude: null,
    mode: 'always',
    count: 0
  };

  if (typeof name === 'object') {
    if (name.name) opts.name = name.name;

    if (name.page) {
      if (typeof name.page === 'string') {
        name.page = [name.page];
      }
      if (Array.isArray(name.page)) opts.page = [...name.page];
    }

    if (name.exclude) {
      if (typeof name.exclude === 'string') {
        name.exclude = [name.exclude];
      }

      if (Array.isArray(name.exclude)) opts.exclude = [...name.exclude];
    }

    if (name.mode && ['always', 'once'].indexOf(name.mode) >= 0) {
      opts.mode = name.mode;
    }
  }

  if (!opts.name) opts.name = (Math.random().toString(16).substring(2));

  if (!w.hookFunc[opts.name]) {
    w.hookFunc[opts.name] = {func: callback, options: opts};
    w.hooks.push(opts.name);
  } else {
    w.hookFunc[opts.name] = {func: callback, options: opts};
  }

  return w;
};

w.removeHook = function (name) {
  let ind = w.hooks.indexOf(name);
  if (ind < 0) return false;
  delete w.hookFunc[name];
  w.hooks.splice(ind, 1);
  return true;
};

w.resetHookCount = function (name) {
  let ind = w.hooks.indexOf(name);
  if (ind < 0 || !w.hookFunc[name]) return false;
  w.hookFunc[name].options.count = 0;
};

w.hashchange = null;

w.runHooks = async function (ctx) {
  try {
    let cname = ctx.path;
    let ch;
    for (let h of w.hooks) {
      ch = w.hookFunc[h];
      if (!ch || !ch.func || typeof ch.func !== 'function')
        continue;
      if (ch.options.exclude && ch.options.exclude.indexOf(cname) >= 0) {
        continue;
      }

      if (ch.options.page && ch.options.page.indexOf(cname) < 0) {
        continue;
      }

      if (ch.options.mode === 'once' && ch.options.count > 0) {
        continue;
      }

      ch.options.count += 1;
      if (false === await ch.func(ctx)) {
        return false;
      }
    }
  } catch (err) {
    w.notify(err.message, {ntype:'error'});
    return false;
  }

  return true;
};

w.events = {
  scroll : function () {
    if (w.curpage) {
      w.curpage.scroll = w.curpage.__dom__.scrollTop;
      let h = w.curpage.__dom__.clientHeight + w.curpage.scroll;
      
      if (typeof w.curpage.onscroll === 'function') {
        try {
          w.curpage.onscroll(w.curpage.__dom__.scrollTop,
            w.curpage.__dom__.clientHeight,
            w.curpage.__dom__.scrollHeight);
        } catch (err){}
      }

      var isBottom = false;
      if (w.isFirefox) {
        isBottom = (Math.abs(h - w.curpage.__dom__.scrollHeight) <= 1.21);
      } else {
        isBottom = (Math.abs(h - w.curpage.__dom__.scrollHeight) < 1.56);
      }

      if (w.curpage.scroll <= 0.0000001) {
        if (typeof w.curpage.ontop === 'function') {
          if (!w.curpage.onTopLock) {
            w.curpage.onTopLock = true;
            try {
              w.curpage.ontop();
            } catch (err){}
            w.curpage.onTopLock = false;
          }
        }
      } else if (isBottom) {
        if (typeof w.curpage.onbottom === 'function') {
          try {
            let tm = Date.now();
            if (tm - w.curpage.bottomTime > 900) {
              w.curpage.bottomTime = tm;
              setTimeout(() => {
                let t = w.curpage.__dom__.clientHeight + w.curpage.__dom__.scrollTop;
                if (w.curpage.__dom__.scrollHeight - t < 1.56) {
                  w.curpage.onbottom(w.curpage.__dom__.scrollHeight);
                }
              }, 350);
            }
          } catch (err) {console.log(err);}
        } else {}
      }
    } else { }
    
  },
  resize : function () {
    if (w.curpage && typeof w.curpage.onresize === 'function') {
      try {
        w.curpage.onresize(w.curpage.__dom__);
      } catch (err) {
        w.notifyError(err.message);
      }
    }
  },
};

//如果设置为函数，会首先进行初始化，但是会在初始化页面以后
w.init = null;

w.tabs = {
  cur : null,
  background : '#fafaff',
  selectedBackground : '#f1f2f3',
  list : [],
  pages : [],
  pageIndex : {}
};

w.switchTab = function (p) {
  if (w.tabs.cur === p || w.tabs.pages.indexOf(p) < 0) {
    return;
  }

  this.listenHashLock = true;
  location.hash = '';
  this.listenHashLock = false;

  let nds = w.tabsmenudom.childNodes;
  let pind = 0;
  for (let i = 0; i < nds.length; i++) {
    pind = nds[i].id.indexOf(p);
    if (pind > 0 && nds[i].id.substring(pind) === p) {
      nds[i].style.background = w.tabs.selectedBackground;
      if (w.tabs.list[i].selectedIcon && w.tabs.list[i].selectedIcon.length > 0) {
        let imgdom = nds[i].querySelector('img')
        if (imgdom) {
          imgdom.src = imgdom.dataset.url + w.tabs.list[i].selectedIcon;
        }
      }
    } else {
      nds[i].style.background = w.tabs.background;
      if (w.tabs.list[i].icon && w.tabs.list[i].icon.length > 0) {
        let imgdom = nds[i].querySelector('img')
        if (imgdom) {
          imgdom.src = imgdom.dataset.url + w.tabs.list[i].icon;
        }
      }
    }
  }

  w.tabs.cur = p;
  w.loadPage(w.parseHashUrl(p));
};

w.navi = function (htext, opts = {}) {
  let classtext = `w-navigate-btn`;
  if (opts.position) {
    if (['left','right', 'bottom'].indexOf(opts.position) < 0 ) {
      opts.position = 'left';
    }
  } else {
    opts.position = 'left';
  }
  
  classtext += ` w-navigate-btn-${opts.position}`;
  if (opts.background === undefined) {
    opts.background = true;
  }

  if (opts.background === true || opts.background === 'default') {
    classtext += ` w-navigate-btn-bk`;
  } else if (opts.background === 'rgba') {
    classtext += ` w-navigate-btn-bkrgba`;
  } else if (opts.background === 'lucency') {
    classtext += ` w-navigate-btn-bklucency`;
  }

  if (opts.up && opts.position !== 'bottom') {
    classtext += ' w-navigate-btn-up';
  }

  setTimeout(() => {
    w.navibtndom.className = classtext;
    w.navibtndom.innerHTML = w.fmtHTML(w.curpagename, htext);
    w.initPageDomEvents(opts.context || w.curpage, w.navibtndom);
  }, 5);
  
};

w.naviGlass = function (htext, lr='left', up = false) {
  w.navi(htext, {position: lr, background: 'glass', up: up});
};

w.naviHide = function () {
  w.navibtndom.innerHTML = '';
  w.navibtndom.className = '';
};

Object.defineProperty(w, '_devents', {
  enumerable: false,
  writable: false,
  configurable: false,
  value: [
    'animationcancel', 'animationend', 'animationiteration', 'animationstart',
    'blur', 'click', 'copy', 'cut', 'compositionend', 'compositionstart', 'compositionupdate',
    'change', 'contextmenu', 'dblclick', 'drag', 'dragend', 'dragleave', 'dragstart', 'dragover', 
    'auxclick', 'securitypolicyviolation', 'beforematch',
    'dragenter', 'drop', 'error', 'fullscreenchange', 'fullscreenerror', 'focus', 'focusin',
    'focusout', 'input', 'keyup', 'keydown', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 
    'mouseout', 'mouseover', 'mouseup', 'pointercancel', 'pointerdown', 'pointerenter', 
    'pointerleave', 'pointermove', 'pointerout', 'pointerover', 'pointerup', 'paste', 
    'submit', 'scroll', 'scrollend', 'select', 'transitioncancel', 'transitionend', 'transitionrun',
    'transitionstart', 'touchcancel', 'touchend', 'touchmove', 'touchstart',  'wheel'
  ]
});

w.initDomEvent = function (pg, dom, evtname) {
  if (!dom || !dom.querySelectorAll) return false;
  
  let nds = dom.querySelectorAll('form');

  for (let d of nds) {
    if (!d.onsubmit) {
      d.onsubmit = () => {
        return false;
      };
    }
  }

  nds = dom.querySelectorAll(`[data-on${evtname}]`);

  for (let d of nds) {
    d.addEventListener(evtname, 
      w.genEventProxy(pg, d.dataset[`on${evtname}`])
    );
  }

};

w.initPageDomEvents = function (pg, dom) {
  for (let e of w._devents) {
    w.initDomEvent(pg, dom, e);
  }
};

w.eventProxy = function (evt, pg, funcname) {

  let wind = funcname.trim().indexOf('w.ext.');
  let wfunc = null;

  if (wind === 0) {
    wfunc = w.ext[funcname.substring(8)];
    if (typeof wfunc !== 'function') {
      if (evt.target && evt.target.dataset.noterror) return false;
      w.notifyError(`${funcname} is not a function.`);
      return false;
    }
  }
  else if (!pg || !pg[funcname] || !(typeof pg[funcname] === 'function')) {
    if (evt.target && evt.target.dataset.noterror) return false;
    w.notifyError(`${funcname} is not a function.`);
    return false;
  }

  let a = {
    target: evt.target,
    currentTarget: evt.currentTarget,
    event: evt,
    type: evt.type,
    value: '',
  }

  let tag = evt.target.tagName.toLowerCase();

  a.tag = tag;

  if (tag === 'form') {
    a.form = w.parseform(evt.target);
    a.value = a.form.values;
  } else if (tag === 'input' || tag === 'textarea') {
    a.value = a.target.value || '';

    switch (a.target.type) {
      case 'file':
        a.files = a.target.files;
        break;
      case 'checkbox':
        a.checked = a.target.checked;
        break;
      default:
        ;
    }
  } else if (tag === 'select') {
    a.value = a.target.options[ a.target.selectedIndex ].value;
  }

  a.data = a.value;

  try {
    if (wind === 0) {
      return wfunc(a);
    }

    return pg[funcname](a);
  } catch (err) {
    w.notify(err.message, 'error');
  }
};

w.genEventProxy = function (pg, funcname) {
  return (evt) => {
    return w.eventProxy(evt, pg, funcname);
  };
};

w._http_preg = new RegExp('^http[s]?:/'+'/', 'i');

Object.defineProperty(w, '__mod__', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: Object.create(null)
});

window._import = w.import = async function (path, reload=false) {
  if (w.__mod__[path] && !reload) {
    return w.__mod__[path];
  }

  try {
    let mod;
    if (w._http_preg.test(path)) {
      mod = await import(path).then(mod => {
        return mod;
      });
    }

    if (path[0] !== '/') path = `/${path}`;
    
    let randnm = parseInt(Math.random() * 10000);

    mod = await import(`${w.prepath}${path}?rand=${randnm}`)
                .then(m => {
                  return m;
                });

    w.__mod__[path] = mod;

    return mod;
  } catch (err) {
    w.notifyError(`import module:<p>${err.message}</p>`, 5000);
  }
};

Object.defineProperty(w, '__ext__', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: Object.create(null)
});

w.ext = new Proxy(w.__ext__, {
  set: (obj, k, data) => {
    if (!obj[k]) {
      obj[k] = data;
      return true;
    }
    else {
      console.error(`${k}: 扩展名重复，请检查。`);
    }
    
  },

  get: (obj, k) => {
    if (obj[k]) return obj[k];
    console.error(`${k}: 没有此扩展。`);
  },

  deleteProperty : (obj, k) => {
    if (obj[k]) delete obj[k];

    return true;
  }
});

Object.defineProperty(w, '__require_loop__', {
  value: 111,
  configurable: false,
  writable: false,
  enumerable: false
});

window.require = async function (name) {
  try {
    if (w.__ext__[name]) return w.__ext__[name];
    
    let loop = w.__require_loop__;

    for (let i = 0; i < loop; i++) {
      await new Promise((rv) => {
        setTimeout(() => { rv(); }, 5);
      });

      if (w.__ext__[name]) return w.__ext__[name];
    }

    throw new Error(`${name}: 没有此扩展。`);
  } catch (err) {
    console.error(err.message);
    console.error('请检查扩展是否启用或是否存在循环引用。');
  }
};

Object.defineProperties(w, {
  'shareData': {
    writable: false,
    value: {}
  },
  'shareNoticeList': {
    writable: false,
    value: {
      length: 0,
      funcmap: {}
    }
  }
});

/**
 * mode默认为一直执行，或者是选择once表示执行一次则删除。
 * @param {object} options callback, type, mode
 */
w.registerShareNotice = function (options) {

  if (w.shareNoticeList.length >= 10101) {
    w.notifyError('注册通知函数已达上限，不能超过10101个。');
    return false;
  }

  if (!options.type) options.type = 'set';
  if (!options.mode) options.mode = 'always';
  if (!options.key) {
    w.notifyError('注册通知函数必须明确指定key，若要全部监听，则使用*作为key值。');
    return false;
  }

  options.count = 0;

  if (!options.callback || typeof options.callback !== 'function') {
    w.notifyError('没有callback函数用于通知回调。');
    return false;
  }

  options.id = `${options.key}.${Math.random().toString(16).substring(2)}${Date.now()}`;

  if (!w.shareNoticeList.funcmap[ options.key ]) {
    w.shareNoticeList.funcmap[ options.key ] = [ options ];
  } else {
    if (options.only) return false;
    let kn = w.shareNoticeList.funcmap[ options.key ];
    if (kn.length >= 111) {
      w.notifyError('同一个key注册通知函数不能超过111个。');
      return false;
    }
    kn.push(options);
  }

  w.shareNoticeList.length += 1;

  return options.id;
};

w.removeShareNotice = function (id) {
  let dotind = id.indexOf('.');

  let km;
  if (dotind < 0) km = id;
  else km = id.substring(0, dotind);

  if (!km || !w.shareNoticeList.funcmap[km]) return false;

  if (km === id) {
    w.shareNoticeList.funcmap[km] = null;
    return true;
  }

  let kmap = w.shareNoticeList.funcmap[km];
  let ind = 0;

  for (let a of kmap) {
    if (a.id === id) {
      kmap.splice(ind, 1);
      w.shareNoticeList.length -= 1;
      return a;
    }
    ind += 1;
  }
};

w.runShareNotice = function (type, obj, k, data = null) {
  let kmlist = w.shareNoticeList.funcmap[k];
  let gkmlist = w.shareNoticeList.funcmap['*'];

  if (!kmlist && !gkmlist) return;

  if (!kmlist) kmlist = [];
  if (!gkmlist) gkmlist = [];

  let rlist = kmlist.concat(gkmlist);

  let delids = [];

  for (let a of rlist) {
    if (a.type !== 'all' && a.type !== type) continue;
    if (a.mode === 'once' && a.count > 0) {
      delids.push(a.id);
      continue;
    }

    a.count < 10000000 && (a.count += 1);
    try {
      a.callback({
        type,
        obj,
        key: k,
        data: data
      });
    } catch (err) {
      w.notifyError(err.message);
    }
  }

  if (delids.length > 0) {
    for (let id of delids) {
      w.removeShareNotice(id);
    }
  }

};

Object.defineProperty(w, 'share', {
  writable: false,
  value: new Proxy(w.shareData, {
    set: (obj, k, data) => {
      obj[k] = data;
      w.runShareNotice('set', obj, k, data);
      return true;
    },
  
    get: (obj, k) => {
      w.runShareNotice('get', obj, k);
      return obj[k] || null;
    },
  
    deleteProperty : (obj, k) => {
      if (obj[k] !== undefined) {
        w.runShareNotice('delete', obj, k);
        delete obj[k];
      }
      return true;
    }
  })
});

w.loadScript = async function (src, cname = '') {

  if (!w._http_preg.test(src)) {
    if (cname && src.indexOf('./static') === 0) {
      src = src.replace('./static', '/component/' + cname);
    }

    if (src[0] !== '/') src = `/${src}`;

    src = `${w.prepath}${w.prepath.length > 0 ? '/' : ''}${src}`;
  }

  let d = document.createElement('script');

  return new Promise((rv, rj) => {
    d.type = 'text/javascript';
    d.src = src;
    document.body.appendChild(d);

    d.onerror = err => {
      rj(err);
    };

    d.onload = () => {
      rv({ok: true, msg: 'success'});
    };

  });

};

Object.defineProperty(w, '__bindpage__', {
  enumerable: false,
  writable: false,
  configurable: false,
  value: (pname) => {
    return (obj) => {
      if (typeof obj === 'function') {
        try {
          if (obj.prototype) { w.pages[pname] = new obj(); }
          else { w.pages[pname] = obj(); }
        } catch (err) {w.alertError(err.message);}
      } else if (typeof obj === 'object') {
        w.pages[pname] = obj;
      } else {
        w.pages[pname] = {};
        setTimeout(() => {
          w.alertError(`${pname} 页面初始化有误，不是合法的object也不是函数。`);
        }, 1500);
      }

      w.initOnePage(pname);
    }
  }
});

Object.defineProperty(w, '__module__', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: (name) => {
    let oo = {}
    Object.defineProperty(oo, 'exports', {
      set: (val) => {
        if (w.__ext__[name]) delete w.__ext__[name];
        w.ext[name] = val;
      },
      get: () => {
        return name;
      }
    });

    return oo
  }
})

w.__comps_loop__ = {};

class Component extends HTMLElement {
  constructor () {
    super();

    //this就是节点。
    this.shadow = this.attachShadow({mode: 'closed'});
    
    Object.defineProperty(this, '__attrs__', {
      value: Object.create(null),
      configurable: false,
      writable: false,
      enumerable: true
    });

    Object.defineProperty(this, '__init__', {
      value: false,
      configurable: false,
      writable: true,
      enumerable: false
    });

    this.allAttrs = () => {return this.__attrs__;};

    this.attrs = new Proxy(this.__attrs__, {
      set: (obj, k, data) => {
        let oldval = (obj[k] === undefined) ? null : obj[k];
        if (this.properties[k]) {
          obj[k] = this._propValue(this.properties[k], data);
          this[k] = data;
        } else {
          obj[k] = data;
        }
        
        try {
          ;(typeof this.onattrchange === 'function') && this.onattrchange(k, oldval, obj[k]);
        } catch (err) {
          w.debug && console.error(err);
        }
        return true;
      },

      get: (obj, k) => {
        if (this.attributes[k] !== undefined && obj[k] === undefined) {
          obj[k] = this._propValue(this.properties[k]||{}, this.attributes[k].value);
        }

        if (obj[k] === undefined) return null;
        return obj[k];
      },

      deleteProperty: (obj, k) => {
        if (obj[k] !== undefined) {
          let oldval = obj[k];
          delete obj[k];
          //声明了properties的会默认设置到this上，也会删除。
          if (this.properties[k] && (!this.notDelete || this.notDelete.indexOf(k) < 0)) {
            delete this[k];
          }

          try {
            ;(typeof this.onattrchange === 'function') && this.onattrchange(k, oldval, null);
          } catch (err) {
            w.debug && console.error(err);
          }
        }

        return true;
      }
    });

    queueMicrotask(this.__queue_task_init__.bind(this));
  }

  async __queue_task_init__() {
    if (!this.properties || typeof this.properties !== 'object') this.properties = {};
    if (this.notDelete && !Array.isArray(this.notDelete)) {
      this.notDelete = [this.notDelete];
    }

    let typ;
    for (let k in this.properties) {
      typ = typeof this.properties[k];
      if (typ === 'string') {
        this.properties[k] = {
          type: this.properties[k]
        };
      } else if (typ !== 'object') { continue; }
      
      if (this.properties[k].default !== undefined) {
        this.__attrs__[k] = this.properties[k].default;
      }
    }
    
    for (let a of this.attributes) {
      if (this.properties[a.name]) {
        this.__attrs__[a.name] = this._propValue(this.properties[a.name], a.value);
        continue;
      }
      this.__attrs__[a.name] = a.value;
    }

    if (this.init && typeof this.init === 'function') {
      try {
        if (this.init.constructor.name === 'AsyncFunction') {
          await this.init();
        } else {
          this.init();
        }
      } catch (err) {
        w.debug && console.error(err);
        w.debug && w.notifyTopError(err.message);
      }
    }

    if (this.render && typeof this.render === 'function') {
      let d = this.render() || '';
      this.initPlateTemplate(null, d);
    }

    if (this.afterRender && typeof this.afterRender === 'function') {
      this.afterRender();
    }
  }

  _propValue (obj, val) {
    if (!obj || typeof obj !== 'object') return val;

    if (!obj.type) return val;

    switch (obj.type) {
      case 'number':
      case 'int':
        val = parseInt(val);
        break;
      case 'float':
        val = parseFloat(val);
        break;

      case 'json':
        if (typeof val === 'string') {
          try {
            val = JSON.parse(val);
          } catch (err) {
            val = {};
          }
        } else {val = {}}
        break;
    }

    if (typeof val !== 'object' && obj.limit !== undefined && Array.isArray(obj.limit)) {
      if (obj.limit.indexOf(val) < 0)
        return (obj.default !== undefined ? obj.default : obj.limit[0]);
    } else if (typeof val === 'number') {
      let valState = 0;
      if (obj.min !== undefined && val < obj.min) valState = -1;
      if (obj.max !== undefined && val > obj.max) valState = 1;

      if (valState !== 0)
        return (obj.default !== undefined ? obj.default : (valState < 0 ? obj.min : obj.max));
    }

    return val;
  }

  checkLoopRef (d) {
    let lname = `<${this.tagName.toLowerCase()}`;
    
    let tagname = lname + '>';

    let istart = this.outerHTML.indexOf(lname);
    let iend = this.outerHTML.indexOf('>') + 1;
    let outername = this.outerHTML.substring(istart, iend);

    let st = {ok: true, outername, tagname};

    if (typeof d === 'string') {
      if (d.indexOf(outername) >= 0) {
        st.ok = false;
        return st;
      }
    }
    else if (d.innerHTML.indexOf(outername) >= 0) {
      st.ok = false;
      return st;
    }

    let p = this.parentNode;

    let localname = lname.substring(1);
    if (!w.__comps_loop__[localname])
      w.__comps_loop__[localname] = [];
    
    while (p) {
      if (p.toString() !== '[object ShadowRoot]') {
        return st;
      }

      w.__comps_loop__[localname].push(p.host.localName);

      p = p.parentNode;
    }

    let ref_count = 1;

    let loopcheck = (arr, name) => {
      for (let a of arr) {
        if (a === name) ref_count++;
        if (ref_count > 2) return false;

        if (w.__comps_loop__[a].length > 0) {
          if (loopcheck(w.__comps_loop__[a], name) === false) return false;
        }
      }

      return true;
    };

    let lr = loopcheck(w.__comps_loop__[localname], localname);

    if (!lr) st.ok = false;

    return st;
  }

  notifyLoopRefError (st) {
    let outerText = st.outername.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    w.notifyError(`${this.tagName} [${outerText}]存在循环引用${st.ref ? ' &lt;--&gt; ' : ''}${st.ref || ''}`, 20000);
    return '';
  }
  
  //不会重复初始化基础结构。
  initPlateTemplate(id=null, d=null) {
    if (this.__init__) {
      return true;
    }

    if (!d) d = this.plate(id);
  
    if (typeof d === 'object' && d) {
      this.shadow.appendChild(d);
    } else if (typeof d === 'string' && d.length > 0) {
      let st = this.checkLoopRef(d);
      if ( st.ok === false ) {
        return this.notifyLoopRefError(st);
      }

      w._htmlcheck(d) && (this.shadow.innerHTML = d);
    }

    this.__init__ = true;

    w.initPageDomEvents(this, this.shadow);

    return true;
  }

  /**
   * 一个组件对应于一个template，plate可以有选择的使用不同的template。
   * @param {string} id 
   * @param {object} data 
   */
  plate (id = null, data = {}) {
    if (typeof id === 'object' && id) {
      data = id;
      id = null;
    }

    let tempid = this.tagName.toLowerCase();
    
    if (id && id[0] === '#') id = id.substring(1);

    let nd = w.__templatedom__.querySelector(`div[data-templateid=${tempid}]`);
    if (!nd) return false;
    if (id) {
      nd = nd.querySelector(`template[id=${id}]`);
    } else {
      nd = nd.querySelector('template');
    }

    if (!nd) return false;

    let init_style = true;
    if (w.__components_css__ && w.__components_css__[tempid]) {
      let csslist = w.__components_css__[tempid];
      if (csslist && Array.isArray(csslist) && csslist.length > 0) {
        let sty = '';
        let ctext= '';
        if (nd.content.firstChild && nd.content.firstChild.id === csslist[0]) {
          init_style = false;
        }

        if (init_style) {
            for (let i = csslist.length - 1; i>=0; i--) {
              if (!w.__css_code_map__ || !w.__css_code_map__[csslist[i]]) continue;
              try {
                sty = document.createElement('style');
                sty.id = csslist[i];
                //ctext = decodeURIComponent(w.__css_code_map__[csslist[i]]);
                ctext = w.__css_code_map__[csslist[i]];
                sty.appendChild(document.createTextNode(ctext));
                nd.content.insertBefore(sty, nd.content.firstChild);
              } catch (err) {
                console.error(err);
              }
            }
        }
      }
    }

    let st = this.checkLoopRef(nd);
    if ( st.ok === false ) {
      return this.notifyLoopRefError(st);
    }

    let d = nd.content.cloneNode(true);

    let nds;
    for (let k in data) {
      nds = d.querySelectorAll(`[data-name=${k}]`);
      w._setData(null, this, nds, data[k]);
    }

    return d;
  }

  _fmtquery (k) {
    let qcss = `[data-name=${k}]`;
    if (k[0] === '&') {
      qcss = k.substring(1);
    } else if (['.', ':', '#'].indexOf(k[0]) >= 0) {
      qcss = k;
    } else if (k.indexOf('[') >= 0) {
      return k;
    }

    return qcss;
  }

  view (data) {
    if (!this.__init__) {
      this.initPlateTemplate(null, null);
    }

    let qcss = '';
    let nds;
    
    for (let k in data) {
      qcss = this._fmtquery(k);
      nds = this.shadow.querySelectorAll(qcss);
      if (data[k] === null) {
        w._resetData(0, this, nds);
        continue;
      }

      try {
        w._setData(0, this, nds, data[k]);
      } catch (err) {
        if (w.debug) {
          w.notifyError(err.message, 3500);
          console.error(err);
        } else {
          w.__cacheError(err);
        }
      }
    }
  }

  resetView(qss) {
    if (!Array.isArray(qss)) qss = [qss];
    let data = {};
    for (let q of qss) {
      if (q && typeof q === 'string') {
        data[q] = null;
      }
    }
    this.view(data);
  }

  setAttr (data) {
    if (!data || typeof data !== 'object') {
      return;
    }

    let qcss, nds, attr;

    for (let k in data) {
      qcss = this._fmtquery(k);

      nds = this.shadow.querySelectorAll(qcss);
      if (nds.length === 0) continue;

      attr = data[k];
      for (let d of nds) {
        for (let a in attr) {
          switch (a) {
            case 'class':
              d.className = attr[a];
              break;

            case 'style':
              if (typeof attr[a] === 'string') {
                d.style.cssText = attr[a];
              } else if (typeof attr[a] === 'object') {
                for (let ak in attr[a]) {
                  d.style[ak] = attr[a][ak];
                }
              }
              break;

            default:
              d[a] = attr[a];
          }
        }
      }//end for nds

    }//end for data
  }

  queryAll (qss) {
    return this.shadow.querySelectorAll(qss);
  }

  query (qss) {
    return this.shadow.querySelector(qss);
  }

  connectedCallback () {
    if (this.onload && typeof this.onload === 'function') {
      this.onload();
    }
  }

  //remove from page
  disconnectedCallback () {
    if (this.onremove && typeof this.onremove === 'function') {
      this.onremove();
    }
  }

  //to new page
  adoptedCallback() {
    if (this.onadopted && typeof this.onadopted === 'function') {
      this.onadopted();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.onattrchange && typeof this.onattrchange === 'function') {
      this.onattrchange(name, oldValue, newValue);
    }
  }

  naviGlass (text, pr = 'left', up = false) {
    w.navi(text, { context: this, position: pr, background: 'glass', up });
  }

  naviHide () { w.naviHide(); }

  cover (info, options = {notClose: false, transparent: false}) {
    let notclose = !!options.notClose;

    if (!notclose) {
      info = `<div style="text-align:right;">`
            + `<span style="user-select:none;padding:0.15rem;text-decoration:none;cursor:pointer;" data-onclick=uncover>X</span>`
            + `</div>${info}`;
    }

    w.alert(info, {
      context: this,
      replace: true,
      notClose: true,
      withCover: true,
      shadow: true,
      transparent: !!options.transparent
    });
  };

  uncover () { w.unalert('shadow'); }

  loadScript (src) {
    return w.loadScript(src, this.tagName.toLowerCase());
  }

  sliderPage(text, append=false) { w.sliderPage(text, append, this); }

  hideSliderPage() { w.hideSliderPage(); }

  prompt(info, options={}) {
    if (!options || typeof options !== 'object') {
      options = {};
    }

    options.target = this;
    w.prompt(info, options);
  }

  unprompt() {w.unprompt();}

  promptTop(info, options={}) {
    options.wh = 'top';
    this.prompt(info, options);
  }

  promptMiddle(info, options={}) {
    options.target = this;
    w.promptMiddle(info, options);
  }

  promptDark(info, options={}) {
    options.target = this;
    w.promptDark(info, options);
  }

  promptMiddleDark(info, options={}) {
    options.target = this;
    w.promptMiddleDark(info, options);
  }

  promptTopDark(info, options={}) {
    options.target = this;
    w.promptTopDark(info, options);
  }

  findMethod(name, wh=['config', 'ext']) {
    if (typeof wh === 'string') wh = [wh];

    if (!wh || !Array.isArray(wh) || wh.length === 0) {
      wh = ['config', 'ext'];
    }

    for (let k of wh) {
      if (w[k] && w[k][name] && typeof w[k][name] === 'function') {
        return w[k][name];
      }
    }

    return null;
  }
}

exports.window = window;
exports.document = document;
exports.w = w;
exports.Component = Component;
exports.HTMLElement = HTMLElement;