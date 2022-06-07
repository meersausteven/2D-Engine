
class Project {
        editMode;

        // canvas
        canvas;
        canvasContext;
        
        // scenes
        sceneList = [];
        activeScene;
        
        // settings
        settings = {
                // canvas
                canvasSelector: '#gameArea',
                canvasHeight: 720,
                canvasWidth: 1280,
                canvasBackgroundColor: '#000000',
                canvasHideCursor: false,
                // fixed update interval in ms
                fixedUpdateInterval: 10,
                // rendering
                renderByYPosition: false,
                // editor dom elements for game objects and their components
                gameObjectListWrapper: '#game-objects-container .container_content',
                componentListWrapper: '#components-container .container_content',
                // file paths
                filePathSprites: window.location.href + "/../assets/sprites/",
                filePathAudio: window.location.href + "/../assets/audio/",
        };
        
        // available gameObjects
        availableGameObjects = [
                'GameObject',
                'CameraObject'
        ];

        // available components
        availableComponents = [
                'Camera',
                'BoxRenderer',
                'CircleRenderer',
                'SpriteRenderer',
                'PolygonRenderer',
                'PolygonCircleRenderer',
                'PolygonCapsuleRenderer',
                'BoxCollider',
                'CircleCollider',
                'CapsuleCollider',
                'Rigidbody',
                'Animation'
        ];

        // update cycles
        animationFrame;
        fixedUpdate;

        // input manager
        input = {
                keys: [],
                mouse: {
                        buttons: [],
                        pos: new Vector2()
                }
        };
        
        constructor(editMode = false) {
                this.editMode = editMode;

                // add new scene
                if (this.sceneList.length == 0) {
                        this.addScene(new Scene());
                }
                
                // prepare canvas
                this.canvas = document.querySelector(this.settings.canvasSelector);
                
                if (this.editMode == true) {
                        this.settings.canvasHeight = this.canvas.clientHeight;
                        this.settings.canvasWidth = this.canvas.clientWidth;
                }

                this.canvas.width = this.settings.canvasWidth;
                this.canvas.height = this.settings.canvasHeight;
                this.canvasContext = this.canvas.getContext("2d");
                this.canvasContext.imageSmoothingEnabled = false;
                this.canvas.addEventListener('project_settings_changed', this);
        }

        start() {
                // add event listeners for input
                if (this.editMode == false) {
                        this.addInputListeners();
                }

                // start first scene if no active scene is given
                if ((this.activeScene === null) ||
                        (typeof this.activeScene === 'undefined'))
                {
                        this.loadScene(0);
                }

                // start update cycles
                this.fixedUpdate = setInterval(this.processFixedUpdateFrame.bind(this), this.settings.fixedUpdateInterval);
                this.animationFrame = window.requestAnimationFrame(this.processFrame.bind(this));

                return true;
        }
        
        stop() {
                this.removeInputListeners();
                this.canvas.removeEventListener('project_settings_changed', this);

                clearInterval(this.fixedUpdate);
                window.cancelAnimationFrame(this.animationFrame);

                return true;
        }

        processFrame(currentTime) {
                // track time
                if (!time.startTime) {
                        time.startTime = currentTime / 1000;
                }
                
                if (!time.lastFrame) {
                        time.lastFrame = currentTime / 1000;
                }
                
                time.totalTime = (currentTime / 1000) - time.startTime;
                time.deltaTime = (currentTime / 1000) - time.lastFrame;
                time.lastFrame = currentTime / 1000;

                // process update frame in scene
                if ((this.activeScene !== null) &&
                    (typeof this.activeScene !== 'undefined'))
                {
                        this.activeScene.processUpdateFrame();
                }
                
                window.requestAnimationFrame(this.processFrame.bind(this));
        }

        processFixedUpdateFrame() {
                // process fixed update frame in scene
                if ((this.activeScene !== null) &&
                    (typeof this.activeScene !== 'undefined'))
                {
                        this.activeScene.processFixedUpdateFrame();
                }
        }

        addScene(scene) {
                if (scene instanceof Scene) {
                        scene.project = this;
                        this.sceneList.push(scene);

                        return true;
                }

                return false;
        }

        loadScene(index) {
                if ((this.sceneList[index] !== 'undefined') &&
                    (this.sceneList[index] !== null))
                {
                        this.activeScene = this.sceneList[index];
                        this.activeScene.start();

                        return true;
                }

                return false;
        }

        prepareForJsonExport() {
                let dummy = {};

                // project settings
                dummy.settings = {};
                for (let key in this.settings) {
                        dummy.settings[key] = this.settings[key];
                }

                // project active scene
                dummy.activeScene = this.getActiveSceneIndex();

                // project scene list
                dummy.sceneList = [];
                
                let i = 0;
                let l = this.sceneList.length;
                while (i < l) {
                        dummy.sceneList[i] = this.sceneList[i].prepareForJsonExport();

                        ++i;
                }

                let json = JSON.stringify(dummy);
                
                return json;
        }

        getActiveSceneIndex() {
                for (let i = 0; i < this.sceneList.length; i++) {
                        if (this.activeScene === this.sceneList[i]) {
                                return i;
                        }
                }

                console.log("ERROR: active scene not found in sceneList");
                return false;
        }

        syncSettings() {
                // hide cursor
                if (this.settings.canvasHideCursor &&
                        !this.canvas.classList.contains('no-cursor')) {
                        this.canvas.classList.add('no-cursor');
                } else if (!this.settings.canvasHideCursor &&
                        this.canvas.classList.contains('no-cursor')) {
                        this.canvas.classList.remove('no-cursor')
                }

                // change canvas background-color
                this.canvas.style.backgroundColor = this.settings.canvasBackgroundColor;
        }

        addInputListeners() {
                document.addEventListener("keydown", this);
                document.addEventListener("keyup", this);
                this.canvas.addEventListener("mousedown", this);
                this.canvas.addEventListener("mouseup", this);
                this.canvas.addEventListener("mousemove", this);
        }

        removeInputListeners() {
                document.removeEventListener("keydown", this);
                document.removeEventListener("keyup", this);
                this.canvas.removeEventListener("mousedown", this);
                this.canvas.removeEventListener("mouseup", this);
                this.canvas.removeEventListener("mousemove", this);
        }

        handleEvent(e) {
                switch (e.type) {
                        case "keydown":
                                this.onKeyDown(e);
                                break;

                        case "keyup":
                                this.onKeyUp(e);
                                break;

                        case "mousedown":
                                this.onMouseDown(e);
                                break;

                        case "mouseup":
                                this.onMouseUp(e);
                                break;

                        case "mousemove":
                                this.onMouseMove(e);
                                break;

                        case "project_settings_changed":
                                this.syncSettings(e);
                                break;
                        
                        default:
                                break;
                }
        }

        onKeyDown(e) {
                if (e.repeat) {
                        return;
                }

                this.input.keys.push(e.code);
                this.input.keys.clear();
        }

        onKeyUp(e) {
                this.input.keys.remove(e.code);
        }

        onMouseDown(e) {
                this.input.mouse.buttons.push(e.buttons);
                this.input.mouse.buttons.clear();
        }

        onMouseUp(e) {
                this.input.mouse.buttons.remove(e.buttons);
        }

        onMouseMove(e) {
                this.input.mouse.pos = new Vector2(e.clientX, e.clientY);
        }
}
